# 🏨 Hotel Intelligence: AI-Driven Migration & Predictive Dashboard

This project demonstrates a full-scale industrial migration of a legacy hotel booking system into a modern, AI-powered microservices architecture. It features **Predictive Demand Forecasting** using Gradient Boosting and **Contextual Semantic Search** using Transformer-based Vector Embeddings.

---

## 🧠 Key AI Features

* **Predictive Demand Analytics:** A **Gradient Boosting Regressor** model that analyzes historical booking patterns to forecast future room demand.
* **Semantic Search Engine:** A **Natural Language Processing (NLP)** service using `all-MiniLM-L6-v2` (Sentence-BERT) to understand guest intent in special requests (e.g., searching for "romantic stay" returns "anniversary" matches).
* **Automated Data Migration:** A robust pipeline that transforms relational **MySQL** data into document-oriented **MongoDB** structures, optimized for AI processing.

---

## 🛠️ Tech Stack

* **Frontend:** React.js, Tailwind CSS, Recharts (Data Visualization)
* **Backend:** Node.js, Express.js
* **AI/ML:** Python, Scikit-Learn, Sentence-Transformers, Pandas
* **Databases:** MySQL (Legacy), MongoDB (Modern)

---

## 📂 Project Structure

```text
├── legacy-app/
│   └── backend/            # MySQL API (Port 5000)
├── modern-app/
│   ├── frontend/           # React Dashboard (Port 3000)
│   └── services/
│       ├── booking-service/    # Node.js API & AI Bridge (Port 6001)
│       ├── analytics-service/  # Python Predictive Model
│       └── semantic-search/    # Python Vector Search Engine
└── migration/              # SQL to NoSQL Transformation Scripts
