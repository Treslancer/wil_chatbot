from fastapi import Depends, status, HTTPException, Response, APIRouter, UploadFile, File
from llama_index.core import (
    VectorStoreIndex,
    SimpleDirectoryReader,
)
import tempfile
from llama_index.core import Document
import requests
import os
from app.services.knowledge_base_services import add_file_to_category, add_data, get_all_course, get_all_files,delete_course_file,delete_file
from app.services.mono_query import (
    get_vector_index, 
    create_agent_mono,
       get_docstore,
    query_fusion_retriever,
    create_bm25_retriever,
    )
from app.services.memory_services import ChatHistory
router = APIRouter(
    prefix="/mono",
    tags=["mono"]
)    

 

@router.get("/query_bm25/")
def query_mono_bm25(query: str, category:str, user: str ="user"):
    try:
        if not category in get_all_course():
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=f"{category} not found")
        #create vector retriever
        index = get_vector_index(category)
        vector_retriever = index.as_retriever(similarity_top_k=2)
        #create bm25 retriever
        docstore = get_docstore(category)
        bm25_retriever = create_bm25_retriever(docstore)
        #use fusion retriever
        engine =  query_fusion_retriever(vector_retriever,bm25_retriever)
        agent = create_agent_mono(engine,category)

        user_conversation = ChatHistory(subject=category,user_id=user)
        
        response = agent.chat(query, user_conversation.get_chat_history())
        user_conversation.add_message(query,str(response))
        return str(response)
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=str(e))

 












    