# from flask import Flask, jsonify
from bs4 import BeautifulSoup as bs 
import pandas as pd
import requests
from sqlalchemy import create_engine
import numpy as np
from flask_pymongo import PyMongo 
from flask import Flask, jsonify, after_this_request
from flask import render_template, redirect
from bson.json_util import loads, dumps
import json
from bson import json_util
from scrape import test_scrape
import os

app = Flask(__name__)

#database connection starts here
app.config["MONGO_URI"] = "mongodb://localhost:27017/project3"
mongo = PyMongo(app)

#Flask Routes
@app.route("/")
def index():   
    deaths = mongo.db.deaths.find_one()
    return render_template("index.html")

#Create route to scrape
@app.route("/scrape")
def scrape_flask():
    tesla = mongo.db.deaths
    test_data = test_scrape()
    tesla.insert_many(test_data)
    return redirect("/", code=302)


@app.route("/data/",methods=['POST','GET'])
def tesla_deaths():
    @after_this_request
    def add_header(response):
        response.headers.add('Access-Control-Allow-Origin', '*')
        return response
    cursor = list(mongo.db.deaths.find())
    return json.dumps(cursor, default=json_util.default)

if __name__ == "__main__":
    app.run(debug=True)