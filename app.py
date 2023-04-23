from flask import Flask, render_template, request, redirect, flash, session, g
import sqlite3
import os
import requests
from datetime import datetime
import pandas as pd

app = Flask(__name__)

@app.route("/", methods = ["GET", "POST"])
def home():
    return render_template("home.html")

@app.route("/gravity", methods = ["GET"])
def gravity():
    return render_template("gravity.html")