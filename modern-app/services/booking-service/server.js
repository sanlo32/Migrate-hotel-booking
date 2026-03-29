const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const { spawn } = require('child_process');
const path = require('path');
const Booking = require('./booking.model');

const app = express();
app.use(cors());
app.use(express.json());

// 1. Local MongoDB Connection
mongoose.connect('mongodb://127.0.0.1:27017/hotel_db')
  .then(() => console.log("✅ Modern Service: Connected to Local MongoDB"))
  .catch(err => console.error("❌ MongoDB Connection Error:", err));

// 2. Fetch Bookings (Limit to 50 for performance)
app.get('/bookings', async (req, res) => {
  try {
    const data = await Booking.find().sort({ check_in: -1 }).limit(50);
    res.json(data);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// 3. AI ROUTE: Semantic Search
app.post('/search', (req, res) => {
  const { query } = req.body;
  const pythonScript = path.join(__dirname, '../semantic-search-service/search_worker.py');
  const py = spawn('python', [pythonScript, query]);

  let resultData = "";
  py.stdout.on('data', (data) => resultData += data.toString());
  py.stderr.on('data', (data) => console.error(`Python Error: ${data}`));

  py.on('close', async () => {
    try {
      const matchedIds = JSON.parse(resultData);
      const results = await Booking.find({ '_id': { $in: matchedIds } });
      res.json(results);
    } catch (e) { res.status(500).json({ error: "Semantic Search failed" }); }
  });
});

// 4. AI ROUTE: Demand Prediction (For the Dashboard Graph)
app.get('/predict-demand', (req, res) => {
  const pythonScript = path.join(__dirname, '../analytics-service/predict_demand.py');
  const py = spawn('python', [pythonScript]);

  let resultData = "";
  py.stdout.on('data', (data) => resultData += data.toString());

  py.on('close', () => {
    try {
      res.json(JSON.parse(resultData));
    } catch (e) { res.status(500).json({ error: "Demand Prediction failed" }); }
  });
});

const PORT = 6001;
app.listen(PORT, () => console.log(`🚀 Modern API active on http://localhost:${PORT}`));