#!/usr/bin/env python3
"""
Test script for the Claude trustworthiness analysis API endpoint.
Usage: 
  python test_claude_analysis.py --text "search query"
  python test_claude_analysis.py --image path/to/image.jpg
  python test_claude_analysis.py --text "search query" --image path/to/image.jpg
"""

import requests
import sys
import json
import os
import argparse

def test_claude_trustworthiness_analysis(text_query=None, image_path=None, num_text_results=10, api_url="http://localhost:5001"):
    """
    Test the Claude trustworthiness analysis by first performing deep search,
    then analyzing the results for trustworthiness scoring.
    
    Args:
        text_query (str): Text query to search for
        image_path (str): Path to image file for face search
        num_text_results (int): Number of text search results
        api_url (str): Base URL of the API
    """
    
    if not text_query and not image_path:
        print("Error: Must provide either text query or image path (or both)")
        return
    
    print("="*60)
    print("CLAUDE TRUSTWORTHINESS ANALYSIS TESTER")
    print("="*60)
    print(f"Text query: {text_query or 'None'}")
    print(f"Image path: {image_path or 'None'}")
    print(f"Number of text results: {num_text_results}")
    print("-" * 60)
    
    # Step 1: Perform deep search
    print("Step 1: Performing deep search...")
    deep_search_endpoint = f"{api_url}/deep-search"
    
    # Prepare form data for deep search
    data = {'num_text_results': num_text_results}
    if text_query:
        data['text'] = text_query
    
    # Prepare files for deep search
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
        # Make deep search request
        deep_search_response = requests.post(deep_search_endpoint, data=data, files=files)
        
        if deep_search_response.status_code != 200:
            print(f"Deep search failed with status {deep_search_response.status_code}")
            try:
                error_data = deep_search_response.json()
                print(json.dumps(error_data, indent=2))
            except:
                print(deep_search_response.text)
            return
        
        summaries_data = deep_search_response.json()
        print(f"Deep search completed! Found {summaries_data.get('total_results', 0)} results")
        print("-" * 60)
        
        # Step 2: Test various trustworthiness analysis prompts
        print("Step 2: Analyzing trustworthiness with Claude...")
        analysis_endpoint = f"{api_url}/analyze-summaries"
        
        # Trustworthiness test prompts - focusing on different risk factors
        test_prompts = [
            {
                "prompt": "Criminal background checks and legal issues are high risk. Professional employment and education are low risk.",
                "description": "Criminal/Legal Risk Assessment"
            },
            {
                "prompt": "Multiple social media accounts with suspicious activity are high risk. Verified professional profiles are low risk.",
                "description": "Social Media Risk Assessment"
            },
            {
                "prompt": "Dark web presence and data breaches are high risk. Clean background with no security issues is low risk.",
                "description": "Security Risk Assessment"
            },
            {
                "prompt": "Financial fraud and bankruptcy are high risk. Stable employment and good credit are low risk.",
                "description": "Financial Risk Assessment"
            },
            {
                "prompt": "Fake identities and inconsistent information are high risk. Consistent verified information is low risk.",
                "description": "Identity Verification Risk"
            }
        ]
        
        for i, test_case in enumerate(test_prompts, 1):
            print(f"\n--- Test {i}: {test_case['description']} ---")
            print(f"Risk Guidelines: {test_case['prompt']}")
            print("-" * 40)
            
            # Prepare the request payload
            payload = {
                "prompt": test_case['prompt'],
                "summaries_data": summaries_data
            }
            
            try:
                # Make the Claude analysis request
                response = requests.post(
                    analysis_endpoint,
                    json=payload,
                    headers={'Content-Type': 'application/json'}
                )
                
                print(f"Status Code: {response.status_code}")
                
                if response.status_code == 200:
                    trustworthiness_score = response.text.strip()
                    print(f"SUCCESS! Trustworthiness Score: {trustworthiness_score}")
                    
                    # Validate the output format
                    try:
                        score_float = float(trustworthiness_score)
                        if 0.0 <= score_float <= 1.0:
                            print(f"✅ Valid score format (0-1 range)")
                            if score_float >= 0.8:
                                print("📈 HIGH TRUSTWORTHINESS")
                            elif score_float >= 0.5:
                                print("📊 MODERATE TRUSTWORTHINESS")
                            else:
                                print("📉 LOW TRUSTWORTHINESS")
                        else:
                            print(f"⚠️  Score out of range (should be 0-1)")
                    except ValueError:
                        print(f"❌ Invalid score format (should be floating point number)")
                        
                else:
                    print("ERROR! Response:")
                    try:
                        error_data = response.json()
                        print(json.dumps(error_data, indent=2))
                    except:
                        print(response.text)
                        
            except requests.exceptions.RequestException as e:
                print(f"Request error: {e}")
            except Exception as e:
                print(f"Unexpected error: {e}")
            
            print("=" * 60)
                
    except requests.exceptions.ConnectionError:
        print(f"Error: Could not connect to {api_url}")
        print("Make sure your Flask server is running!")
    except Exception as e:
        print(f"Unexpected error: {e}")
    finally:
        # Close any open files
        for file in files.values():
            if hasattr(file, 'close'):
                file.close()

