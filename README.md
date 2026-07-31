## Anyhoo Gen-Ed AI Recommender
This is the original combined build. Current development is on '[main](https://github.com/jpiasodimu/anyhoo-gened-recommender)'.

## What this project does
This project allows you to run the web app for our AI Gen-Ed Recommender and Bus Delay Predictor (UIUC courses).

The Bus Delay Predictor runs on data collected from bus traffic around the UIUC Campus, specifically for 4 main routes: the 10E Gold, 12W Teal, 22N Illini and 13N Silver. Our Python script, `main.py` accesses the MTD GTFS Feed to collect information regarding bus departures from 5 stops that are part of all four routes, specifically PAR, Armory/Wright, Lincoln Plaza, Illini Union, and Lincoln Square. This script obtains info such as bus headsigns, expected arrival, scheduled arrival (based on live tracking of the bus' GPS coordinates), calculates delay, and stores the details in `departures.csv` for later data analysis. Using the collected data over a 3 day period in the Spring 2026 semester, we cleaned our data to only include buses with delays less than 12 minutes and began analyzing using one-hot-encoding of the bus route direction, headsign, and stop, to determine which bus routes experience the greatest delays and during which time periods during the school semester. A detailed analysis of the data we collected can be found in '[analysis_results.txt](https://github.com/jpiasodimu/anyhoo-gened-recommender/blob/archive/original-project/bus-data/src/analysis_results.txt)'.

Our Recommender implements a form that requests the user to input their preferences for gen-eds such as category, times, days of the week, and additional preferences. While the newest version of our Recommender operates on data stored in a Supabase database, this version relies on a static CSV containing UIUC Gen-Ed course offerings for the Fall semester. Our `app.py` collects the student's preferences - Gen-Ed categories, days of the week, start/end time, and passes them as parameters to filter.py. Then, `filter.py` filters courses from the CSV file that matches the student's preferences, returning a filtered Pandas dataframe containing info such as the course name, meeting times, descriptions, and credit hours. Afterwards, in `page.tsx`, the filtered courses are passed as a JSON to Claude API, which is prompted to return 3-5 courses with detailed descriptions of their meeting times, locations and descriptions.

## Project Structure
```
anyhoo-gened-recommender/
 bus-data/
    data/ --> Sample data from MTD website GTFS Feed
    output/ --> Collected CSV data - departures.csv, departures_clean.csv
    src/ --> main.py, notebooks (bus_analysis.ipynb, bus_cleaning.ipynb), data analysis                                  (analysis_results.txt)
  gen-ed-ai/
    api/ --> courses.csv (course catalog CSV), app.py (Flask request), filter.py (filter logic)
    app/ --> React pages and CSS style info
    notebooks/ --> data_cleaning.ipynb (Python notebook for testing course filter logic )
    public/ --> Bus data JSON and image files
  README.md
```
## Setup
1. Clone the repo
2. Create a virtual environment
3. Install dependencies: Run `pip install -r gen-ed-ai/api/requirements.txt`
4. Go to the '[CU-MTD Site](https://developer.cumtd.com/)' and request an API Key under the 'Get an API Key' section.
5. Go to the '[Claude Console Site](https://platform.claude.com/dashboard)' and retrieve an API Key under the 'API Keys' section.
6. Add your API keys to your .env file (in the `gen-ed-ai` folder): ANTHROPIC_KEY (from Claude API), MTD_API_KEY (from the MTD API)

## How to run the data collector
1. In a terminal enter: `python bus-data/src/main.py`
2. To view the data, visit: `bus-data/output/departures.csv`
*It's best to run this during the UIUC school year, to get the most accurate data, since out-of-season operation times for the MTD system may differ and not fully represent student traffic.

## How to run the web app
1. Ensure you are in the `gen-ed-ai` folder
2. Run Next.js: Open a new terminal and `cd app`, then enter `npm run dev`
3. Run Flask: In another terminal, `cd api`, and enter: `flask --app app run`

## Contributors
- Jpia S. - Bus data collection and analysis (cleaning, one-hot encoding, delay analysis), Flask requests, Prompt creation and Claude API Integration
- Sandy L. - Front-end design for website - Bus Delay Predictor and Gen-Ed Recommender, Course Filtering logic

## Data Sources
- Course Catalog CSV (original static CSV used): CSV - credit to Professor Wade Fagen-Ulmschneider (UIUC)
- CU-MTD API: documentation, endpoint - accessed April 2026, maintained by MTD.

## Tools & Attribution
- Claude API (Anthropic) - generates course recommendations in app.py
- Claude (Anthropic) - debugging and assistance throughout development
- ChatGPT (OpenAI) - initial web app template generation
