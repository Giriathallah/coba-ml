from flask import Flask, render_template, request
import pickle
import numpy as np

app = Flask(__name__)

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
    country = request.form['country']
    education = request.form['education']
    experience = float(request.form['experience'])

    # Perform preprocessing on user input
    country_code = le_country.transform([country])[0]
    education_code = le_education.transform([education])[0]

    # Prepare input data for prediction
    X = np.array([[country_code, education_code, experience]])

    # Make prediction
    salary = regressor.predict(X)

    # Render the result template with the predicted salary
    return render_template('result.html', salary=salary[0])

if __name__ == '__main__':
    app.run(debug=True)




# code github 
# import streamlit as st
# from predict_page import show_predict_page
# from explore_page import show_explore_page


# page = st.sidebar.selectbox("Explore Or Predict", ("Predict", "Explore"))

# if page == "Predict":
#     show_predict_page()
# else:
#     show_explore_page()
