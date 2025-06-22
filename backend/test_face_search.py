#!/usr/bin/env python3
"""
Test script for the face search API endpoint.
Usage: python test_face_search.py <image_path>
"""

import requests
import sys
import json
import os

def test_face_search_api(image_path, api_url="http://localhost:5001"):
    """
    Test the face search API by uploading an image and printing results.
    Returns the top 3 most similar faces sorted by similarity score.
    
    Args:
        image_path (str): Path to the image file to upload
        api_url (str): Base URL of the API
    """
    
    # Check if image file exists
    if not os.path.exists(image_path):
        print(f"Error: Image file '{image_path}' not found.")
        return
    
    # Check if file is a valid image format
    valid_extensions = {'.png', '.jpg', '.jpeg', '.gif', '.bmp', '.webp'}
    file_ext = os.path.splitext(image_path)[1].lower()
    if file_ext not in valid_extensions:
        print(f"Warning: '{file_ext}' might not be a supported image format.")
        print(f"Supported formats: {', '.join(valid_extensions)}")
    
    endpoint = f"{api_url}/face-search"
    
    try:
        # Prepare the files for the request
        with open(image_path, 'rb') as image_file:
            files = {'image': image_file}
            
            print(f"Uploading image: {image_path}")
            print(f"Searching for top 3 most similar faces...")
            print(f"API endpoint: {endpoint}")
            print("-" * 50)
            
            # Make the API request
            response = requests.post(endpoint, files=files)
            
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
                if 'results' in json_response:
                    print("\n" + "="*60)
                    print("TOP 3 MOST SIMILAR FACES (sorted by similarity):")
                    print("="*60)
                    for i, result in enumerate(json_response['results'], 1):
                        print(f"\nResult {i}:")
                        print(f"  Title: {result['title']}")
                        print(f"  Link: {result['link']}")
                        print(f"  Snippet: {result['snippet']}")
                    
                    print(f"\nTotal results found: {len(json_response['results'])}")
                else:
                    print("No results found in response.")
                    
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
    except FileNotFoundError:
        print(f"Error: Could not open image file '{image_path}'")
    except Exception as e:
        print(f"Unexpected error: {e}")

def main():
    if len(sys.argv) < 2:
        print("Usage: python test_face_search.py <image_path>")
        print("Example: python test_face_search.py daniel.jpg")
        print("Note: Returns top 3 most similar faces sorted by similarity score")
        sys.exit(1)
    
    image_path = sys.argv[1]
    
    print("="*60)
    print("FACE SEARCH API TESTER")
    print("="*60)
    
    test_face_search_api(image_path)

if __name__ == "__main__":
    main() 