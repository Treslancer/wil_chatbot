import chromadb
from llama_index import SimpleDirectoryReader, SummaryIndex,VectorStoreIndex
from llama_index.vector_stores import ChromaVectorStore
from llama_index.storage.storage_context import StorageContext
from llama_index.indices.loading import load_index_from_storage
from item_collection import ItemCollection
from node_parser import NodeParser
from item_manager import ItemManager
from model_loader import ModelLoader
from llama_index import ServiceContext

item_collection = ItemCollection()
parse_node = NodeParser()  
model_loader = ModelLoader()
llm = model_loader.load_language_model()
embeddings = model_loader.load_embeddings_model()
node_parser = parse_node.sentence_splitter()
service_context = ServiceContext.from_defaults(llm=llm, embed_model=embeddings,node_parser=node_parser)

db = chromadb.PersistentClient(path="./chroma_db")
facebook_collection = db.get_or_create_collection("facebook")
vector_store_fb = ChromaVectorStore(chroma_collection=facebook_collection)
storage_context_fb = StorageContext.from_defaults(vector_store=vector_store_fb)
itemPath = "C:\\Users\\Gabriel\\Downloads\\text.pdf"
documentation = SimpleDirectoryReader(input_files=[itemPath]).load_data()        
nodes = service_context.node_parser.get_nodes_from_documents(documentation)
VectorStoreIndex(nodes, storage_context=storage_context_fb,service_context=service_context)
collection = db.get_collection(name="facebook")
print(collection.peek())