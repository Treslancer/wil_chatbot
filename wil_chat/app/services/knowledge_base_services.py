
from llama_index.core import (
    VectorStoreIndex,
    StorageContext,
)


from llama_index.storage.docstore.mongodb import MongoDocumentStore
from llama_index.core import Document
import os
from llama_index.vector_stores.mongodb import MongoDBAtlasVectorSearch
from llama_index.core import Document
import pymongo
from llama_index.embeddings.openai import OpenAIEmbedding
from llama_index.core.node_parser import SemanticSplitterNodeParser
from typing import List
from dotenv import load_dotenv
load_dotenv()

embed_model = OpenAIEmbedding(model="text-embedding-3-small")
MONGO_URI = os.getenv('MONGODB_CONNECTION_STRING')

def add_data(category: str,data: List[Document],topic:str = ""):
    try:
        mongodb_client = pymongo.MongoClient(MONGO_URI)
        
        for doc in data:
            doc.metadata["Topic"] = topic
            doc.excluded_embed_metadata_keys  = ["file_path","file_size","creation_date","last_modified_date"]

        #Chunking
        splitter = SemanticSplitterNodeParser(
            buffer_size=1, breakpoint_percentile_threshold=95, embed_model=embed_model
            )
        nodes = splitter.get_nodes_from_documents(data)


        #create a vector index
        store = MongoDBAtlasVectorSearch(mongodb_client,db_name="Innovation_labs", collection_name=category)
        
        storage_context_vector = StorageContext.from_defaults(vector_store=store)
        VectorStoreIndex(nodes, storage_context=storage_context_vector, embed_model=embed_model)

        #add to docstore
        storage_context_docstore = StorageContext.from_defaults(
            docstore=MongoDocumentStore.from_uri(uri=MONGO_URI, namespace=category, db_name="Innovation_labs_docstore"),
            )
        storage_context_docstore.docstore.add_documents(nodes)
    
        print("Successfully Added to the Knowledge base")
    except ValueError as e:
        print(f"An error occurred: {e}")



def delete_file(category: str, file_name_to_delete: str):
    client = pymongo.MongoClient(MONGO_URI)
    db = client["Innovation_labs_docstore"] 


    collection_data = db[f"{category}/data"]
    filter_criteria_data = {"__data__.metadata.file_name": file_name_to_delete}
    # Delete documents matching the filter criteria
    result = collection_data.delete_many(filter_criteria_data)
    # Print the number of deleted documents
    print("Deleted count data:", result.deleted_count)

    filter_criteria_ref_doc_info = {"metadata.file_name": file_name_to_delete}
    
    collection_ref_doc_info = db[f"{category}/ref_doc_info"]
    documents_to_delete = collection_ref_doc_info.find(filter_criteria_ref_doc_info)
    # Extract _id values from the documents
    ids_to_delete = [doc["_id"] for doc in documents_to_delete]
    result = collection_ref_doc_info.delete_many(filter_criteria_ref_doc_info)
    print("Deleted count ref_doc_info:", result.deleted_count)

    deleted_count = 0
    collection_metadata = db[f"{category}/metadata"]
    for doc_id in ids_to_delete:
        result = collection_metadata.delete_many({"ref_doc_id": doc_id})
        deleted_count += result.deleted_count
    print("Deleted count metadata:",deleted_count)

    #DELETE vector nodes
    db = client["Innovation_labs"] 
    collection = db[category]
    filter_criteria_ref_doc_info = {"metadata.file_name": file_name_to_delete}
    result = collection.delete_many(filter_criteria_ref_doc_info)
    print("Deleted node vector:", result.deleted_count)


def add_file_to_category(category, file_name):
    client = pymongo.MongoClient(MONGO_URI)
    db = client["Innovation_labs"] 
    course_collection = db["records"]
    # Check if the course already exists
    course = course_collection.find_one({'category': category})
    if course:
        # Course already exists, check if file name exists in the list
        if file_name in course['file_names']:
            print(f"File '{file_name}' already exists for '{category}'.")
            return True
        else:
            # Add file name to the existing course
            course_collection.update_one(
                {'_id': course['_id']},
                {'$push': {'file_names': file_name}}
            )
            print(f"File '{file_name}' added to course '{category}'.")
            return False
    else:
        # Course doesn't exist, create a new document
        course_collection.insert_one({'category': category, 'file_names': [file_name]})
        print(f"category '{category}' created with file '{file_name}'.")
        return False

def get_all_files(course_name:str):
    client = pymongo.MongoClient(MONGO_URI)
    db = client["Innovation_labs"] 
    course_collection = db["records"]
    # Query the collection based on the course name
    result = course_collection.find_one({"category": course_name})
    # Check if the course exists
    if result:
        # Extract and return the list of file names
        file_names = result.get("file_names", [])
        if file_names:
            return file_names
        else:
            return None
    else:
        raise ValueError("category not found")

def get_all_course():
    client = pymongo.MongoClient(MONGO_URI)

    
    db = client["Innovation_labs"] 
    # Check if the "records" collection exists
    if "records" not in db.list_collection_names():
        raise ValueError("Records collection does not exist")
    
    course_collection = db["records"]
    result = course_collection.find({})
    course_names = [doc["category"] for doc in result]
    return course_names


def delete_course_file(category: str, file_name:str):
    client = pymongo.MongoClient(MONGO_URI)

    
    db = client["Innovation_labs"] 

    # Check if the "records" collection exists
    if "records" not in db.list_collection_names():
        raise ValueError("Records collection does not exist")
    
    course_collection = db["records"]
    # Check if the course exists
    course = course_collection.find_one({'category': category})
    if course:
        course_collection.update_one(
                    {'_id': course['_id']},
                    {'$pull': {'file_names': file_name}}
                )
    else:
        raise ValueError("category not found")
    