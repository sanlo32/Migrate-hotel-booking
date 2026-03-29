import sys
import json
import joblib
import numpy as np
from sentence_transformers import SentenceTransformer, util

# 1. Load the "Brain" (The Transformer and your saved Data)
model = SentenceTransformer("all-MiniLM-L6-v2")


def perform_search(query_text, top_k=5):
    try:
        # Load the pre-computed index created by the embedding script
        # We use joblib for fast loading of the vector matrix
        data = joblib.load("semantic_index.joblib")
        embeddings = data["embeddings"]
        ids = data["ids"]

        # 2. Convert the user's natural language query into a 384D vector
        query_embedding = model.encode(query_text)

        # 3. Compute Cosine Similarity against all stored vectors
        cos_scores = util.cos_sim(query_embedding, embeddings)[0]

        # 4. Extract the Top K matches
        top_results = np.argpartition(-cos_scores, range(top_k))[:top_k]

        results = []
        for idx in top_results:
            score = float(cos_scores[idx])
            # Only return results that pass our 0.45 "Signal" threshold
            if score > 0.45:
                results.append(ids[idx])

        return results
    except Exception as e:
        return {"error": str(e)}


if __name__ == "__main__":
    # Get the search query from the Node.js command line argument
    if len(sys.argv) > 1:
        query = sys.argv[1]
        print(json.dumps(perform_search(query)))
