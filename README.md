# SIGAIDA Guided Project

## What this project does

This project allows you to run the web app for our AI Gen-Ed Recommender (UIUC courses).

Our Recommender implements a form that requests the user to input their preferences for gen-eds such as category, times, days of the week, and additional preferences. One of our Python scripts, '[fetch_courses.py](https://github.com/jpiasodimu/sigaida-guided-project/blob/main/gen-ed-ai/api/fetch_courses.py)' directly fetches gen-ed courses for the specified semester (currently Fall 2026) from the Course Explorer XML API and adds them to our Supabase datatable. Then, our 'app.py' script utilizes Flask to pull courses that match the user's preferences from Supabase and provide the courses to Claude API to provide the user 3-5 course recommendations, with detailed information regarding course meeting times, and descriptions.

## Project History
Our original project, found under the 'archive/original-project' branch, consisted of an AI Gen-Ed Recommender that was based on a static CSV containing UIUC Gen-Ed course offerings (see: https://waf.cs.illinois.edu/discovery/course-catalog.csv), as well as a Bus Delay Predictor that relied on a Python Script populating data on bus traffic on the UIUC campus by accessing the MTD GTFS Feed to collect information on bus departures for 4 main bus routes - the 10E Gold, 12W Teal, 22N Illini, and 13N Silver during a school week.

## Current Work
We are currently working on improving our recommender to support multiple semesters (Fall, Winter, Spring) and provide more features to enhance the student experience. Please access the '[archive/original-project](https://github.com/jpiasodimu/sigaida-guided-project/tree/archive/original-project)' branch to run the app with both the AI Gen-Ed Recommender and Bus Delay Predictor.


## Project Structure
sigaida-guided-project/<br>
&nbsp; bus-data/<br>
&nbsp;&nbsp;&nbsp; data/ --> Sample data from MTD website GTFS Feed <br>
&nbsp;&nbsp;&nbsp; output/ --> Collected CSV data<br>
&nbsp;&nbsp;&nbsp; src/ --> Python script (main) and notebook <br>
&nbsp; gen-ed-ai/ <br>
&nbsp;&nbsp;&nbsp; .next/ <br>
&nbsp;&nbsp;&nbsp; api/ --> course catalog csv and Flask request and filter logic <br>
&nbsp;&nbsp;&nbsp; app/ --> React pages and CSS style info <br>
&nbsp;&nbsp;&nbsp; node_modules/ --> node module packages <br>
&nbsp;&nbsp;&nbsp; notebooks/ --> Python notebook for testing course filter logic <br>
&nbsp;&nbsp;&nbsp; public/ --> Bus data JSON and image files <br>
&nbsp; venv/ <br>
&nbsp; .env  <br>
&nbsp; README.md <br>

## Setup
1. Clone the repo
2. Create a virtual environment
3. Install dependencies: Run pip install -r requirements.txt
4. Add your API key to .env

## How to run the data collector
In a terminal enter: python bus-data/src/main.py <br>
*You can view the data in 'bus-data/output/departures.csv' <br>
*It's best to run this during the UIUC school year, to get the most accurate data, since out-of-season operation times for the MTD system may differ and not fully represent student traffic<br>

## How to run the web app
Ensure you are in the gen-ed-ai folder <br>
Run Next.js: Switch to the api folder and open a terminal and enter: npm run dev <br>
Run Flask: In another terminal, enter: python app.py, then flask --app app run <br>

## Contributors
- Jpia S. - bus data collection, flask requests and prompt creation
- Sandy L. - web app (both bus delay and course recommender), course filtering logic 

## Tools & Attribution
- Claude (Anthropic) - code assistance and debugging throughout development
- ChatGPT (OpenAI) - initial web app template generation
