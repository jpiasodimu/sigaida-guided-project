# SIGAIDA Guided Project

**[Live demo](https://anyhoo.vercel.app/)** · Ingestion pipeline source: [fetch_courses.py](https://github.com/jpiasodimu/sigaida-guided-project/blob/main/gen-ed-ai/api/fetch_courses.py)

## What this project does

This project allows you to run the web app for our AI Gen-Ed Recommender (UIUC courses).

Our Recommender implements a form that requests the user to input their preferences for gen-eds such as category, times, days of the week, and additional preferences. One of our Python scripts, '[fetch_courses.py](https://github.com/jpiasodimu/sigaida-guided-project/blob/main/gen-ed-ai/api/fetch_courses.py)' directly fetches gen-ed courses for the specified semester (currently Fall 2026) from the Course Explorer XML API and adds them to our Supabase database. This script can be re-run in the case that courses are added or their information is revised, and it also upserts against the (subject, number) unique constraint, allowing courses to be updated in place instead of duplicating. Then, our 'app.py' script utilizes Flask to pull courses that match the user's preferences from Supabase and provide the courses to Claude API to give the user 3-5 course recommendations, with detailed information regarding course meeting times and descriptions.

## Project History
Our original project, found under the 'archive/original-project' branch, consisted of an AI Gen-Ed Recommender that was based on a static CSV containing UIUC Gen-Ed course offerings (see: https://waf.cs.illinois.edu/discovery/course-catalog.csv), as well as a Bus Delay Predictor that relied on a Python script populating data on bus traffic on the UIUC campus by accessing the MTD GTFS Feed to collect information on bus departures for 4 main bus routes - the 10E Gold, 12W Teal, 22N Illini, and 13N Silver during a school week.

Please access the '[archive/original-project](https://github.com/jpiasodimu/sigaida-guided-project/tree/archive/original-project)' branch to run the app with both the AI Gen-Ed Recommender and Bus Delay Predictor.


## Current Work
We are currently working on improving our recommender to support multiple semesters (Fall, Winter, Spring) and provide more features to enhance the student experience.

## Project Structure
```
sigaida-guided-project/
 gen-ed-ai/ 
    api/ --> fetch_courses.py (ingestion), app.py (Flask), requirements.txt
    app/ --> React pages and CSS 
    notebooks/ --> Python notebooks for testing filter logic 
 README.md
 schema.sql
```

## Setup
1. Clone the repo
2. Create a virtual environment
3. Install dependencies: Run `pip install -r gen-ed-ai/api/requirements.txt`
4. Create a Supabase project and run `schema.sql` in the Supabase SQL editor to create the required tables (schema designed by Sandy L.). Find your Supabase URL, Anon Key, and Service Key.
5. Add your three API keys and Supabase URL to your .env file (in the `gen-ed-ai` folder): `ANTHROPIC_KEY` (from Claude API), `SUPABASE_URL`, `SUPABASE_ANON_KEY`, and `SUPABASE_SERVICE_KEY`

## How to run the ingestion script
1. Ensure you are in the `gen-ed-ai` folder
2. `cd api`
3. In your terminal, enter: `python fetch_courses.py`
4. Open your Supabase table to see the populated courses 


## How to run the web app

1. Ensure you are in the `gen-ed-ai` folder 
2. Run Next.js: Open a new terminal and `cd app`, then enter `npm run dev` 
3. Run Flask: In another terminal, `cd api`, and enter: `flask --app app run`


## Contributors
- Jpia S. - Python ingestion scripts, XML API parsing, upsert logic, Claude API integration and prompt engineering
- Sandy L. - Supabase schema design, SQL queries, React frontend, course filtering logic

## Data Sources
- UIUC Course Explorer XML API: [documentation](https://courses.illinois.edu/cisdocs/explorer), [endpoint](https://courses.illinois.edu/cisapp/explorer/schedule/2026/fall.xml?mode=cascade) ('cascade' returns nested section and course data in one request) - accessed July 2026, maintained by Technology Services at Illinois / Office of the Registrar.
- Course Catalog CSV (original static CSV used): [CSV](https://github.com/wadefagen/datasets/tree/main/course-catalog) - credit to Professor Wade Fagen-Ulmschneider (UIUC)

## Tools & Attribution
- Claude API (Anthropic) - generates course recommendations in app.py
- Claude (Anthropic) - debugging and assistance throughout development
- ChatGPT (OpenAI) - initial web app template generation
