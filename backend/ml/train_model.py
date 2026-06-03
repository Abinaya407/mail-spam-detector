import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.pipeline import Pipeline
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.naive_bayes import MultinomialNB
import joblib

# Load email dataset
data = pd.read_csv("CEAS_08.csv")
print(data["urls"].head(20))
print(data["subject"].head())
print(data["body"].head())
# Combine useful fields
data["text"] = (
    data["subject"].fillna("") + " " +
    data["body"].fillna("")+ " "+
    data["sender"].fillna("")+" "+
    data["urls"].fillna("").astype(str)
)

X = data["text"]
y = data["label"]

# Train/Test split
X_train, X_test, y_train, y_test = train_test_split(
    X,
    y,
    test_size=0.2,
    random_state=42
)

# Model
model = Pipeline([
    ("vectorizer", TfidfVectorizer(stop_words="english",ngram_range=(1,2),
     max_features=10000)),
    ("classifier", MultinomialNB())
])

# Train
model.fit(X_train, y_train)

# Save
joblib.dump(model, "spam_model.pkl")

print("Email model trained successfully!")