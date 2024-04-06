from flask import Flask, render_template, request, jsonify
from flask_cors import CORS  # Import CORS from flask_cors
import pickle
import numpy as np
import pandas as pd

app = Flask(__name__)

CORS(app, origins=['http://localhost:5173'])

@app.route('/')
def home():
    return render_template('index.html')

@app.route('/predict', methods=['POST'])
def predict():
    # Load the model and preprocessing steps
    with open('step.pickle', 'rb') as file:
        data = pickle.load(file)
    regressor = data["model"]
    le_country = data["le_country"]
    le_education = data["le_education"]

    # Get user input from the form
    country = request.json['country']
    education = request.json['education']
    experience = float(request.json['experience'])

    # Perform preprocessing on user input
    country_code = le_country.transform([country])[0]
    education_code = le_education.transform([education])[0]

    # Prepare input data for prediction
    X = np.array([[country_code, education_code, experience]])

    # Make prediction
    salary = regressor.predict(X)

    # Return prediction as JSON response
    return jsonify({'salary': salary[0]})


def shorten_categories(categories, cutoff):
    categorical_map = {}
    for i in range(len(categories)):
        if categories.values[i] >= cutoff:
            categorical_map[categories.index[i]] = categories.index[i]
        else:
            categorical_map[categories.index[i]] = 'Other'
    return categorical_map


def clean_experience(x):
    if x ==  'More than 50 years':
        return 50
    if x == 'Less than 1 year':
        return 0.5
    return float(x)


def clean_education(x):
    if 'Bachelor’s degree' in x:
        return 'Bachelor’s degree'
    if 'Master’s degree' in x:
        return 'Master’s degree'
    if 'Professional degree' in x or 'Other doctoral' in x:
        return 'Post grad'
    return 'Less than a Bachelors'
def load_data():
    df = pd.read_csv("survey_results_public.csv")
    df = df[["Country", "EdLevel", "YearsCodePro", "Employment", "ConvertedComp"]]
    df = df[df["ConvertedComp"].notnull()]
    df = df.dropna()
    df = df[df["Employment"] == "Employed full-time"]
    df = df.drop("Employment", axis=1)

    country_map = shorten_categories(df.Country.value_counts(), 400)
    df["Country"] = df["Country"].map(country_map)
    df = df[df["ConvertedComp"] <= 250000]
    df = df[df["ConvertedComp"] >= 10000]
    df = df[df["Country"] != "Other"]

    df["YearsCodePro"] = df["YearsCodePro"].apply(clean_experience)
    df["EdLevel"] = df["EdLevel"].apply(clean_education)
    df = df.rename({"ConvertedComp": "Salary"}, axis=1)
    return df

@app.route('/explore', methods=['GET'])
def explore_data():
    df = load_data()

    # Example JSON data for demonstration purposes
    data = {
        "countries": df["Country"].value_counts().to_dict(),
        "mean_salary_by_country": df.groupby(["Country"])["Salary"].mean().sort_values(ascending=True).to_dict(),
        "mean_salary_by_experience": df.groupby(["YearsCodePro"])["Salary"].mean().sort_values(ascending=True).to_dict()
    }

    return jsonify(data)

if __name__ == '__main__':
    app.run(debug=True)
