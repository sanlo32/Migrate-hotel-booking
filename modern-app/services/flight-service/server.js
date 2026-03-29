const express = require("express");
const cors = require("cors");

const app = express();
app.use(cors());

// ✅ Flight API
app.get("/flights", (req, res) => {
  res.json([
    {
      id: 1,
      airline: "Air India",
      flightNumber: "AI-202",
      from: "Mumbai (BOM)",
      to: "Delhi (DEL)",
      departureTime: "06:00",
      arrivalTime: "08:00",
      duration: "2h 00m",
      price: 4500,
      stops: 0,
      rating: 4.5,
      amenities: ["wifi", "meal", "entertainment"]
    },
    {
      id: 2,
      airline: "IndiGo",
      flightNumber: "6E-401",
      from: "Mumbai (BOM)",
      to: "Delhi (DEL)",
      departureTime: "08:30",
      arrivalTime: "10:30",
      duration: "2h 00m",
      price: 3899,
      stops: 0,
      rating: 4.3,
      amenities: ["wifi"]
    },
    {
      id: 3,
      airline: "Vistara",
      flightNumber: "UK-955",
      from: "Mumbai (BOM)",
      to: "Delhi (DEL)",
      departureTime: "15:45",
      arrivalTime: "17:45",
      duration: "2h 00m",
      price: 5299,
      stops: 0,
      rating: 4.7,
      amenities: ["wifi", "meal", "entertainment"]
    }
  ]);
});

app.listen(8000, () => {
  console.log("✈️ Flight Service running on port 8000");
});