import requests
from bs4 import BeautifulSoup
import mysql.connector


url = "https://fnec.cornell.edu/for-participants/recipe-table"
mydb = mysql.connector.connect(
  host="localhost",
  user="root",
  password="",
  database="recipie_management"
)

print(mydb)

r=requests.get(url)

soup=BeautifulSoup(r.text,'html.parser')
s = soup.find('table', id="tablepress-67") 
header_html = s.find('thead').find('tr').find_all('th')
headers=[]
data_html=s.find('tbody').find_all('tr')
for d in header_html:
    headers.append(d.text)

data_dict = {header: [] for header in headers}

for r in data_html:
    cells=r.find_all("td")
    for ind,cell in enumerate(cells):
        data_dict[headers[ind]].append(cell.text)
        
#dict={x:[] for x in header }

#for k,v in data_dict.items():
#    print(k,":",v)
    

#print(soup.prettify())