const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const { spawn } = require('child_process');
const path = require('path');

// Import your existing professional model
const Booking = require('./booking.model');

const app = express();
app.use(cors());
app.use(express.json());

// 1. Connect to MongoDB (Using your existing hotel_db)
mongoose.connect('mongodb://localhost:27017/hotel_db')
  .then(() => console.log("✅ Booking Service: Connected to MongoDB"))
  .catch(err => console.error("❌ MongoDB Connection Error:", err));

// 2. Route: Fetch All Bookings (Original Logic)
app.get('/bookings', async (req, res) => {
  try {
    const data = await Booking.find();
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch bookings" });
  }
});

// 3. NEW INDUSTRIAL ROUTE: Semantic Natural Language Search
// This bridges your Node.js backend with the Python Transformer "Brain"
app.post('/search', (req, res) => {
  const { query } = req.body;

  if (!query) {
    return res.status(400).json({ error: "Search query is required" });
  }

  // Path to your Python semantic search script
  const pythonScript = path.join(__dirname, '../semantic-search-service/search_worker.py');

  // Spawn a child process to run the Python AI logic
  const pythonProcess = spawn('python', [pythonScript, query]);

  let resultData = "";

  // Capture the output from Python
  pythonProcess.stdout.on('data', (data) => {
    resultData += data.toString();
  });

  pythonProcess.on('close', async (code) => {
    try {
      // Python returns an array of MongoDB IDs that match the semantic intent
      const matchedIds = JSON.parse(resultData);

      // Fetch the actual booking documents from MongoDB using those IDs
      const results = await Booking.find({
        '_id': { $in: matchedIds }
      });

      console.log(`Semantic Search: Found ${results.length} relevant matches for "${query}"`);
      res.json(results);
    } catch (error) {
      console.error("Search Error:", error);
      res.status(500).json({ error: "Semantic Search Failed", details: "Ensure the semantic index has been generated." });
    }
  });
});

const PORT = 6001;
app.listen(PORT, () => {
  console.log(`🚀 Modern Booking Service active at http://localhost:${PORT}`);
});