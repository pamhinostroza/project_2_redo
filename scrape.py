from bs4 import BeautifulSoup as bs 
import pandas as pd
import numpy as np
import json

# creating function

def test_scrape ():
    # visiting site via splinter
    url = 'https://www.tesladeaths.com/'

    tesla_table = pd.read_html(url)
    tesla_table = tesla_table[0]
    tesla_table = tesla_table.drop(columns=['Unnamed: 0','Unnamed: 2', 'Date', 'State', 'Tesla driver', 'Tesla occupant','Other vehicle', 'Cyclists/ Peds', 'Model', 'Autopilot claimed', 'Verified TeslaAutopilot Death', 'Source', 'FARS-NHTSA case filing', 'Note', 'Deceased 1', 'Deceased 2', 'Deceased 3', 'Deceased 4', 'TSLA + cycl/peds'])
    tesla_table = tesla_table.dropna(subset=['Year'])
    cols = ['Year', 'Deaths']
    tesla_table[cols] = tesla_table[cols].applymap(np.int64)
    tesla_table['Country'] = tesla_table['Country'].replace (['FR'], 'France')
    tesla_table['Country'] = tesla_table['Country'].replace (['Holland'], 'Netherlands')
    details = pd.read_csv("static/data/tesla_deaths_details.csv")
    tesla_table = pd.merge(tesla_table, details, on="Year")
    tesla_table = tesla_table.drop(columns = ['Country_y'])
    tesla_table = tesla_table.rename(columns={'Country_x':'Country'})

    # Turning to JSON from a table
    result = tesla_table.to_json(orient="records")
    parsed = json.loads(result)

    # return json.dumps(parsed)
    return parsed