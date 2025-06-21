#!/usr/bin/env python3
"""
Maryland Judiciary Case Search Web Scraper
A human-like web scraper that searches for court cases by first and last name.
"""

import requests
from bs4 import BeautifulSoup
import time
import random
import re
from urllib.parse import urljoin
from typing import Dict, List, Optional, Tuple
import json
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.common.action_chains import ActionChains
from selenium.common.exceptions import TimeoutException, NoSuchElementException
from webdriver_manager.chrome import ChromeDriverManager
from selenium.webdriver.chrome.service import Service
import base64

class MarylandCourtScraper:
    def __init__(self, use_selenium=True, headless=False):
        self.use_selenium = use_selenium
        self.base_url = "https://casesearch.courts.state.md.us"
        self.search_url = "https://casesearch.courts.state.md.us/casesearch/inquirySearch.jis"
        
        if use_selenium:
            self.driver = None
            self.headless = headless
            self._setup_selenium()
        else:
            # Fallback to requests with enhanced headers
            self.session = requests.Session()
            self._setup_requests_session()
        
        self.search_form_data = {}
    
    def _setup_selenium(self):
        """Setup Selenium webdriver with stealth options"""
        try:
            # Try Safari first (available on macOS)
            print("Setting up Safari driver...")
            self.driver = webdriver.Safari()
            
            # Set realistic viewport
            self.driver.set_window_size(1366, 768)
            
        except Exception as safari_error:
            print(f"Safari setup failed: {safari_error}")
            
            # Fallback to Chrome if Safari fails
            try:
                print("Trying Chrome as fallback...")
                chrome_options = Options()
                
                if self.headless:
                    chrome_options.add_argument("--headless")
                
                # Stealth options to avoid detection
                chrome_options.add_argument("--no-sandbox")
                chrome_options.add_argument("--disable-dev-shm-usage")
                chrome_options.add_argument("--disable-blink-features=AutomationControlled")
                chrome_options.add_experimental_option("excludeSwitches", ["enable-automation"])
                chrome_options.add_experimental_option('useAutomationExtension', False)
                chrome_options.add_argument("--user-agent=Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0.0.0 Safari/537.36")
                
                # Additional stealth measures
                chrome_options.add_argument("--disable-extensions")
                chrome_options.add_argument("--disable-plugins")
                chrome_options.add_argument("--disable-images")
                # chrome_options.add_argument("--disable-javascript")  # We need JS for the site
                
                # Auto-download and setup ChromeDriver
                service = Service(ChromeDriverManager().install())
                self.driver = webdriver.Chrome(service=service, options=chrome_options)
                
                # Execute script to hide webdriver property
                self.driver.execute_script("Object.defineProperty(navigator, 'webdriver', {get: () => undefined})")
                
                # Set realistic viewport
                self.driver.set_window_size(1366, 768)
                
            except Exception as chrome_error:
                print(f"Chrome setup also failed: {chrome_error}")
                print("Please install Chrome browser or enable Safari WebDriver")
                print("For Safari: Run 'sudo safaridriver --enable' in terminal")
                raise Exception("No suitable browser found for Selenium")
    
    def _setup_requests_session(self):
        """Setup requests session with enhanced headers"""
        # Rotate user agents
        user_agents = [
            'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0.0.0 Safari/537.36',
            'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0.0.0 Safari/537.36',
            'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0.0.0 Safari/537.36'
        ]
        
        self.session.headers.update({
            'User-Agent': random.choice(user_agents),
            'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7',
            'Accept-Language': 'en-US,en;q=0.9',
            'Accept-Encoding': 'gzip, deflate, br',
            'DNT': '1',
            'Connection': 'keep-alive',
            'Upgrade-Insecure-Requests': '1',
            'Sec-Fetch-Dest': 'document',
            'Sec-Fetch-Mode': 'navigate',
            'Sec-Fetch-Site': 'same-origin',
            'Sec-Fetch-User': '?1',
            'Cache-Control': 'max-age=0',
            'sec-ch-ua': '"Google Chrome";v="119", "Chromium";v="119", "Not?A_Brand";v="24"',
            'sec-ch-ua-mobile': '?0',
            'sec-ch-ua-platform': '"macOS"'
        })
    
    def __del__(self):
        """Cleanup selenium driver"""
        if hasattr(self, 'driver') and self.driver:
            self.driver.quit()
        
    def human_delay(self, min_seconds: float = 0.5, max_seconds: float = 2.0):
        """Add random delay to mimic human behavior"""
        delay = random.uniform(min_seconds, max_seconds)
        time.sleep(delay)
    
    def detect_captcha(self, page_source: str = None) -> bool:
        """Detect if there's a captcha on the page"""
        if self.use_selenium:
            page_source = self.driver.page_source if not page_source else page_source
        
        captcha_indicators = [
            'captcha', 'recaptcha', 'hcaptcha', 'cloudflare',
            'challenge', 'verification', 'robot', 'human',
            'data-sitekey', 'cf-challenge', 'turnstile'
        ]
        
        page_lower = page_source.lower()
        return any(indicator in page_lower for indicator in captcha_indicators)
    
    def handle_captcha_manual(self) -> bool:
        """Handle captcha manually - wait for user to solve it"""
        if not self.use_selenium:
            print("Manual captcha handling requires Selenium mode")
            return False
        
        print("\n" + "="*50)
        print("🤖 CAPTCHA DETECTED!")
        print("="*50)
        print("Please solve the captcha manually in the browser window.")
        print("The browser will wait for you to complete it.")
        print("Press ENTER here after you've solved the captcha...")
        
        input("Waiting for captcha completion...")
        
        # Wait a bit more for page to process
        self.human_delay(2.0, 4.0)
        
        # Check if captcha is still present
        if self.detect_captcha():
            print("Captcha still detected. Please try again or check if it was solved correctly.")
            return False
        
        print("✅ Captcha appears to be solved! Continuing...")
        return True
    
    def solve_captcha_2captcha(self, site_key: str) -> Optional[str]:
        """Solve captcha using 2captcha service (requires API key)"""
        # This is a placeholder - you would need to implement actual 2captcha integration
        print("2captcha integration not implemented. Use manual captcha solving for now.")
        return None
    
    def handle_cloudflare_challenge(self) -> bool:
        """Handle Cloudflare challenge if detected"""
        if not self.use_selenium:
            return False
        
        try:
            # Wait for Cloudflare challenge to complete automatically
            print("Detected Cloudflare challenge, waiting for it to complete...")
            WebDriverWait(self.driver, 30).until(
                lambda driver: "cloudflare" not in driver.page_source.lower() or 
                              "challenge" not in driver.page_source.lower()
            )
            print("Cloudflare challenge completed!")
            return True
        except TimeoutException:
            print("Cloudflare challenge timed out. Manual intervention may be required.")
            return False
        
    def get_initial_page(self) -> bool:
        """Load the initial search page and extract form data"""
        try:
            print("Loading Maryland Judiciary Case Search page...")
            
            if self.use_selenium:
                self.driver.get("https://casesearch.courts.state.md.us/casesearch/inquirySearch.jis")
                
                # Handle potential Cloudflare challenge
                if self.detect_captcha():
                    print("Captcha/Challenge detected on initial page load...")
                    if "cloudflare" in self.driver.page_source.lower():
                        if not self.handle_cloudflare_challenge():
                            return False
                    else:
                        if not self.handle_captcha_manual():
                            return False
                
                # Wait for page to load completely
                WebDriverWait(self.driver, 10).until(
                    EC.presence_of_element_located((By.NAME, "inquiryForm"))
                )
                
                # Extract form data from page source
                soup = BeautifulSoup(self.driver.page_source, 'html.parser')
                
            else:
                # Fallback to requests
                response = self.session.get("https://casesearch.courts.state.md.us/casesearch/inquirySearch.jis")
                response.raise_for_status()
                soup = BeautifulSoup(response.content, 'html.parser')
            
            # Extract hidden form fields and other necessary data
            inquiry_form = soup.find('form', {'name': 'inquiryForm'})
            if not inquiry_form:
                print("Error: Could not find inquiry form")
                return False
                
            # Extract all hidden fields
            hidden_fields = inquiry_form.find_all('input', {'type': 'hidden'})
            for field in hidden_fields:
                name = field.get('name')
                value = field.get('value', '')
                if name:
                    self.search_form_data[name] = value
                    
            print(f"Extracted {len(hidden_fields)} hidden form fields")
            
            # Add default form values
            self.search_form_data.update({
                'company': 'N',  # Person search
                'searchBasicAdvanced': 'basic',
                'submitButtonType': 'submit',
                'accordion1Index': '1',
                'accordion2Index': '0'
            })
            
            self.human_delay(1.0, 3.0)  # Simulate reading the page
            return True
            
        except Exception as e:
            print(f"Error loading initial page: {e}")
            return False
    
    def simulate_typing(self, element_or_text, text: str = None) -> None:
        """Simulate human typing with random pauses"""
        if self.use_selenium and text is None:
            # element_or_text is actually the element, text is the second parameter
            text = element_or_text
            
        if self.use_selenium and hasattr(element_or_text, 'clear'):
            # Selenium element typing
            element = element_or_text
            element.clear()
            for char in text:
                element.send_keys(char)
                time.sleep(random.uniform(0.05, 0.2))
                
                # Occasional longer pause (like thinking)
                if random.random() < 0.1:
                    time.sleep(random.uniform(0.3, 0.8))
        else:
            # Regular delay for non-selenium
            text = text or element_or_text
            for char in text:
                time.sleep(random.uniform(0.05, 0.2))
            
            # Occasional longer pause (like thinking)  
            if random.random() < 0.1:
                time.sleep(random.uniform(0.5, 1.5))
    
    def search_by_name(self, first_name: str, last_name: str, 
                      middle_name: str = "", 
                      county: str = "",
                      case_type: str = "00") -> Optional[List[Dict]]:
        """
        Search for cases by person's name
        
        Args:
            first_name: First name to search
            last_name: Last name to search  
            middle_name: Optional middle name
            county: Optional county filter
            case_type: Case type filter (00=All, CIVIL, CRIMINAL, TRAFFIC, CP)
        """
        
        if not self.get_initial_page():
            return None
            
        print(f"Searching for: {first_name} {middle_name} {last_name}".strip())
        
        # Simulate user thinking and typing
        print("Filling out search form...")
        self.human_delay(0.5, 1.5)
        
        # Prepare form data
        form_data = self.search_form_data.copy()
        
        if self.use_selenium:
            return self._search_with_selenium(first_name, last_name, middle_name, county, case_type)
        else:
            return self._search_with_requests(form_data, first_name, last_name, middle_name, county, case_type)
    
    def _search_with_selenium(self, first_name: str, last_name: str, middle_name: str = "", county: str = "", case_type: str = "00"):
        """Search using Selenium for better bot evasion"""
        try:
            # Find and fill form fields
            if first_name:
                print(f"Typing first name: {first_name}")
                first_name_field = WebDriverWait(self.driver, 10).until(
                    EC.element_to_be_clickable((By.NAME, "firstName"))
                )
                self.simulate_typing(first_name_field, first_name)
                
            if middle_name:
                print(f"Typing middle name: {middle_name}")
                middle_name_field = self.driver.find_element(By.NAME, "middleName")
                self.simulate_typing(middle_name_field, middle_name)
                
            if last_name:
                print(f"Typing last name: {last_name}")
                last_name_field = self.driver.find_element(By.NAME, "lastName")
                self.simulate_typing(last_name_field, last_name)
            else:
                print("Error: Last name is required")
                return None
            
            # Handle optional filters if needed
            if county:
                county_select = self.driver.find_element(By.NAME, "countyName")
                county_select.send_keys(county)
            
            # Simulate human behavior before submitting
            print("Submitting search...")
            self.human_delay(1.0, 2.0)
            
            # Find and click submit button
            submit_button = self.driver.find_element(By.CSS_SELECTOR, "input[type='submit'][value='Search']")
            
            # Scroll to submit button to ensure it's visible 
            self.driver.execute_script("arguments[0].scrollIntoView();", submit_button)
            self.human_delay(0.5, 1.0)
            
            # Click submit button
            submit_button.click()
            
            # Wait for results page to load
            WebDriverWait(self.driver, 15).until(
                lambda driver: "Search Results" in driver.page_source or 
                              "No records found" in driver.page_source or
                              self.detect_captcha(driver.page_source)
            )
            
            # Handle captcha if it appears after submission
            if self.detect_captcha():
                print("Captcha detected after form submission...")
                if not self.handle_captcha_manual():
                    return None
                    
                # Wait for results after captcha
                WebDriverWait(self.driver, 15).until(
                    lambda driver: "Search Results" in driver.page_source or 
                                  "No records found" in driver.page_source
                )
            
            # Parse results from current page
            return self.parse_search_results(self.driver.page_source.encode('utf-8'))
            
        except Exception as e:
            print(f"Error during Selenium search: {e}")
            return None
    
    def _search_with_requests(self, form_data: dict, first_name: str, last_name: str, middle_name: str = "", county: str = "", case_type: str = "00"):
        """Fallback search using requests"""
        # Simulate typing each field
        if first_name:
            print(f"Typing first name: {first_name}")
            self.simulate_typing(first_name)
            form_data['firstName'] = first_name
            
        if middle_name:
            print(f"Typing middle name: {middle_name}")
            self.simulate_typing(middle_name)
            form_data['middleName'] = middle_name
            
        if last_name:
            print(f"Typing last name: {last_name}")
            self.simulate_typing(last_name)
            form_data['lastName'] = last_name
        else:
            print("Error: Last name is required")
            return None
        
        # Optional filters
        if county:
            form_data['countyName'] = county
            
        form_data['site'] = case_type
        
        # Simulate clicking submit button
        print("Submitting search...")
        self.human_delay(0.5, 1.0)
        
        try:
            # Submit the search
            response = self.session.post(
                self.search_url,
                data=form_data,
                headers={
                    'Referer': 'https://casesearch.courts.state.md.us/casesearch/inquirySearch.jis',
                    'Content-Type': 'application/x-www-form-urlencoded',
                    'Origin': 'https://casesearch.courts.state.md.us'
                }
            )
            response.raise_for_status()
            
            # Parse results
            return self.parse_search_results(response.content)
            
        except Exception as e:
            print(f"Error during search: {e}")
            return None
    
    def parse_search_results(self, html_content: bytes) -> List[Dict]:
        """Parse the search results page"""
        soup = BeautifulSoup(html_content, 'html.parser')
        results = []
        
        # Look for results table or error messages
        error_div = soup.find('div', class_='bd-callout-danger')
        if error_div:
            print(f"Search error: {error_div.get_text().strip()}")
            return results
            
        # Look for "No records found" message
        if "No records found" in soup.get_text():
            print("No records found for the search criteria")
            return results
        
        # Find results table - based on actual HTML structure
        results_table = soup.find('table', class_='results')
        if not results_table:
            # Try alternative table selectors
            results_table = soup.find('table', id='row')
            
        if results_table:
            # Get search criteria info
            criteria_div = soup.find('div', class_='criteria')
            if criteria_div:
                print(f"Search performed: {criteria_div.get_text().strip()}")
            
            # Get result count
            page_banner = soup.find('span', class_='pagebanner')
            if page_banner:
                print(f"Results: {page_banner.get_text().strip()}")
            
            tbody = results_table.find('tbody')
            if tbody:
                rows = tbody.find_all('tr')
            else:
                rows = results_table.find_all('tr')[1:]  # Skip header if no tbody
            
            for row in rows:
                cells = row.find_all('td')
                if len(cells) >= 9:  # Expected 9 columns based on HTML
                    
                    # Extract case information based on actual column structure
                    case_info = {}
                    
                    # Column 0: Case Number (with link)
                    case_number_cell = cells[0]
                    link = case_number_cell.find('a')
                    if link:
                        case_info['case_number'] = link.get_text().strip()
                        case_info['detail_url'] = urljoin(self.base_url, link.get('href'))
                    else:
                        case_info['case_number'] = case_number_cell.get_text().strip()
                    
                    # Column 1: Name
                    case_info['name'] = cells[1].get_text().strip()
                    
                    # Column 2: Date of Birth  
                    case_info['date_of_birth'] = cells[2].get_text().strip()
                    
                    # Column 3: Party Type
                    case_info['party_type'] = cells[3].get_text().strip()
                    
                    # Column 4: Court
                    case_info['court'] = cells[4].get_text().strip()
                    
                    # Column 5: Case Type
                    case_info['case_type'] = cells[5].get_text().strip()
                    
                    # Column 6: Case Status
                    case_info['case_status'] = cells[6].get_text().strip()
                    
                    # Column 7: Filing Date
                    case_info['filing_date'] = cells[7].get_text().strip()
                    
                    # Column 8: Case Caption
                    case_info['case_caption'] = cells[8].get_text().strip()
                    
                    results.append(case_info)
            
            print(f"Found {len(results)} case(s)")
        else:
            print("Could not find results table")
            # Save HTML for debugging
            with open('debug_results.html', 'w', encoding='utf-8') as f:
                f.write(soup.prettify())
            print("Saved debug HTML to debug_results.html")
        
        return results
    
    def get_case_details(self, case_url: str) -> Optional[Dict]:
        """Get detailed information for a specific case"""
        try:
            print(f"Fetching case details from: {case_url}")
            self.human_delay(1.0, 2.0)  # Simulate reading results before clicking
            
            response = self.session.get(case_url)
            response.raise_for_status()
            
            soup = BeautifulSoup(response.content, 'html.parser')
            
            # Extract case details - this will vary based on the actual page structure
            details = {}
            
            # Look for case information tables or divs
            # This is a basic example - you'll need to adjust based on actual page structure
            info_tables = soup.find_all('table')
            for table in info_tables:
                rows = table.find_all('tr')
                for row in rows:
                    cells = row.find_all(['td', 'th'])
                    if len(cells) == 2:
                        key = cells[0].get_text().strip().lower().replace(' ', '_')
                        value = cells[1].get_text().strip()
                        details[key] = value
            
            return details
            
        except Exception as e:
            print(f"Error fetching case details: {e}")
            return None

