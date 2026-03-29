const mysql = require('mysql');
const mongoose = require('mongoose');

// 1. Connect to Modern MongoDB
mongoose.connect('mongodb://localhost:27017/hotel_db')
  .then(() => console.log("Connected to Modern MongoDB."));

// Define the Modern Schema directly in the migration script
const bookingSchema = new mongoose.Schema({
  customer_name: String,
  room_type: String,
  check_in: Date,
  check_out: Date,
  special_requests: String // <-- Ready for Semantic Search
});
const Booking = mongoose.model('Booking', bookingSchema);

// 2. Connect to Legacy MySQL
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'legacy_hotel_new'
});

db.connect((err) => {
  if (err) throw err;
  console.log("Connected to Legacy MySQL.");

  // 3. Fetch and Migrate Data
  db.query("SELECT * FROM bookings", async (err, results) => {
    if (err) throw err;

    console.log(`Found ${results.length} legacy records. Starting migration...`);

    // Clear out the old modern database to ensure a clean slate
    await Booking.deleteMany({});

    // Loop through and transfer every record
    for (let i = 0; i < results.length; i++) {
      const row = results[i];

      const newBooking = new Booking({
        customer_name: row.customer_name,
        room_type: row.room_type,
        check_in: row.check_in,
        check_out: row.check_out,
        special_requests: row.special_requests // <-- Moving the text data
      });

      await newBooking.save();
    }

    console.log("✅ DB-to-DB Migration Complete!");
    process.exit();
  });
});