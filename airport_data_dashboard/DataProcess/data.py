
import urllib.request
import os
import time

def percentage(a, b, c):
	per = 100.0 * a * b / c
	if per > 100:
		per = 100
	print('%.2f%%' % per)

#https://transtats.bts.gov/PREZIP/On_Time_Reporting_Carrier_On_Time_Performance_1987_present_2019_1.zip
url_1 = "https://transtats.bts.gov/PREZIP/On_Time_Reporting_Carrier_"
url_2 = "On_Time_Performance_1987_present_"
extendsion = ".zip"

for year in range(2003, 2019):
    for month in range(1, 13):
        # if year == 2003 and month < 6:
        #     continue;
        # if year == 2018 and month > 8:
        #     continue;

        url = url_1 + url_2 + str(year) +"_"+ str(month) + extendsion
        filename = url_2 + str(year) + "_" + str(month) + extendsion
        path = os.path.join("/Users/devo/Desktop/project3/DataProcess/data", filename)
        print(url)
        urllib.request.urlretrieve(url, path, percentage)
        time.sleep(5)



