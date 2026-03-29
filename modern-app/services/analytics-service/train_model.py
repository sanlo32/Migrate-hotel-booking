import pandas as pd
from pymongo import MongoClient
from sklearn.ensemble import GradientBoostingRegressor
from sklearn.compose import ColumnTransformer
from sklearn.preprocessing import OneHotEncoder
from sklearn.pipeline import Pipeline
import joblib
import warnings

# Suppress minor sklearn warnings for a cleaner terminal output
warnings.filterwarnings("ignore")

print("1. Fetching data from the modern database...")
# Connect to MongoDB (If using Atlas, replace 'localhost' with your cloud string)
client = MongoClient("mongodb://localhost:27017/")
db = client["hotel_db"]
bookings_collection = db["bookings"]

# Load all records into a pandas DataFrame
data_from_db = list(bookings_collection.find())
if not data_from_db:
    print("Error: No data found in the database. Run your migration script first.")
    exit()

df_db = pd.DataFrame(data_from_db)

print("2. Processing dates and calculating historical demand...")
# Extract the exact month and year for seasonal pattern recognition
df_db["check_in"] = pd.to_datetime(df_db["check_in"])
df_db["month"] = df_db["check_in"].dt.month
df_db["year"] = df_db["check_in"].dt.year

# Group the data to see exactly how many of each room type were booked per month
monthly_demand = (
    df_db.groupby(["year", "month", "room_type"]).size().reset_index(name="demand")
)

# Define what the AI learns from (X) and what it needs to predict (y)
X = monthly_demand[["year", "month", "room_type"]]
y = monthly_demand["demand"]

print("3. Building the optimized AI pipeline...")
# The ColumnTransformer translates the text 'room_type' into math the AI understands
preprocessor = ColumnTransformer(
    transformers=[("cat", OneHotEncoder(handle_unknown="ignore"), ["room_type"])],
    remainder="passthrough",
)

# We use the highly accurate settings we discovered during our Grid Search test
model_pipeline = Pipeline(
    steps=[
        ("preprocessor", preprocessor),
        (
            "regressor",
            GradientBoostingRegressor(
                n_estimators=200, learning_rate=0.01, max_depth=4, random_state=42
            ),
        ),
    ]
)

print("4. Training the Gradient Boosting model...")
model_pipeline.fit(X, y)

print("5. Saving the model to the hard drive...")
# Save the trained model so Node.js can use it instantly without retraining
joblib.dump(model_pipeline, "production_demand_model.joblib")

print(
    "✅ Success! The 'production_demand_model.joblib' file is ready for real-time predictions."
)
