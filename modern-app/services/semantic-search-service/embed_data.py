import numpy as np
from pymongo import MongoClient
from sentence_transformers import SentenceTransformer
import joblib

# 1. Initialize the Transformer model (Industry standard for speed/accuracy)
model = SentenceTransformer("all-MiniLM-L6-v2")


def create_semantic_index():
    client = MongoClient("mongodb://localhost:27017/")
    db = client["hotel_db"]
    collection = db["bookings"]

    # Fetch all bookings with text requests
    bookings = list(collection.find({}, {"_id": 1, "special_requests": 1}))

    texts = [b.get("special_requests", "") for b in bookings]
    ids = [str(b["_id"]) for b in bookings]

    print(f"Encoding {len(texts)} requests into vector space...")

    # 2. Generate Dense Embeddings
    embeddings = model.encode(texts, show_progress_bar=True)

    # 3. Persist the index and ID map for the search service
    joblib.dump({"embeddings": embeddings, "ids": ids}, "semantic_index.joblib")
    print("✅ Semantic index created and saved.")


if __name__ == "__main__":
    create_semantic_index()
