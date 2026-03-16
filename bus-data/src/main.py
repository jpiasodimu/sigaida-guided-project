
import pandas as pd 
import requests
import time 
from datetime import datetime

stops = ["PAR:2", "ARYWRT:5", "PLAZA:4", "IU:1", "LSE:8"]


while True:
    timestamp = datetime.now()
    all_departures = []
    for stop in stops: 
        url = f"https://developer.mtd.org/api/v2.2/json/getdeparturesbystop?key=c097f4c423e7471eb40a606d859ce9e0&stop_id={stop}"
        try:
            response = requests.get(url)
            data = response.json()
            departures = data.get("departures", [])
            print(f"Collected data for stop {stop} at {timestamp}")
            df_res = pd.DataFrame(departures)
            if not df_res.empty:
                df_res = df_res[df_res.headsign == "13N Silver"] #check for the correct headsign
                df_res["scheduled"] = pd.to_datetime(df_res["scheduled"])
                df_res["expected"] = pd.to_datetime(df_res["expected"])
                df_res["delay"] = (df_res.expected - df_res.scheduled).dt.total_seconds() / 60 #finds the delay
                df_res["queried_stop"] = stop
                df_res["timestamp"] = timestamp # to collect the current time
                all_departures.append(df_res)
                print(f"Collected data for stop {stop} at {timestamp}")
            else:
                print(f"No departures found for stop {stop}")
        except requests.exceptions.RequestException as e:
            print(f"Request failed: {e}")
            continue
        except Exception as e:
            print(f"Other error: {e}")
            continue #if a stop fails, it shouldn't keep us from checking others!   
    if all_departures:     
        df_all = pd.concat(all_departures, ignore_index = True)
    #header_name only gets added once
    #f = file we are writing to
    #index = false, column of indices unincluded
        with open("./bus-data/output/departures.csv", "a") as f:
            df_all.to_csv(f, index = False, header=f.tell() == 0)   

    time.sleep(60)



