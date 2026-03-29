import sys
import json
import joblib
import numpy as np
from sentence_transformers import SentenceTransformer, util

# Load model and pre-computed index
model = SentenceTransformer("all-MiniLM-L6-v2")
data = joblib.load("semantic_index.joblib")
embeddings = data["embeddings"]
ids = data["ids"]


def perform_search(query_text, top_k=5):
    # Convert query to the same vector space
    query_embedding = model.encode(query_text)

    # Compute Cosine Similarity against the entire index
    cos_scores = util.cos_sim(query_embedding, embeddings)[0]

    # Find the top K highest scores
    top_results = np.argpartition(-cos_scores, range(top_k))[:top_k]

    results = []
    for idx in top_results:
        results.append({"id": ids[idx], "score": float(cos_scores[idx])})

    return sorted(results, key=lambda x: x["score"], reverse=True)


if __name__ == "__main__":
    query = sys.argv[1]
    search_results = perform_search(query)
    print(json.dumps(search_results))
