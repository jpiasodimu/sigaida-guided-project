import pandas as pd
from datetime import datetime
from supabase import create_client

from dotenv import load_dotenv
import os

load_dotenv("../.env")
url = os.getenv("SUPABASE_URL")
key = os.getenv("SUPABASE_ANON_KEY") #controlled, secure access to the frontend and backend (respecting RLS policies, control rules)
supabase = create_client(url, key)
#FYI, the read access policies allows anyone with the anon key to read rows from the table but they can't make any edits
# Maps raw course type names from the dataset to 5 simplified types.
# Types not in this dict (or mapped to None) are unsupported and will
# cause the whole course to be rejected.

RAW_TO_SIMPLE_TYPE = {
    "Lecture": "Lecture",
    "Online Lecture": "Lecture",
    "Lecture-Discussion": "Lecture-Discussion",
    "Online Lecture Discussion": "Lecture-Discussion",

    "Discussion/Recitation": "Discussion",
    "Online Discussion": "Discussion",

    "Laboratory": "Lab",
    "Online Lab": "Lab",
    "Laboratory-Discussion": "Lab",

    "Online": "Online course",

    "Independent Study": None,
    "Conference": None,
    "Seminar": None,
    "Study Abroad": None,
    "Internship": None,
    "Research": None,
    "Travel": None,
    "Studio": None,
    "Practice": None,
    "Quiz": None,
    "Packaged Section": None,
}


def normalize_type(type_value):
    """Convert a raw course type into one of the 5 supported types.
    Returns None if the type is unsupported."""
    if pd.isna(type_value):
        return None
    return RAW_TO_SIMPLE_TYPE.get(str(type_value).strip(), None)


def row_matches_schedule(row, days=None, start_time=None, end_time=None):
    
    """
    Check whether ONE section (row) fits the user's schedule constraints.
    Returns True if it fits, False if it doesn't.
    """
    # Days filter
    if days:
        wanted_days = set(days)
        row_days = set(str(row.get("days_of_week", "")).strip())
        if not row_days:
            return False
        # Class days must be a subset of user's available days
        # e.g. user says MWF, class is MW → allowed
        if not row_days.issubset(wanted_days):
            return False

    # Time filter: class must fit fully within the user's window
    row_start = row.get("start_time")
    row_end = row.get("end_time")

    if row_start and pd.notna(row_start):
       try: 
          row_start = datetime.strptime(str(row_start), "%I:%M %p").time()
       except ValueError:
           return False

    if row_end and pd.notna(row_end):
        row_end = datetime.strptime(str(row_end), "%I:%M %p").time()


    if start_time is not None and row_start is not None:
        if row_start < start_time:
            return False

    if end_time is not None and row_end is not None:
        if row_end > end_time:
            return False

    return True


def course_matches_bundle(course_df, days=None, start_time=None, end_time=None):
    """
    Keep a course only if:
    1. All its section types are supported (no unsupported types like Quiz, Studio)
    2. Every required component (lecture / discussion / lab) has at least ONE
       section that fits the user's days/time window
    """
    course_df = course_df.copy()
    course_df["Simple Type"] = course_df["meeting_type"].apply(normalize_type)

    # Reject the whole course if it contains any unsupported type
    if course_df["Simple Type"].isna().any():
        return False

    # Split rows by simplified type
    lecture_rows    = course_df[course_df["Simple Type"] == "Lecture"]
    lec_dis_rows    = course_df[course_df["Simple Type"] == "Lecture-Discussion"]
    discussion_rows = course_df[course_df["Simple Type"] == "Discussion"]
    lab_rows        = course_df[course_df["Simple Type"] == "Lab"]
    online_rows     = course_df[course_df["Simple Type"] == "Online course"]

    def has_valid(part_df):
        """Does this component have at least one section that fits the schedule?"""
        return any(
            row_matches_schedule(row, days=days, start_time=start_time, end_time=end_time)
            for _, row in part_df.iterrows()
        )

    # Case 1: Online-only course (no lecture/discussion/lab rows)
    if lecture_rows.empty and lec_dis_rows.empty and discussion_rows.empty and lab_rows.empty:
        return has_valid(online_rows)

    # Case 2: Lecture-Discussion combined type
    if not lec_dis_rows.empty:
        if not has_valid(lec_dis_rows):
            return False
        if not discussion_rows.empty and not has_valid(discussion_rows):
            return False
        if not lab_rows.empty and not has_valid(lab_rows):
            return False
        return True

    # Case 3: Normal structure — Lecture + optional Discussion + optional Lab
    if not lecture_rows.empty and not has_valid(lecture_rows):
        return False
    if not discussion_rows.empty and not has_valid(discussion_rows):
        return False
    if not lab_rows.empty and not has_valid(lab_rows):
        return False

    return True


def filter_courses(
    gen_ed=None,
    credits=None,
    days=None,
    part_of_term=None,
    start_time=None,
    end_time=None,
    semester=None,
    year=None,
):
    """
    Main filtering function.
    Step 1: Apply simple row-level filters (gen-ed, credits, part of term).
    Step 2: Group by Subject + Number and validate each full course bundle.

    Args:
        df: cleaned courses DataFrame (with Credit Hours, Start Time, End Time)
        gen_ed: gen-ed category string, e.g. "Humanities"
        credits: number of credit hours, e.g. 3
        days: list of available days, e.g. ["M", "W", "F"]
        part_of_term: part of term string, e.g. "1" or "2"
        start_time: earliest allowed start time (datetime.time object)
        end_time: latest allowed end time (datetime.time object)

    Returns:
        Filtered DataFrame with all columns including Instructors, Building, Room
    """
    query = supabase.table("courses").select("*")

    if gen_ed: # if list of gen-ed subcats present, will check the gen_ed_attribute column for any of them if present
        query = query.overlaps("gen_ed_attribute", gen_ed)
    if credits is not None:
        query = query.eq("credit_hours", credits)
    info = query.data
    course_ids = []
    for row in info: #iterates through a list of dictionaries, and individually accesses ids
        course_ids.append(row["id"])
    # querying for sections that match the course ids
    section_query = supabase.table("sections").select("*")
    #both will return either an empty list, or list of rows matching the course id
    if course_ids != []:
        #checks for all sections with the matching course_ids and part of term (If present)
        if part_of_term is not None:
           section_query = section_query.eq("part_of_term", part_of_term)
        if semester is not None:
           section_query = section_query.eq("semester", semester)
        if year is not None:
           section_query = section_query.eq("year", year)
        section_query = section_query.in_("course_id", course_ids).execute()
        
        section_query = section_query.data
    else:
        section_query = []

    courses_df = pd.DataFrame(info)
    sections_df = pd.DataFrame(section_query)
    #keeps course_info, and section info in one place (subject #, name, gen_ed, times, days, bulding)
    merged_df = pd.merge(courses_df, sections_df, left_on="id", right_on="course_id")
    
    # result = df.copy()

   
    # # Group by course (Subject + Number) and validate the whole bundle
    # # Essentially checks that all the required components fit a students schedule, for example if lecture/discussion and
    # # student prefers MWF, checking that both lecture and discussion meet those parameters
    # filtered = result.groupby(["Subject", "Number"]).filter(
    #     lambda course: course_matches_bundle(
    #         course,
    #         days=days,
    #         start_time=start_time,
    #         end_time=end_time,
    #     )
    # )
    # if days:
    #     wanted_days = set(days)
    #     filtered = filtered[
    #         filtered["Days of Week"].fillna("").apply(
    #             lambda x: bool(set(x).intersection(wanted_days))
    #         )
    #     ]
    # return filtered
