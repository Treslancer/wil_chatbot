from fastapi import Depends, status, HTTPException, Response, APIRouter, UploadFile, File
from llama_index.core import (
    VectorStoreIndex,
    SimpleDirectoryReader,
)
import tempfile
from llama_index.core import Document
import requests
import os
from .schemas import Text_knowledgeBase
from tempfile import TemporaryDirectory
from app.services.knowledge_base_services import(
add_file_to_category, 
add_data, 
get_all_course, 
get_all_files,
delete_course_file,
delete_file,
)

router = APIRouter(
    prefix="/knowledge",
    tags=["knowledge"]
)    

 

#to be added arg - db_name for the course
@router.post("/uploadfile/", description="Upload file")
async def upload_file(file: UploadFile,category:str):
 
    if add_file_to_category(category,file.filename):
           raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail=f"{file.filename} already exist")
    
    # Create a temporary directory using a context manager
    with TemporaryDirectory() as temp_dir:
        # Save the uploaded file content to the temporary directory
        temp_file_path = f"{temp_dir}/{file.filename}"
        file_content = await file.read()  # Read the uploaded file content
        with open(temp_file_path, "wb") as temp_file:
            temp_file.write(file_content)  # Write content to temporary file
        # Process the file using SimpleDirectoryReader with the full path
        data = SimpleDirectoryReader(input_files=[temp_file_path]).load_data()
        add_data(category, data)

        return Response(status_code=status.HTTP_200_OK, content="Successfully added to knowledge base")



@router.post("/downloadlink/", description="Add file using link")
async def upload_file_link(download_link: str, category:str):
  """
  Downloads a file from the specified URL and stores it in a temporary directory.

  Args:
      url (str): The URL of the file to download.

  Returns:
      str: The path to the downloaded file or None if there was an error.
  """
  # Create a temporary directory
  with tempfile.TemporaryDirectory() as tmpdir:
    # Extract filename from URL, considering the possibility of query parameters
    filename = download_link.split("/")[-1].split("?")[0]  # Get last part before '?'
    #prefixed_filename = f"Topic {topic}-{filename}"  # Add the prefix

    filepath = os.path.join(tmpdir, filename)
   

    # Send a GET request to download the file
    try:
      response = requests.get(download_link, stream=True)
      response.raise_for_status()  # Raise an exception for unsuccessful downloads
    except requests.exceptions.RequestException as e:
      print(f"Error downloading file: {e}")
      return None
    try:
        # Write the downloaded data to the temporary file
        with open(filepath, "wb") as f:
            for chunk in response.iter_content(1024):
                if chunk:  # filter out keep-alive new chunks
                    f.write(chunk)
        data = SimpleDirectoryReader(input_files=[filepath]).load_data()
        #nodes = SentenceSplitter(chunk_size=1024, chunk_overlap=20).get_nodes_from_documents(data)
        file_name = data[0].metadata['file_name']

        if add_file_to_category(category,file_name):
           raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail=f"{file_name} already exist")
        
        add_data(category, data)
        
        return Response(status_code=status.HTTP_200_OK, content="Successfully added to knowledge base")
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=str(e))
    
@router.post("/add_text_knowledge_base/", description="Add text to knowledge base")
async def add_text_knowledge_base(category:str, text:Text_knowledgeBase):
    try:  
        file_name = text.topic
        if add_file_to_category(category,file_name):
            raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail=f"{file_name} already exist")
        
    
        document = Document(
        text=text.text,
        metadata={
            "file_name": file_name,
        },
        excluded_llm_metadata_keys=[],
        metadata_seperator="::",
        metadata_template="{key}=>{value}",
        text_template="Metadata: {metadata_str}\n-----\nContent: {content}",
        )
        
        add_data(category, [document], text.topic)
        return Response(status_code=status.HTTP_200_OK, content="Successfully added to knowledge base")
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=str(e))
   

@router.delete("/collection/{file_name_to_delete}")
def delete_course_files(course_name: str, file_name_to_delete: str):  
    try:
        if not course_name in get_all_course():
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=f"{course_name} not found")

        if file_name_to_delete in get_all_files(course_name):
            delete_file(course_name,file_name_to_delete)
            delete_course_file(course_name,file_name_to_delete)
        else:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=f"{file_name_to_delete} not found")
        return Response(status_code=status.HTTP_204_NO_CONTENT)
    except ValueError as e:
        # Raise an HTTPException with status code 404 (Not Found) if the course is not found
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=str(e)) 
   

@router.get("/get_files/")
def get_course_files(course_name:str):
    try:
        result = get_all_files(course_name)
        if result:
            return result
        else:
            raise HTTPException(status_code=status.HTTP_204_NO_CONTENT, detail="No files or course found")
    except ValueError as e:
        # Raise an HTTPException with status code 404 (Not Found) if the course is not found
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=str(e))
    
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=str(e)) 

@router.get("/get_course/")
def get_course():
    try:
        result = get_all_course()
        if result:
            return result
        else:
            raise HTTPException(status_code=status.HTTP_204_NO_CONTENT)
    except ValueError as e:
        # Raise an HTTPException with status code 404 (Not Found) if the course is not found
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=str(e)) 

















    