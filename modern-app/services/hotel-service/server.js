const express = require("express");
const app = express();
const cors = require("cors");

app.use(cors());

app.get("/hotels", (req, res) => {
  res.json([
    {
      id: 1,
      name: "Taj Hotel",
      city: "Mumbai",
      rating: 4.8,
      pricePerNight: 299,
      description: "Luxury hotel in Mumbai",
      image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400",
      wifi: true,
      parking: true,
      restaurant: true,
      pool: true,
      gym: true,
      spa: true
    },
    {
      id: 2,
      name: "Leela Palace",
      city: "Delhi",
      rating: 4.7,
      pricePerNight: 349,
      description: "Royal luxury experience",
      image: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=400",
      wifi: true,
      parking: true,
      restaurant: true,
      pool: true,
      spa: true
    }
  ]);
});

app.listen(7000, () => console.log("Hotel Service running on port 7000"));