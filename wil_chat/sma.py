from flask import Flask,jsonify, request
from item_collection import ItemCollection
from node_parser import NodeParser
from item_manager import ItemManager
from model_loader import ModelLoader
from llama_index import ServiceContext
app = Flask(__name__)


@app.route('/submit', methods=['POST'])
def submit():
    # Get the form data from the request object
    name = request.args.get('name')

    # Return a response to the client
    return f'Hello, {name}'



if __name__ == "__main__":
    app.run(debug=True)
