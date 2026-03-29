import joblib
import json
import pandas as pd
from datetime import datetime


def generate_forecast():
    try:
        model = joblib.load("production_demand_model.joblib")
        current_year = datetime.now().year
        room_types = ["Single", "Double", "Suite"]
        months_labels = [
            "Jan",
            "Feb",
            "Mar",
            "Apr",
            "May",
            "Jun",
            "Jul",
            "Aug",
            "Sep",
            "Oct",
            "Nov",
            "Dec",
        ]

        forecast_results = []

        for m in range(1, 13):
            total_month_demand = 0
            for rt in room_types:
                # 👈 Create a feature row that matches the training X
                input_df = pd.DataFrame(
                    [[current_year, m, rt]], columns=["year", "month", "room_type"]
                )
                prediction = model.predict(input_df)[0]
                total_month_demand += max(0, prediction)

            forecast_results.append(
                {"month": months_labels[m - 1], "demand": int(total_month_demand)}
            )

        return json.dumps(forecast_results)
    except Exception as e:
        return json.dumps({"error": str(e)})


if __name__ == "__main__":
    print(generate_forecast())
