const mongoose = require("mongoose");
const mysql = require("mysql2/promise");

// 🔹 Pricing logic
function getRoomPrice(roomType, checkIn) {
  const basePrices = {
    Single: 100,
    Double: 200,
    Suite: 400
  };

  let price = basePrices[roomType] || 150;

  const month = new Date(checkIn).getMonth();
  if (month === 11 || month === 0) { // Dec or Jan
    price *= 1.2;
  }

  return price;
}

// 🔹 Nights calculation
function calculateNights(checkIn, checkOut) {
  const diff = new Date(checkOut) - new Date(checkIn);
  return Math.ceil(diff / (1000 * 60 * 60 * 24));
}

async function migrateDB() {
  // 🔗 Ensure the DB name matches your server.js (hotel_db)
  await mongoose.connect("mongodb://127.0.0.1:27017/hotel_db");

  const Booking = mongoose.model("Booking", {
    customer_name: String,
    rooms: Array,
    check_in: Date,
    check_out: Date,
    totalPrice: Number,
    special_requests: String // 👈 ADDED: Critical for Semantic Search
  });

  const db = await mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "legacy_hotel_new"
  });

  console.log("Fetching data from MySQL...");
  const [rows] = await db.execute("SELECT * FROM bookings");

  const grouped = {};

  // 🔹 Group bookings by customer and stay dates
  rows.forEach(r => {
    const key = `${r.customer_name}_${r.check_in}_${r.check_out}`;
    if (!grouped[key]) {
      grouped[key] = [];
    }
    grouped[key].push(r);
  });

  console.log(`Migrating ${Object.keys(grouped).length} unique bookings...`);

  for (let key in grouped) {
    const bookings = grouped[key];
    const customer = bookings[0].customer_name;
    const checkIn = bookings[0].check_in;
    const checkOut = bookings[0].check_out;

    // Combine special requests from all rooms in the group
    const combinedRequests = bookings
      .map(b => b.special_requests)
      .filter(req => req) // Remove empty/null notes
      .join(". ");

    const nights = calculateNights(checkIn, checkOut);

    const rooms = bookings.map(b => {
      const price = getRoomPrice(b.room_type, checkIn);
      return {
        room_type: b.room_type,
        price: price
      };
    });

    const totalPrice = rooms.reduce((sum, r) => {
      return sum + (r.price * nights);
    }, 0);

    await Booking.create({
      customer_name: customer,
      rooms: rooms,
      check_in: checkIn,
      check_out: checkOut,
      totalPrice: totalPrice,
      special_requests: combinedRequests // 👈 ADDED: Now mapped for AI indexing
    });
  }

  console.log("✅ DB Migration Done - Data ready for AI processing.");
  process.exit();
}

migrateDB();