def show_usage_example():
    """
    Show example of how to use the trustworthiness analysis programmatically.
    """
    print("\n" + "="*60)
    print("PROGRAMMATIC USAGE EXAMPLE")
    print("="*60)
    
    usage_example = '''
# Example: Comprehensive trustworthiness analysis

import requests

# Step 1: Perform deep search
deep_search_response = requests.post('http://localhost:5001/deep-search', 
                                   data={'text': 'john.doe@email.com'},
                                   files={'image': open('person.jpg', 'rb')})
summaries_data = deep_search_response.json()

# Step 2: Analyze for different risk factors
risk_assessments = {
    "criminal": "Criminal records and legal issues are high risk. Clean background is low risk.",
    "financial": "Debt and financial fraud are high risk. Stable income is low risk.", 
    "social": "Suspicious social media activity is high risk. Professional profiles are low risk.",
    "identity": "Fake profiles and inconsistent info are high risk. Verified identity is low risk."
}

scores = {}
for risk_type, risk_prompt in risk_assessments.items():
    payload = {
        "prompt": risk_prompt,
        "summaries_data": summaries_data
    }
    
    response = requests.post('http://localhost:5001/analyze-summaries', json=payload)
    scores[risk_type] = float(response.text.strip())

# Calculate overall trustworthiness (weighted average)
overall_score = (scores["criminal"] * 0.4 + 
                scores["financial"] * 0.3 + 
                scores["social"] * 0.2 + 
                scores["identity"] * 0.1)

print(f"Overall Trustworthiness: {overall_score:.2f}")
print(f"Risk Breakdown: {scores}")
'''
    
    print("Code example:")
    print(usage_example)

def main():
    parser = argparse.ArgumentParser(description="Test Claude trustworthiness analysis with deep search")
    parser.add_argument('--text', type=str, help='Text query to search for')
    parser.add_argument('--image', type=str, help='Path to image file for face search')
    parser.add_argument('--num-results', type=int, default=10, help='Number of text search results (default: 10)')
    parser.add_argument('--api-url', type=str, default='http://localhost:5001', help='API base URL (default: http://localhost:5001)')
    
    args = parser.parse_args()
    
    if not args.text and not args.image:
        parser.print_help()
        print("\nError: Must provide either --text or --image (or both)")
        print("\nExample usage:")
        print("  python test_claude_analysis.py --text 'john.doe@email.com'")
        print("  python test_claude_analysis.py --image person.jpg")
        print("  python test_claude_analysis.py --text 'john.doe@email.com' --image person.jpg")
        sys.exit(1)
    
    test_claude_trustworthiness_analysis(
        text_query=args.text,
        image_path=args.image,
        num_text_results=args.num_results,
        api_url=args.api_url
    )
    
    show_usage_example()

if __name__ == "__main__":
    main() 