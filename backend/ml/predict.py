import joblib
import sys
import json

import os

current_dir = os.path.dirname(os.path.abspath(__file__))
model_path = os.path.join(current_dir, "spam_model.pkl")

model = joblib.load(model_path)
email_text = sys.argv[1]

# Prediction
prediction = model.predict([email_text])[0]

# Probability
probabilities = model.predict_proba([email_text])[0]

spam_percentage = round(probabilities[1] * 100)

result = {
    "status": "spam" if prediction == 1 else "safe",
    "percentage": spam_percentage
}

print(json.dumps(result))