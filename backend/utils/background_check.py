import requests
import argparse
import dotenv 
import os
import google.generativeai as genai


# Load environment variables from .env file
dotenv.load_dotenv()
CUSTOM_SEARCH_API = os.getenv("CUSTOM-SEARCH-API")
SEARCH_ENGINE_ID = os.getenv("SEARCH-ENGINE-ID")
GEMINI_API = os.getenv("GEMINI-API")

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


