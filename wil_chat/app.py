from flask import Flask,jsonify, request
from item_collection import ItemCollection
from node_parser import NodeParser
from item_manager import ItemManager
from model_loader import ModelLoader
from llama_index import ServiceContext
import wilscraper
app = Flask(__name__)

item_collection = ItemCollection()
parse_node = NodeParser()  
model_loader = ModelLoader()
llm = model_loader.load_language_model()
embeddings = model_loader.load_embeddings_model()
node_parser = parse_node.sentence_splitter()
service_context = ServiceContext.from_defaults(llm=llm, embed_model=embeddings,node_parser=node_parser)
item_manager = ItemManager(service_context)

@app.route('/add_static_item', methods=['POST'])
def add_static_item():
    try:
        data = request.get_json()
        item = data.get('item')
        
        # Assuming item_manager.add_static_item might raise an exception, handle it
        item_manager.add_static_item(item)
        
        return jsonify({"message": "Item added successfully"})
    except Exception as e:
        return jsonify({"error": f"Failed to add item: {str(e)}"}), 500

@app.route('/delete_item', methods=['DELETE'])
def delete_item():
    try:
        data = request.get_json()
        item_name = data.get('item')

        if item_collection.does_filename_exist(item_name):
            item_manager.delete_item(item_name)
            return jsonify({"message": "Item deleted successfully"}), 200
        else:
            return jsonify({"message": "Item not found"}), 404

    except Exception as e:
        # Log the specific exception for debugging purposes
        print(f"Error deleting item: {str(e)}")
        return jsonify({"message": "Internal server error"}), 500

 


  




@app.route('/query_items', methods=['POST'])
def query_items():
    # Check if the request is valid and has JSON data
    if request.is_json:
        # Get the query from the JSON data
        query = request.json.get('query')
        # Check if the query is not None
        if query:
            # Call the item_manager.query_items function
            response = item_manager.query_items(query)
            # Check if the response is not empty
            
            if response:
                # Return the response as JSON with status code 200
                return jsonify({"response": response, 'type': 'response'}), 200
            else:
                # Return an error message as JSON with status code 404
                return jsonify({"error": "No items found for the query", 'type': 'error'}), 404
        else:
            # Return an error message as JSON with status code 400
            return jsonify({"error": "Missing query in the request", 'type': 'error'}), 400
    else:
        # Return an error message as JSON with status code 415
        return jsonify({"error": "Invalid request, expected JSON", 'type': 'error'}), 415

@app.route('/get_filename', methods=['GET'])
def get_filename():
    fileNames =  item_collection.get_filename()
    return jsonify({"fileNames": fileNames})


if __name__ == "__main__":
    app.run(debug=True)
