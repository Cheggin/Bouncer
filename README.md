# Bouncer - AI-Powered Consumer Risk Assessment


## Inspiration
- In the past decade, the issue of **data privacy** has become increasingly relevant as more malicious uses of public information have come to light.
- We hoped to show how public information can instead be used for **social good** by providing business owners with **access control** via **AI-powered** consumer risk assessment.




## What it does
- Users input information like their name, email, city, zip code, and/or facial image, which is put into a **public information** search via Google Custom Search and summarized through **Gemini** Flash 2.0 for **quick yet detailed inference**.
- Summaries are then run through **Claude 4** for **clean, thoroughly explained** risk-level output
- Database owners can then send notifications according to their configured risk level thresholds as well as their own **preferences** of what information they would like our system to prioritize. 




## How we built it
- **Deployment:** Vercel using the Expo framework 
- **Front End:** React Native with Typescript
- **Back End:**
    - **Claude:**
        - Safe risk level analysis on deep search information + user-customized prompt
    - **Gemini:**
        - Queried through Python Flask
        - Thorough summaries on public information deep search via Google Custom Search API
    - **Resend:**
        - Verified domain emails (bouncer-app.com) sent to database owner via Supabase edge functions
- **Database:**
    - **Supabase:**
        - Edge functions
        - Authentication
        - Public schemas




## Challenges we ran into
- We encountered query limiting issues with Google's Custom Search JSON API that we worried would harm one of our demos.
- We ran into obstacles when using Supabase. Finding workarounds to things like row-level security, finding out how triggers worked, as well as understanding edge function invocation took a bit of troubleshooting.




## Accomplishments that we're proud of
- **Impact:** Most importantly, we are proud of the potential positivity this product may create. With the increasing need for application security, as well as the widespread malicious use of public information, our idea was founded upon spreading a message–that while public information can be dangerous, it can also be used for good.
- **Thoroughness:** This is by far the most thought-out and fully deployed app we have ever made–with comprehensive activity logs, risk summary emails, and the aesthetic dashboard.
- **Front end:** Creating a visually pleasing dashboard display that connected to all of our other functions (and that we all agreed looked good) was a great Eureka! moment.




## What we learned
- **The harms and benefits of vast public information:** We found out how easy it is to find someone's public information through simple web queries. Though we utilized this data for social good, we all became more cognizant about the extent of public information.
- **LLM strengths and weaknesses:** Though many can serve the same general purposes, finding the specific LLM that best use case allowed us to find the contextual bounds of each.
- **Supabase Functionality:** We learned a ton about how Supabase and other databases have increasing meta-editing functionality through edge functions as well as triggers.












## What's next for Bouncer
- **npm package deployment:** We plan to publish Bouncer as an npm package so that it can be easily added as a form of a log-in page to any application (web, iOS, and Android) in a single line. 
- **Verification of inference results:** Though our results were accurate, verifying these results would ensure the credibility of our risk level output. Using separate models, increasing the depth of information search, and more could be ways to accomplish this.









