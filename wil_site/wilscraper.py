import requests
import schedule
import time
from datetime import datetime
from llama_index import Document 
import json
 
# Configuration for Facebook
PAGE_ID = '106180925472561'  # Replace with your page's ID
ACCESS_TOKEN = 'EAAI8xeOsCMoBO4mCkwBZAxjogkZBaGa5ZCiLuC2hqbzeE4AvBR1fZB7kjTL5zfAiRPdlIL8lmjAwd2xHIHEKY2hkEYqR6pZBZA6wUKqud440nxSS08AF4fKdykqLh85cg3dAMC7xK53XjEGRHEZAhtRgzVQRfdTQByZB7rLDVeVJE3rgVH7RhRjZBvBA81OXmXG6Qd2l09QHjvfVGNGAZD'  # Replace with your long-lived page access token
BASE_URL = f'https://graph.facebook.com/v12.0/{106180925472561}/posts'
 
LAST_TIMESTAMP = None
 
def get_facebook_posts():
    params = {
        'access_token': ACCESS_TOKEN,
        'fields': 'message,created_time,id,attachments',
        'limit': 100
    }
 
    response = requests.get(BASE_URL, params=params)
    if response.status_code == 200:
        data = response.json()
        return data.get('data', [])
    else:
        print(f"Error {response.status_code}: {response.text}")
        return []
 
 
index = None  # Declare index here to ensure it's in the global scope
 
def job():
    global LAST_TIMESTAMP, index  # Ensure you're using the global variables
    if index is None:
        index = set()  # Initialize the set if it's the first run
 
    documents = []  # This will store new Document objects
    posts = get_facebook_posts()
 
    new_last_timestamp = LAST_TIMESTAMP
 
    for post in posts:
        post_id = post["id"]
        # Skip the post if it's already been processed
        if post_id in index:
            continue
 
        created_time_str = post.get("created_time", "")
        created_time = datetime.strptime(created_time_str, '%Y-%m-%dT%H:%M:%S+0000')
 
        if LAST_TIMESTAMP is None or created_time > LAST_TIMESTAMP:
            post_message = post.get("message", "").strip()
            created_time_iso = created_time.isoformat()
            document = {'text': post_message, 'doc_id': post_id, 'extra_info': {'date': created_time_iso}}
            documents.append(document)
            index.add(post_id)  # Add the ID to the set of processed documents
 
            if new_last_timestamp is None or created_time > new_last_timestamp:
                new_last_timestamp = created_time
 
    # Update LAST_TIMESTAMP with the timestamp of the latest post processed
    if new_last_timestamp is not None:
        LAST_TIMESTAMP = new_last_timestamp
 
    # Print the JSON directly if there are new documents
    if documents:
        print(json.dumps(documents))  # Print the JSON serialized list of documents
 
# Set up the scheduler to run the job every minute
schedule.every(1).minutes.do(job)
 
# Run the scheduler in a loop
if __name__ == '__main__':
    while True:
        schedule.run_pending()
        time.sleep(1)