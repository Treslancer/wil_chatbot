
from llama_index.core import (
    VectorStoreIndex,
    StorageContext,
)

from llama_index.retrievers.bm25 import BM25Retriever
from llama_index.core.retrievers import QueryFusionRetriever
from llama_index.core.query_engine import RetrieverQueryEngine
from llama_index.storage.docstore.mongodb import MongoDocumentStore
from llama_index.core import Document
import os
from llama_index.vector_stores.mongodb import MongoDBAtlasVectorSearch
from llama_index.core import Document
import pymongo
from llama_index.embeddings.openai import OpenAIEmbedding
from llama_index.core.tools import QueryEngineTool,ToolMetadata
from llama_index.agent.openai import OpenAIAgent
from llama_index.llms.openai import OpenAI
from llama_index.core.node_parser import SemanticSplitterNodeParser
from typing import List
from dotenv import load_dotenv
load_dotenv()

llm = OpenAI(temperature=0.7, model="gpt-3.5-turbo-0125")
MONGO_URI = os.getenv('MONGODB_CONNECTION_STRING')


    
def get_vector_index(category):
    client = pymongo.MongoClient(MONGO_URI)
    vector_store = MongoDBAtlasVectorSearch(
        client,
        db_name="Innovation_labs",
        collection_name=category,
        index_name=category
    )

    index = VectorStoreIndex.from_vector_store(vector_store)
    return index


def get_docstore(category:str):
    storage = StorageContext.from_defaults(
            docstore=MongoDocumentStore.from_uri(uri=MONGO_URI, namespace=category, db_name="Innovation_labs_docstore"),
            )
    return storage.docstore

def create_bm25_retriever(docstore):
    bm25_retriever = BM25Retriever.from_defaults(
    docstore=docstore, similarity_top_k=2
    )
    return bm25_retriever

def query_fusion_retriever(vector_retriever, bm25_retriever):
    retriever = QueryFusionRetriever(
    [vector_retriever, bm25_retriever],
    similarity_top_k=6,
    num_queries=1,  # set this to 1 to disable query generation
    mode="reciprocal_rerank",
    use_async=True,
    verbose=True,
    # query_gen_prompt="...",  # we could override the query generation prompt here
    )
    query_engine = RetrieverQueryEngine.from_args(retriever)
    return query_engine


def create_agent_mono(query_engine,course_name):
    query_engine_tool = QueryEngineTool(
        query_engine=query_engine,
        metadata=ToolMetadata(
            name="Documentation",
            description=(
                f"Provides information about the documentation of Wild Cats Innovation Labs "
                "Use a detailed plain text question as input to the tool."
            ),
        ),
    ),
    agent = OpenAIAgent.from_tools(
            query_engine_tool,
            llm=llm,
            verbose=True,
            
            system_prompt = f"""\
    You are a helpful assistant that answer queries about the Wild Cats Innovation labs
    Your primary goal is to provide clear and concise explanations.
    Please always use the tools provided to answer a question. Do not rely on prior knowledge.
"""

, 
)
    return agent








