const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// 1. Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/hotel_db')
  .then(() => console.log("Booking Service: Connected to MongoDB Database"));

// 2. Define Schema with the new text field
const bookingSchema = new mongoose.Schema({
  customer_name: String,
  room_type: String,
  check_in: Date,
  check_out: Date,
  special_requests: String // <-- Schema updated to accept text notes
});
const Booking = mongoose.model('Booking', bookingSchema);

// 3. Create the API Route to serve data to the React frontend
app.get('/bookings', async (req, res) => {
  try {
    const bookings = await Booking.find();
    res.json(bookings);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error fetching bookings" });
  }
});

// 4. Start the Server on Port 6001 (as per your repository README)
const PORT = 6001;
app.listen(PORT, () => {
  console.log(`Booking Service is running on http://localhost:${PORT}`);
});