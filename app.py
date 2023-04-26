from flask import Flask, render_template, request, redirect, flash, session, g
from quizlet_data_collector import get_data_from_quizlet
import sqlite3
import os
import requests
from datetime import datetime
import pandas as pd
import json
import re
from markupsafe import escape

app = Flask(__name__)
app.secret_key = b'_5#y2L"F4Q8z\n\xec]/'


@app.route("/")
def home():
    return render_template("home.html")

@app.route("/gravity", methods = ["POST"])
def gravity():
    url = request.form.get("url")

    terms, definitions = get_data_from_quizlet(url)
    vocab_pairs = {
        "terms": terms,
        "definitions": definitions
    }
    
    vocab_pairs_json = json.dumps(vocab_pairs, ensure_ascii=False)
    vocab_pairs_json = re.sub(r'[\r\n]+', r'\\n', vocab_pairs_json)
    print(f"JSON string with backslashes: '{vocab_pairs_json}'")
    return render_template('gravity.html', vocab_pairs=vocab_pairs_json)
    
    """
    except:
        flash("Sorry that quizlet url doesn't work")
        return redirect("/")
    """