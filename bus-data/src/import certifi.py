import certifi
print(certifi.where())
import urllib.request
print(urllib.request.urlopen("https://www.google.com").status)