def main():
    """Example usage of the scraper"""
    print("🏛️  Maryland Judiciary Case Search Bot")
    print("="*40)
    
    # Ask user for scraping method
    use_selenium = input("Use Selenium for better bot evasion? (y/n, default: y): ").lower().strip()
    use_selenium = use_selenium != 'n'
    
    headless = False
    if use_selenium:
        headless = input("Run browser in headless mode? (y/n, default: n): ").lower().strip()
        headless = headless == 'y'
    
    try:
        scraper = MarylandCourtScraper(use_selenium=use_selenium, headless=headless)
        
        print(f"\n{'🤖 Using Selenium' if use_selenium else '📡 Using requests'}")
        print(f"{'👻 Headless mode' if headless else '🖥️  Visible browser'}")
        
        # Example search
        first_name = input("\nEnter first name: ").strip()
        last_name = input("Enter last name: ").strip()
        middle_name = input("Enter middle name (optional): ").strip()
        
        if not last_name:
            print("Last name is required!")
            return

        print("\nStarting search...")
        results = scraper.search_by_name(
            first_name=first_name,
            last_name=last_name,
            middle_name=middle_name
        )
        
        if results:
            print(f"\n{'='*50}")
            print(f"SEARCH RESULTS ({len(results)} found)")
            print(f"{'='*50}")
            
            for i, case in enumerate(results, 1):
                print(f"\n{i}. Case Number: {case.get('case_number', 'N/A')}")
                print(f"   Name: {case.get('name', 'N/A')}")
                print(f"   Date of Birth: {case.get('date_of_birth', 'N/A')}")
                print(f"   Party Type: {case.get('party_type', 'N/A')}")
                print(f"   Court: {case.get('court', 'N/A')}")
                print(f"   Case Type: {case.get('case_type', 'N/A')}")
                print(f"   Case Status: {case.get('case_status', 'N/A')}")
                print(f"   Filing Date: {case.get('filing_date', 'N/A')}")
                print(f"   Case Caption: {case.get('case_caption', 'N/A')}")
                
                if case.get('detail_url'):
                    print(f"   Detail URL: {case['detail_url']}")
            
            # Optionally get details for first case
            if results and results[0].get('detail_url'):
                get_details = input("\nWould you like to get details for the first case? (y/n): ").lower().strip()
                if get_details == 'y':
                    details = scraper.get_case_details(results[0]['detail_url'])
                    if details:
                        print(f"\n{'='*30}")
                        print("CASE DETAILS")
                        print(f"{'='*30}")
                        for key, value in details.items():
                            print(f"{key.replace('_', ' ').title()}: {value}")
        else:
            print("No results found or an error occurred.")
    
    except KeyboardInterrupt:
        print("\n\nSearch interrupted by user.")
    except Exception as e:
        print(f"\nError: {e}")
        print("If you're getting 403 errors, try using Selenium mode or check if captcha is required.")
    finally:
        # Cleanup
        if 'scraper' in locals() and hasattr(scraper, 'driver') and scraper.driver:
            scraper.driver.quit()
            print("Browser closed.")

if __name__ == "__main__":
    main()
