import requests
import argparse
import dotenv 
import os

# Load environment variables from .env file
dotenv.load_dotenv()
CUSTOM_SEARCH_API = os.getenv("CUSTOM-SEARCH-API")
SEARCH_ENGINE_ID = os.getenv("SEARCH-ENGINE-ID")

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

def main():
    # testing
    parser = argparse.ArgumentParser(description="Search Google Custom Search for any text.")
    parser.add_argument("text", help="Text to search for.")
    parser.add_argument("--results", type=int, default=10, help="Number of search results to retrieve.")
    args = parser.parse_args()

    found = rs(args.email, num_results=args.results)
    for idx, entry in enumerate(found, 1):
        print(f"Result {idx}:")
        print(f" -> Title: {entry['title']}")
        print(f" -> Link: {entry['link']}")
        print(f" -> Snippet: {entry['snippet']}\n")

if __name__ == "__main__":
    main()
