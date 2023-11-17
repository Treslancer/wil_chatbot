import chromadb
from llama_index import SimpleDirectoryReader, SummaryIndex,VectorStoreIndex
from llama_index.vector_stores import ChromaVectorStore
from llama_index.storage.storage_context import StorageContext
from llama_index.indices.loading import load_index_from_storage
from llama_index.tools import QueryEngineTool, ToolMetadata
from llama_index.query_engine import RouterQueryEngine
class ItemManager:
    def __init__(self,service_context):
        db = chromadb.PersistentClient(path="./chroma_db")
        self.chroma_collection = db.get_or_create_collection("documentation")
        self.facebook_collection = db.get_or_create_collection("facebook")
        self.service_context = service_context
        self.vector_store = ChromaVectorStore(chroma_collection=self.chroma_collection)
        self.storage_context = StorageContext.from_defaults(vector_store=self.vector_store)
        self.vector_store_fb = ChromaVectorStore(chroma_collection=self.facebook_collection)
        self.storage_context_fb = StorageContext.from_defaults(vector_store=self.vector_store_fb)
        
    def add_static_item(self, itemPath):
        try:
            documentation = SimpleDirectoryReader(input_files=[itemPath]).load_data()        
            nodes = self.service_context.node_parser.get_nodes_from_documents(documentation)
            VectorStoreIndex(nodes, storage_context=self.storage_context,service_context=self.service_context)
            print("Successfully Added to the Knowledge base")
        except ValueError as e:
            print(f"An error occurred: {e}")

          
    def delete_item(self, item_name):
           
        data = self.chroma_collection.get()
        # Access the 'metadatas' list
        metadatas = data.get('metadatas', [])
    
        # Iterate through the list of dictionaries in 'metadatas'
        for metadata in metadatas:
            # Access the 'file_name' key and compare it to the provided filename
            if metadata.get('file_name') == item_name:
                #delete the items in the collection
                self.chroma_collection.delete( where={"file_name": item_name})
                return True
        return False
        

    def query_items(self, query):
        item_count = self.chroma_collection.count()
        if item_count == 0:
            return "Knowledge base is Empty" 
        # load indices
        vector_index = VectorStoreIndex.from_vector_store(self.vector_store,storage_context=self.storage_context,service_context=self.service_context,)
        vector_index_fb = VectorStoreIndex.from_vector_store(self.vector_store_fb,storage_context=self.storage_context_fb,service_context=self.service_context,)

        vector_query_engine123 = vector_index.as_query_engine()
        vector_query_engine_fb = vector_index_fb.as_query_engine()
        vector_tool123 = QueryEngineTool(
        query_engine=vector_query_engine123,
        metadata=ToolMetadata(
        name="vector_search",
        description="Useful for searching for specific facts."))
        
        
        vector_tool_fb = QueryEngineTool(
        query_engine=vector_query_engine_fb,
        metadata=ToolMetadata(
        name="vector_search",
        description="Useful for searching for specific facts in facebook."))
        
        query_engine_router = RouterQueryEngine.from_defaults(
        [vector_tool123,vector_tool_fb],
        service_context=self.service_context,
        select_multi=True,
        )
        response = query_engine_router.query(query)
        return str(response)

