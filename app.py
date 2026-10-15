from flask import Flask, render_template, request, jsonify
import pickle

app = Flask(__name__)

# Load the trained machine learning model
with open("model/spam_model.pkl", "rb") as file:
    model = pickle.load(file)


@app.route("/")
def home():
    return render_template("index.html")


@app.route("/predict", methods=["POST"])
def predict():
    data = request.get_json()

    if not data or not isinstance(data.get("email"), str):
        return jsonify({"error": "Please enter an email message."}), 400

    email = data["email"].strip()

    if not email:
        return jsonify({"error": "Please enter an email message."}), 400

    prediction = model.predict([email])[0]

    if prediction == "spam":
        result = "Spam"
    else:
        result = "Not Spam"

    return jsonify({"result": result})


if __name__ == "__main__":
    app.run(debug=True)