
from item_collection import ItemCollection
from node_parser import NodeParser
from item_manager import ItemManager
from model_loader import ModelLoader
from llama_index import ServiceContext
def main():
    
    item_collection = ItemCollection()
    parse_node = NodeParser()  
    model_loader = ModelLoader()
    llm = model_loader.load_language_model()
    embeddings = model_loader.load_embeddings_model()
    node_parser = parse_node.sentence_splitter()
    service_context = ServiceContext.from_defaults(llm=llm, embed_model=embeddings,node_parser=node_parser)
    item_manager = ItemManager(service_context)
    while True:
        print("1. Add Item")
        print("2. Delete Item")
        print("3. Query Items")
        print("4. Print Items")
        print("5. Check Item exist")
        print("6. Quit")

        choice = input("Enter your choice: ")

        if choice == '1':
            item = input("Enter the item to add: ")
            item_manager.add_static_item(item)
        elif choice == '2':
            item = input("Enter the item to delete: ")
            item_manager.delete_item(item)
        elif choice == '3':
            query = input("Enter a query: ")
            results = item_manager.query_items(query)
            print("Query results:")
            print(results)
        elif choice == '4':
            print("Items:")
            fileNames =  item_collection.get_filename()
            for filename in fileNames:
                print(filename)
        elif choice == '5':
            checkFile = input("Enter a query: ")
            print("Item exist?:")
            print(item_collection.does_filename_exist(checkFile))
        elif choice == '6':
            break
        else:
            print("Invalid choice. Please try again.")

if __name__ == '__main__':
    main()
