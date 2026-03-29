import pandas as pd
from pymongo import MongoClient
from sklearn.ensemble import GradientBoostingRegressor
from sklearn.compose import ColumnTransformer
from sklearn.preprocessing import OneHotEncoder
from sklearn.pipeline import Pipeline
import joblib

print("1. Fetching data from the modern database...")
client = MongoClient("mongodb://localhost:27017/")
db = client["hotel_db"]
bookings_collection = db["bookings"]

data_from_db = list(bookings_collection.find())
if not data_from_db:
    print("Error: No data found. Run migration first.")
    exit()

df_db = pd.DataFrame(data_from_db)

print("2. Flattening nested room data for AI training...")
# 👈 CRITICAL: Explode the 'rooms' array so each room is its own row
df_exploded = df_db.explode("rooms")
# Extract room_type from the nested dictionary
df_exploded["room_type"] = df_exploded["rooms"].apply(
    lambda x: x["room_type"] if isinstance(x, dict) else None
)

# Processing dates
df_exploded["check_in"] = pd.to_datetime(df_exploded["check_in"])
df_exploded["month"] = df_exploded["check_in"].dt.month
df_exploded["year"] = df_exploded["check_in"].dt.year

# Calculate demand per room type per month
monthly_demand = (
    df_exploded.groupby(["year", "month", "room_type"])
    .size()
    .reset_index(name="demand")
)

X = monthly_demand[["year", "month", "room_type"]]
y = monthly_demand["demand"]

print("3. Training the Gradient Boosting model...")
preprocessor = ColumnTransformer(
    transformers=[("cat", OneHotEncoder(handle_unknown="ignore"), ["room_type"])],
    remainder="passthrough",
)

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

model_pipeline.fit(X, y)
joblib.dump(model_pipeline, "production_demand_model.joblib")
print("✅ Success! Model is now compatible with grouped MongoDB documents.")
