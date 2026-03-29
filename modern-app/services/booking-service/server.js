const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());
app.use(cors());

mongoose.connect("mongodb://127.0.0.1:27017/modern_hotel");

app.post("/bookings", async (req, res) => {
  const { customer_name, rooms, check_in, check_out } = req.body;

  // ✅ Calculate total revenue
  const totalPrice = rooms.reduce((sum, r) => sum + (r.price || 0), 0);

  const booking = new Booking({
    customer_name,
    rooms,
    check_in,
    check_out,
    totalPrice
  });

  await booking.save();
  res.json(booking);
});

app.get("/bookings", async (req, res) => {
  const data = await Booking.find();
  res.json(data);
});

// 4. Start the Server on Port 6001 (as per your repository README)
const PORT = 6001;
app.listen(PORT, () => {
  console.log(`Booking Service is running on http://localhost:${PORT}`);
});