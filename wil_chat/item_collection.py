import chromadb
class ItemCollection:
    def __init__(self):
        db = chromadb.PersistentClient(path="./chroma_db")
        self.chroma_collection = db.get_or_create_collection("documentation")
        #make a try catch to check if collection exist

    def get_filename(self):
        data = self.chroma_collection.get()
        # Access the 'metadatas' list
        metadatas = data.get('metadatas', [])
        # Initialize an empty list to store the filenames
        unique_filenames = set()
        # Iterate through the list of dictionaries in 'metadatas'
        for metadata in metadatas:
            # Access the 'file_name' key and append it to the list
            filename = metadata.get('file_name')
            if filename:
                unique_filenames.add(filename)
        # Convert the set to a list
        filenames = list(unique_filenames)
    
        return filenames
    
    def does_filename_exist(self,filename):
        data = self.chroma_collection.get()
        # Access the 'metadatas' list
        metadatas = data.get('metadatas', [])
    
        # Iterate through the list of dictionaries in 'metadatas'
        for metadata in metadatas:
            # Access the 'file_name' key and compare it to the provided filename
            if metadata.get('file_name') == filename:
                return True
        return False