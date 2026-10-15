import os
import pickle

from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.naive_bayes import MultinomialNB
from sklearn.pipeline import Pipeline

# Sample email dataset
emails = [
    "Congratulations! You won a free prize",
    "Claim your cash reward now",
    "Win a free iPhone today",
    "Click here to claim your lottery money",
    "You have won a lottery",
    "Get a free gift card now",
    "Limited offer buy now",
    "Urgent! Claim your reward",
    "Earn money fast from home",
    "You are selected for a cash prize",
    "Hello, how are you?",
    "Please submit your assignment tomorrow",
    "Your meeting is scheduled for Monday",
    "Can we discuss the project today?",
    "Please find the attached document",
    "Your class starts at 10 AM",
    "Thank you for your email",
    "Please call me when you are free",
    "The assignment deadline is Friday",
    "I will meet you at college tomorrow"
]

labels = [
    "spam", "spam", "spam", "spam", "spam",
    "spam", "spam", "spam", "spam", "spam",
    "ham", "ham", "ham", "ham", "ham",
    "ham", "ham", "ham", "ham", "ham"
]

# Create a machine learning pipeline
model = Pipeline([
    ("tfidf", TfidfVectorizer()),
    ("classifier", MultinomialNB())
])

# Train the model
model.fit(emails, labels)

# Create a folder to store the model
os.makedirs("model", exist_ok=True)

# Save the trained model
with open("model/spam_model.pkl", "wb") as file:
    pickle.dump(model, file)

print("Spam detection model trained successfully!")
print("Model saved in the model folder.")