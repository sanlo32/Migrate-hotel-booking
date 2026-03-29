import joblib
from pymongo import MongoClient
from sentence_transformers import SentenceTransformer
import time

# 1. Initialize the Transformer (Must match the Search Worker)
print("Loading Transformer Model...")
model = SentenceTransformer("all-MiniLM-L6-v2")


def generate_semantic_index():
    # 2. Connect to your Modern MongoDB
    client = MongoClient("mongodb://localhost:27017/")
    db = client["hotel_db"]
    collection = db["bookings"]

    # 3. Fetch all bookings that have special requests
    # We only need the ID and the text for indexing
    cursor = collection.find({}, {"_id": 1, "special_requests": 1})
    bookings = list(cursor)

    if not bookings:
        print("❌ Error: No bookings found in MongoDB. Migrate your data first!")
        return

    # Extract texts and their corresponding MongoDB IDs
    texts = [b.get("special_requests", "No request provided") for b in bookings]
    # We convert ObjectId to string so it's JSON serializable later
    ids = [str(b["_id"]) for b in bookings]

    print(f"Vectorizing {len(texts)} booking requests. This may take a moment...")

    start_time = time.time()

    # 4. Perform the mathematical encoding (The "Heavy Lifting")
    # This creates a NumPy matrix of shape (Number of Bookings, 384)
    embeddings = model.encode(texts, show_progress_bar=True)

    # 5. Save the Vector Map and ID Map together
    # This allows the search worker to instantly load the 'memory'
    joblib.dump({"embeddings": embeddings, "ids": ids}, "semantic_index.joblib")

    duration = time.time() - start_time
    print(f"✅ Success! Index created in {duration:.2f} seconds.")
    print(
        f"Saved to: modern-app/services/semantic-search-service/semantic_index.joblib"
    )


if __name__ == "__main__":
    generate_semantic_index()
