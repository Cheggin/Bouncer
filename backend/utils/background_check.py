import requests
import argparse
import dotenv 
import os
import google.generativeai as genai
import time
import urllib.request
import base64
import tempfile


# Load environment variables from .env file
dotenv.load_dotenv()
CUSTOM_SEARCH_API = os.getenv("CUSTOM-SEARCH-API")
SEARCH_ENGINE_ID = os.getenv("SEARCH-ENGINE-ID")
GEMINI_API = os.getenv("GEMINI-API")

# Facecheck.id configuration
FACECHECK_TESTING_MODE = True
FACECHECK_APITOKEN = 'xgLcs2i47YQtIWEXxhrgacF2wmVk0PwT1WBf/YOXlCoyWA6RqFIw4iWNa+vPOD4KEwN0hyn2do4='

genai.configure(api_key=GEMINI_API)

def rs(text, num_results=10):
    """
    Perform a Google Custom Search for pages containing the given email address.
    """
    url = "https://www.googleapis.com/customsearch/v1"
    params = {
        "key": CUSTOM_SEARCH_API,
        "cx": SEARCH_ENGINE_ID,
        "q": f"intext:{text}",
        "num": num_results
    }
    
    response = requests.get(url, params=params)
    response.raise_for_status()
    data = response.json()
    
    results = []
    for item in data.get("items", []):
        results.append({
            "title": item.get("title"),
            "link": item.get("link"),
            "snippet": item.get("snippet")
        })
    return results

import requests
from bs4 import BeautifulSoup

def deep_search(results_json):
    """
    For each result, fetch the page HTML, extract the main text,
    and then ask Gemini to summarize that text.
    """
    model = genai.GenerativeModel('models/gemini-2.0-flash')  # a good general-purpose model
    summaries = []

    for item in results_json:
        # 1. Download the page
        resp = requests.get(item['link'], timeout=10)
        resp.raise_for_status()

        # 2. Extract visible text
        soup = BeautifulSoup(resp.text, 'html.parser')
        text = soup.get_text(separator='\n', strip=True)
        excerpt = '\n'.join(text.splitlines()[:500])  # first ~500 lines to stay under context limit

        # 3. Build a targeted prompt
        prompt = (
            "Here is some page content:\n\n"
            f"{excerpt}\n\n"
            "Please write a concise, one-paragraph summary of the above."
        )

        # 4. Generate the summary
        response = model.generate_content(prompt)
        summary = response.text.strip()

        summaries.append({
            "title":   item['title'],
            "link":    item['link'],
            "summary": summary or "No summary generated"
        })

    return summaries

def search_by_face(image_file_path):
    """
    Perform reverse image search using facecheck.id
    """
    if FACECHECK_TESTING_MODE:
        print('****** TESTING MODE search, results are inaccurate, and queue wait is long, but credits are NOT deducted ******')

    site = 'https://facecheck.id'
    headers = {'accept': 'application/json', 'Authorization': FACECHECK_APITOKEN}
    
    with open(image_file_path, 'rb') as f:
        files = {'images': f, 'id_search': None}
        response = requests.post(site + '/api/upload_pic', headers=headers, files=files).json()

    if response['error']:
        raise Exception(f"{response['error']} ({response['code']})")

    id_search = response['id_search']
    print(response['message'] + ' id_search=' + id_search)
    json_data = {'id_search': id_search, 'with_progress': True, 'status_only': False, 'demo': FACECHECK_TESTING_MODE}

    while True:
        response = requests.post(site + '/api/search', headers=headers, json=json_data).json()
        if response['error']:
            raise Exception(f"{response['error']} ({response['code']})")
        if response['output']:
            return response['output']['items']
        print(f'{response["message"]} progress: {response["progress"]}%')
        time.sleep(1)

def face_search(image_data, num_results=3):
    """
    Wrapper function for face search that handles image data and formats results
    consistently with the existing API format.
    Returns the top 3 most similar faces sorted by similarity score.
    """
    # Create a temporary file to store the uploaded image
    with tempfile.NamedTemporaryFile(delete=False, suffix='.jpg') as temp_file:
        temp_file.write(image_data)
        temp_file_path = temp_file.name

    try:
        # Perform the face search
        raw_results = search_by_face(temp_file_path)
        
        # Sort results by similarity score in descending order (highest scores first)
        sorted_results = sorted(raw_results, key=lambda x: x['score'], reverse=True)
        
        # Format results to match existing API structure, taking top 3 most similar
        results = []
        for i, item in enumerate(sorted_results[:3]):  # Always take top 3 most similar
            results.append({
                "title": f"Face Match (Score: {item['score']}%)",
                "link": item['url'],
                "snippet": f"Face similarity score: {item['score']}% - Found on webpage"
            })
        
        return results
        
    finally:
        # Clean up temporary file
        import os
        if os.path.exists(temp_file_path):
            os.unlink(temp_file_path)

def main():
    # testing
    parser = argparse.ArgumentParser(description="Search Google Custom Search for any text.")
    parser.add_argument("text", help="Text to search for.")
    parser.add_argument("--results", type=int, default=10, help="Number of search results to retrieve.")
    args = parser.parse_args()

    rs_json = rs(args.text, num_results=args.results)
    # Uncomment to perform deep search
    summaries = deep_search(rs_json)
    for item in summaries:
        print(f"Title: {item['title']}\nLink: {item['link']}\nSummary: {item['summary']}\n")
    
if __name__ == "__main__":
    main()


