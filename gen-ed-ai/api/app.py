from flask import Flask, request, Response
from flask_cors import CORS
import pandas as pd
from filter import filter_courses
from datetime import time

app = Flask(__name__)
CORS(app)

#loading the csv just once
df = pd.read_csv("./data/courses.csv")

@app.route("/filter", methods = ["POST"]) #whenever someone chooses this endpoint, activates 
def get_filtered_courses():
    data = request.get_json() #getting data in jsonified form
    if not data.get("selectedSubs"):
        gen_ed = None #storing user preferences according to keys in page.tsx
    else:
        gen_ed = ",".join(data.get("selectedSubs"))
    if data.get("credits") == "":
        credits = None
    else: 
        credits = data.get("credits") + " hours."
    if not data.get("selectedDays"):
        days = None #storing user preferences according to keys in page.tsx
    else:
        days = ",".join(data.get("selectedDays"))
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

    print("gen_ed:", gen_ed)
    print("credits:", credits)
    print("days:", days)
    print("part_of_term:", part_of_term)
    print("start_time:", start_time)
    print("end_time:", end_time)

    print(type(gen_ed))
    print(repr(gen_ed))

    result = filter_courses( #filtering courses based off vars
        df, 
        gen_ed=gen_ed,
        credits=credits,
        days = days,
        part_of_term= part_of_term,
        start_time=start_time,
        end_time=end_time
    )
    print("Result shape:", result.shape)
    print("Result head:", result.head())

    return Response(result.to_json(orient="records"), mimetype = 'application/json') # returning results as a JSON

