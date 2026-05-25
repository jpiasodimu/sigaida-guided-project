# SIGAIDA Guided Project

## What this project does
This project allows you to run the web app for our AI Gen-Ed Recommender (UIUC courses) + Bus Delay Predictor. The main folders are the 'bus-data' and 'gen-ed-ai' folders. <br>

The 'bus-data' folder contains the CSV data collected from multiple bus routes on campus (10E Gold, 12W Teal, 22N Illini, and 13N Silver) during 3 school days, and the script for collecting bus data. <br>

Within the 'gen-ed-ai' folder, the CSS stylesheet, React formatting code, as well as the course CSV and Python filtering logic and Flask script are accessible. <br>



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
In a terminal enter: python bus-data/src/main.py

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
