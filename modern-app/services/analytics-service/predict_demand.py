import sys
import pandas as pd
import joblib
import warnings

# Suppress minor warnings for a clean Node.js output
warnings.filterwarnings("ignore")

# 1. Catch the arguments passed from Node.js
try:
    target_year = int(sys.argv[1])
    target_month = int(sys.argv[2])
    target_room = sys.argv[3]
except IndexError:
    print("Error: Please provide year, month, and room_type.")
    sys.exit(1)

# 2. Load the optimized "brain" we trained earlier
try:
    model = joblib.load("production_demand_model.joblib")
except FileNotFoundError:
    print("Error: Model file not found. Please train the model first.")
    sys.exit(1)

# 3. Format the input exactly how the model expects it
input_data = pd.DataFrame(
    input_data=pd.DataFrame(
        {"year": [target_year], "month": [target_month], "room_type": [target_room]}
    )
)

# 4. Generate the highly accurate prediction
prediction = model.predict(input_data)

# Print strictly the integer so Node.js can parse it directly
print(int(prediction[0]))
