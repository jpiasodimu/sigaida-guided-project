from supabase import create_client

import requests
import xml.etree.ElementTree as ET 
import time
#using ET to parse the xml data
from dotenv import load_dotenv
import os

load_dotenv("../.env")
url = os.getenv("SUPABASE_URL")
key = os.getenv("SUPABASE_SERVICE_KEY")
supabase = create_client(url, key)
semester = "fall"
year = 2026
url1 = f"https://courses.illinois.edu/cisapp/explorer/schedule/{year}/{semester}.xml?mode=cascade"
response1 = requests.get(url1)
root1 = ET.fromstring(response1.text)
subjects = root1.findall('.//subject')
for subject in subjects:
   subject_name = subject.get('id')
   
   url = f"https://courses.illinois.edu/cisapp/explorer/schedule/2026/fall/{subject_name}.xml?mode=cascade"
   response = requests.get(url)
   time.sleep(0.5)
   #print(response.text)
   root = ET.fromstring(response.text)

   courses_container = root.find('cascadingCourses') 
   #this is a container of the list of courses
   #print(courses_container)
   courses = courses_container.findall('cascadingCourse')
   #this is a list of all the courses
   
   numGenEds = 0
   for course in courses: # need to check if it's a gen-ed
      if course.find('genEdCategories') is not None:
         course_name = course.find('.//label').text
         credit_hours = int((course.find('.//creditHours').text).split()[0])
         categories = course.findall('.//category')
         genEd_categories = []
         genEd_attributes = []
         for category in categories:
            genEd_categories.append(category.find('.//description').text)
            genEd_attributes.append(category.find('.//genEdAttribute').text)
         #print(genEd_categories)
         print(category.find('.//genEdAttribute').text)
         if any(attribute is not None for attribute in genEd_attributes):
            course_subject = course.find('.//subject').get('id') 
            course_number = course.find('.//course').get('id') 
            course_description = course.find('.//description').text 
            response = supabase.table("courses").upsert({"subject": course_subject, "number": course_number, "name": course_name, "description": course_description, "credit_hours": credit_hours, "gen_ed_category": genEd_categories, "gen_ed_attribute": genEd_attributes}, on_conflict="subject, number").execute()
            course_id = response.data[0]["id"]
            sections_container = course.find('.//detailedSections')
            sections = sections_container.findall('./detailedSection')
            #print("Number of sections: " + str(len(sections)) + "\n")
            #print("Meetings: " + "\n")
            print(f"Subject: {course_subject}, Number: {course_number}")
            for section in sections:
               if section.find('.//sectionNumber') is not None:
                  id = section.find('.//sectionNumber').text
               else:
                  id = None
               meetings = section.findall('.//meeting')
               if section.find('.//statusCode') is not None: #this checks for whether the course is open or closed for registration
                  status_code = section.find('.//statusCode').text
               else:
                  status_code = ""
               if section.find('.//partOfTerm') is not None:
                  part_of_term = section.find('.//partOfTerm').text
               else:
                  part_of_term = ""

               for meeting in meetings:
                  if meeting.find('.//start') is not None:
                     if meeting.find('.//start').text == "ARRANGED":
                        start = None
                        end = None
                     else:
                        start = meeting.find(".//start").text
                  else:
                     start = None
                  if meeting.find('.//end') is not None:
                     end = meeting.find('.//end').text
                  else:
                     end = None
                  if meeting.find('.//daysOfTheWeek') is not None:
                     days = meeting.find('.//daysOfTheWeek').text
                  else:
                     days = ""
                  if meeting.find('.//type') is not None:
                     type = meeting.find('.//type').get('code')
                  else: 
                     type = ""
                  if meeting.find(".//buildingName") is not None:
                     building = meeting.find('.//buildingName').text
                  else:
                     building = ""
                  if meeting.find('./roomNumber') is not None:
                     roomNumber = meeting.find('.//roomNumber').text
                  else:
                     roomNumber = ""
                  instructors = meeting.findall('.//instructor')
                  if instructors:
                     instructorList = []
                     for instructor in instructors:
                        instructorList.append(instructor.text)
                     printList = ",".join(instructorList)
                  else:
                     printList = None
                  supabase.table("sections").upsert({"course_id": course_id, "meeting_type": type, "section_number": id, "part_of_term": part_of_term, "start_time": start, "end_time": end, "days_of_week": days, "building":building, "room": roomNumber, "instructor": printList, "status_code": status_code, "semester": semester, "year": year}, on_conflict = "course_id, section_number, semester, year").execute()
                  #if ((type is not None) & (start is not None) & (end is not None) & (days is not None)):
                     #print("ID: " + id + ", Type: " + type + ", Building: " +  building  + ", Room #: " + roomNumber + ",  Start: " + start + ", End: " + end + ", Days: " + days + "\n")
                  #if instructors:
                     #print("Instructors: " + printList + "\n")       
      else: 
         print("Course could not be found." + "\n")
      

