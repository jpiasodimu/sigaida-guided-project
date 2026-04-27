# SIGAIDA Guided Project

## What this project does
- This project includes a bus-data folder, with our script used for collecting bus data, as well as the gen-ed-ai folder, which includes CSS, Typescript, and Node.js functionality used to create our course-recommender website. (Will update soon)
- This project includes a bus-data folder, with our script used for collecting bus data, as well as the gen-ed-ai folder, which includes CSS, Typescript, and Node.js functionality used to create our course-recommender website. (Will update soon)


## Project Structure
sigaida-guided-project/
├── bus-data/ 
├── data/ --> Sample data from MTD website GTFS Feed
├── output/ --> Collected CSV data
├── src/ --> Python script (main) and notebook
├── gen-ed-ai/   
├── .next/
├── api/ --> course catalog csv and Flask request and filter logic
├── app/ --> React pages and CSS style info
├── node_modules/ --> node module packages
├── notebooks/ --> Python notebook for testing course filter logic
├── public/ --> Bus data JSON and image files
├── venv/            
├── .env
└── README.md

## Setup
1. Clone the repo
2. Create a virtual environment
3. Install dependencies: Run pip install -r requirements.txt
4. Add your API key to .env

## How to run the data collector
python bus-data/src/main.py

## How to run the web app
Ensure you are in the gen-ed-ai folder
To run Next.js: Switch to the api folder and open a terminal and do: npm run dev
To run Flask: In another terminal, do: python app.py, then flask --app app run

## Contributors
- Jpia S. — bus data collection, flask requests and prompt creation
- Sandy L. — web app (both bus delay and course recommender), course filtering logic 

## Tools & Attribution
- Claude (Anthropic) - code assistance and debugging throughout development
- ChatGPT (OpenAI) - initial web app template generation