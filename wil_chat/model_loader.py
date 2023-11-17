import os
import openai
from llama_index.llms import OpenAI
from langchain.embeddings import SentenceTransformerEmbeddings
class ModelLoader:
    def __init__(self):
        os.environ['OPENAI_API_KEY'] = "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"
        openai.api_key = os.environ['OPENAI_API_KEY']
    def load_language_model(self):
        llm = OpenAI(model="gpt-3.5-turbo", temperature=0.3)
        return llm
    def load_embeddings_model(self):
        embeddings = SentenceTransformerEmbeddings(model_name="BAAI/bge-large-en-v1.5")
        return embeddings