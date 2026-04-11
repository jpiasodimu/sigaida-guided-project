# %%
import pandas as pd
import requests
df = pd.read_csv("../data/trips.txt")

#Route: Silver
#Stops: PAR, Goodwin and Gregory, Gregory and Mumford, Illini Union
#trip_id: [@6.0.28932250@][1][1654525597845]/57__SV1_UIF
# scheduled vs expected = delay


#create a .py file 
#create a .csv file to write data
# run a while true function
# every time request, keep a timestamp of the request
# run as a background progress
#request and then sleep for a minute
df.head(10)

# %%
df_stoptimes = pd.read_csv("../data/stop_times.txt")
df_stoptimes[df_stoptimes["trip_id"] == "[@6.0.28932250@][1][1654213811517]/48__SV4_SCH_UIMTH"]
df_stoptimes["route_name"] = "Silver"
df_stoptimes.head(20)

# %%
url = "https://developer.mtd.org/api/v2.2/json/getdeparturesbystop?key=c097f4c423e7471eb40a606d859ce9e0&stop_id=GRGMUM:2"

# %%
response = requests.get(url)
data = response.json()
departures = data["departures"]
df_departures = pd.DataFrame(departures)

# %%
df_departures

# %%
stops = ["PAR:2", "ARYWRT:5", "PLAZA:4", "IU:1", "LSE:8"]
all_departures = []

for stop in stops:
    url = f"https://developer.mtd.org/api/v2.2/json/getdeparturesbystop?key=c097f4c423e7471eb40a606d859ce9e0&stop_id={stop}"
    response = requests.get(url)
    data = response.json()
    departures = data.get("departures", [])

    df_res = pd.DataFrame(departures)

    if not df_res.empty:
        print(df_res.info())

        df_res["expected"] = pd.to_datetime(df_res["expected"], errors="coerce")
        df_res["scheduled"] = pd.to_datetime(df_res["scheduled"], errors="coerce")

        df_res["delay"] = df_res["expected"] - df_res["scheduled"]
        df_res["queried_stop"] = stop

        all_departures.append(df_res)

df_all = pd.concat(all_departures, ignore_index=True)

# %%
df_all

# %%
import io

resp = requests.get(
	"https://waf.cs.illinois.edu/discovery/course-catalog.csv",
	verify=False,  # disable SSL cert verification to avoid CERTIFICATE_VERIFY_FAILED
)
courses = pd.read_csv(io.StringIO(resp.text))

# %%
print(courses.columns)
print(courses["Credit Hours"].head(10))
print(courses["Credit Hours"].dtype)


# %%
courses.info()



