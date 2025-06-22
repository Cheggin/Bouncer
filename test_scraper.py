#!/usr/bin/env python3
"""
Test version of Maryland Judiciary Case Search Web Scraper
This version runs automatically without user input for testing
"""

# Import everything from the main scraper
from scrape_maryland import MarylandCourtScraper
import sys

def test_scraper():
    """Test the scraper with predefined values"""
    print("🏛️  Testing Maryland Judiciary Case Search Bot")
    print("="*50)
    
    # Try Selenium method (more likely to work)
    print("Testing with Selenium method...")
    try:
        scraper = MarylandCourtScraper(use_selenium=True, headless=True)
        
        print("Searching for: John S")
        results = scraper.search_by_name(
            first_name="John",
            last_name="S",
            middle_name=""
        )
        
        if results:
            print(f"\n✅ SUCCESS: Found {len(results)} results with Selenium method")
            print("First result:")
            case = results[0]
            for key, value in case.items():
                print(f"  {key}: {value}")
            return True
        else:
            print("❌ No results found with Selenium method")
            return False
            
    except Exception as e:
        print(f"❌ Selenium method failed: {e}")
        
        # Try requests method as fallback
        print("\nTrying requests method as fallback...")
        try:
            scraper = MarylandCourtScraper(use_selenium=False, headless=True)
            
            # Test search with common name
            print("Searching for: John S")
            results = scraper.search_by_name(
                first_name="John",
                last_name="S",
                middle_name=""
            )
            
            if results:
                print(f"\n✅ SUCCESS: Found {len(results)} results with requests method")
                print("First result:")
                case = results[0]
                for key, value in case.items():
                    print(f"  {key}: {value}")
                return True
            else:
                print("❌ No results found with requests method")
                return False
                
        except Exception as e2:
            print(f"❌ Requests method also failed: {e2}")
            return False

if __name__ == "__main__":
    success = test_scraper()
    if success:
        print("\n🎉 Test completed successfully!")
        sys.exit(0)
    else:
        print("\n💥 Test failed - website may have bot protection active")
        sys.exit(1) 