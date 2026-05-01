from flask import Flask, request, Response, jsonify, make_response
from flask_cors import CORS
from dotenv import load_dotenv
import pandas as pd
import anthropic
import os
from filter import filter_courses
from datetime import time
from google import genai

load_dotenv(".env")
app = Flask(__name__)
CORS(app)

@app.after_request
def add_cors_headers(response):
    response.headers["Access-Control-Allow-Origin"] = "*"
    response.headers["Access-Control-Allow-Headers"] = "Content-Type,Authorization"
    response.headers["Access-Control-Allow-Methods"] = "GET,POST,OPTIONS"
    return response

#loading the csv just once
df = pd.read_csv("./data/courses.csv")

@app.route("/filter", methods=["POST", "OPTIONS"])
def get_filtered_courses():
    if request.method == "OPTIONS":
        return make_response(), 200

    data = request.get_json() #getting data in jsonified form
    if not data.get("selectedSubs"):
        gen_ed = None #storing user preferences according to keys in page.tsx
    else:
        gen_ed = ",".join(data.get("selectedSubs"))
    if data.get("credits") == "" or data.get("credits") is None:
        credits = None
    else:
        credits = data.get("credits") + " hours."
    if not data.get("selectedDays"):
        days = None #storing user preferences according to keys in page.tsx
    else:
        days = data.get("selectedDays")
    if not data.get("selectedTerms"):
        part_of_term = None #storing user preferences according to keys in page.tsx
    else:
        part_of_term = ",".join(data.get("selectedTerms"))
    if data.get("startTime") == "":
        start_time = None
    else:
        start_time = time.fromisoformat(data.get("startTime"))
    if data.get("endTime") == "":
        end_time = None
    else:
        end_time = time.fromisoformat(data.get("endTime"))

    result = filter_courses( #filtering courses based off vars
        df,
        gen_ed=gen_ed,
        credits=credits,
        days=days,
        part_of_term=part_of_term,
        start_time=start_time,
        end_time=end_time
    )
    return Response(result.to_json(orient="records"), mimetype="application/json")

@app.route("/recommend", methods=["POST", "OPTIONS"])
def get_recommendation():
    if request.method == "OPTIONS":
        return make_response(), 200

    data = request.get_json() #what we formatted earlier
    prompt = data.get("prompt")
    client = anthropic.Anthropic(api_key=os.getenv("ANTHROPIC_KEY"))
    message = client.messages.create(
        model="claude-haiku-4-5-20251001",
        max_tokens=1000,
        messages=[{"role": "user", "content": prompt}]
    )
    if message.content and len(message.content) > 0: #checks for empty content
        if hasattr(message.content[0], "text"): #checks that the type is correct
            content = message.content[0].text
        else:
            content = ""
    else:
        content = ""
    return jsonify({"response": content}) #returns Claude's response as a json

