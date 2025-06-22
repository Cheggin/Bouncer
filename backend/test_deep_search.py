#!/usr/bin/env python3
"""
Test script for the deep search API endpoint.
Usage: 
  python test_deep_search.py --text "search query"
  python test_deep_search.py --image path/to/image.jpg
  python test_deep_search.py --text "search query" --image path/to/image.jpg
"""

import requests
import sys
import json
import os
import argparse

def test_deep_search_api(text_query=None, image_path=None, num_text_results=10, api_url="http://localhost:5001"):
    """
    Test the deep search API with text and/or image inputs.
    
    Args:
        text_query (str): Text query to search for
        image_path (str): Path to image file for face search
        num_text_results (int): Number of text search results
        api_url (str): Base URL of the API
    """
    
    if not text_query and not image_path:
        print("Error: Must provide either text query or image path (or both)")
        return
    
    endpoint = f"{api_url}/deep-search"
    
    # Prepare form data
    data = {'num_text_results': num_text_results}
    if text_query:
        data['text'] = text_query
    
    # Prepare files
    files = {}
    if image_path:
        if not os.path.exists(image_path):
            print(f"Error: Image file '{image_path}' not found.")
            return
        
        # Check if file is a valid image format
        valid_extensions = {'.png', '.jpg', '.jpeg', '.gif', '.bmp', '.webp'}
        file_ext = os.path.splitext(image_path)[1].lower()
        if file_ext not in valid_extensions:
            print(f"Warning: '{file_ext}' might not be a supported image format.")
            print(f"Supported formats: {', '.join(valid_extensions)}")
        
        files['image'] = open(image_path, 'rb')
    
    try:
        print("="*60)
        print("DEEP SEARCH API TESTER")
        print("="*60)
        print(f"Text query: {text_query or 'None'}")
        print(f"Image path: {image_path or 'None'}")
        print(f"Number of text results: {num_text_results}")
        print(f"API endpoint: {endpoint}")
        print("-" * 50)
        
        # Make the API request
        response = requests.post(endpoint, data=data, files=files)
        
        # Print response status
        print(f"Status Code: {response.status_code}")
        print(f"Response Headers: {dict(response.headers)}")
        print("-" * 50)
        
        # Print the JSON response
        if response.status_code == 200:
            json_response = response.json()
            print("SUCCESS! API Response:")
            print(json.dumps(json_response, indent=2))
            
            # Additional formatted output
            if 'summaries' in json_response:
                print("\n" + "="*60)
                print("DEEP SEARCH RESULTS:")
                print("="*60)
                print(f"Total results: {json_response.get('total_results', 0)}")
                print(f"Face search results: {json_response.get('face_search_count', 0)}")
                print(f"Text search results: {json_response.get('text_search_count', 0)}")
                print("-" * 60)
                
                for i, result in enumerate(json_response['summaries'], 1):
                    print(f"\nResult {i} ({result['source']}):")
                    print(f"  Title: {result['title']}")
                    print(f"  Link: {result['link']}")
                    if result.get('snippet'):
                        print(f"  Snippet: {result['snippet']}")
                    print(f"  Summary: {result['summary']}")
                    print("-" * 40)
            else:
                print("No summaries found in response.")
                
        else:
            print("ERROR! API Response:")
            try:
                error_response = response.json()
                print(json.dumps(error_response, indent=2))
            except:
                print(response.text)
                
    except requests.exceptions.ConnectionError:
        print(f"Error: Could not connect to {api_url}")
        print("Make sure your Flask server is running!")
    except requests.exceptions.RequestException as e:
        print(f"Request error: {e}")
    except Exception as e:
        print(f"Unexpected error: {e}")
    finally:
        # Close any open files
        for file in files.values():
            if hasattr(file, 'close'):
                file.close()

def main():
    parser = argparse.ArgumentParser(description="Test the deep search API endpoint")
    parser.add_argument('--text', type=str, help='Text query to search for')
    parser.add_argument('--image', type=str, help='Path to image file for face search')
    parser.add_argument('--num-results', type=int, default=10, help='Number of text search results (default: 10)')
    parser.add_argument('--api-url', type=str, default='http://localhost:5001', help='API base URL (default: http://localhost:5001)')
    
    args = parser.parse_args()
    
    if not args.text and not args.image:
        parser.print_help()
        print("\nError: Must provide either --text or --image (or both)")
        sys.exit(1)
    
    test_deep_search_api(
        text_query=args.text,
        image_path=args.image,
        num_text_results=args.num_results,
        api_url=args.api_url
    )

if __name__ == "__main__":
    main() 