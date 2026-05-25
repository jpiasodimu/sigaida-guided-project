# SIGAIDA Guided Project

## What this project does
- This project includes a bus-data folder, with our Python script used for collecting bus data, as well as the gen-ed-ai folder, which includes CSS, Typescript, and Node.js functionality used to create our course-recommender website. 



## Project Structure
sigaida-guided-project/<br>
&nbsp;&nbsp; bus-data/<br>
&nbsp;&nbsp;&nbsp; data/ --> Sample data from MTD website GTFS Feed <br>
&nbsp;&nbsp;&nbsp; output/ --> Collected CSV data<br>
&nbsp;&nbsp;&nbsp; src/ --> Python script (main) and notebook <br>
&nbsp;&nbsp; gen-ed-ai/ <br>
&nbsp;&nbsp;&nbsp; .next/ <br>
&nbsp;&nbsp;&nbsp; api/ --> course catalog csv and Flask request and filter logic <br>
&nbsp;&nbsp;&nbsp; app/ --> React pages and CSS style info <br>
&nbsp;&nbsp;&nbsp; node_modules/ --> node module packages <br>
&nbsp;&nbsp;&nbsp; notebooks/ --> Python notebook for testing course filter logic <br>
&nbsp;&nbsp;&nbsp; public/ --> Bus data JSON and image files <br>
&nbsp;&nbsp; venv/ <br>
&nbsp;&nbsp; .env  <br>
&nbsp;&nbsp; README.md <br>

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
- Jpia S. — bus data collection, flask requests and prompt creation
- Sandy L. — web app (both bus delay and course recommender), course filtering logic 

## Tools & Attribution
- Claude (Anthropic) - code assistance and debugging throughout development
- ChatGPT (OpenAI) - initial web app template generation
