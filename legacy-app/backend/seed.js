const mysql = require('mysql');

// 1. Configure your MySQL connection (adjust if your WAMP/XAMPP password differs)
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'legacy_hotel_new'
});

db.connect((err) => {
  if (err) throw err;
  console.log('Connected to legacy MySQL database.');
  setupDatabase();
});

// Natural language notes for our upcoming Semantic Search
const semanticNotes = [
  "Quiet room for honeymoon with sea view.",
  "Wheelchair accessible near elevator.",
  "Late check-in expected, business trip, need fast Wi-Fi.",
  "Traveling with a pet, need a ground floor room.",
  "Standard stay, no special requests.",
  "Allergic to feathers, please provide synthetic pillows.",
  "Need a crib for a baby.",
  "Anniversary trip, would love a nice view."
];

function setupDatabase() {
  // 2. Automatically upgrade the legacy table to support semantic text
  const alterQuery = "ALTER TABLE bookings ADD COLUMN special_requests TEXT";

  db.query(alterQuery, (err) => {
    // It is perfectly fine if the column already exists
    if (err && err.code !== 'ER_DUP_FIELDNAME') {
      console.log("Table alteration error:", err.message);
    } else {
      console.log("Schema ready. special_requests column verified.");
    }

    console.log("Clearing old random data...");
    db.query("TRUNCATE TABLE bookings", (err) => {
      if (err) throw err;
      insertBookings(1500);
    });
  });
}

function insertBookings(count) {
  let completed = 0;
  console.log(`Inserting ${count} patterned bookings...`);

  for (let i = 0; i < count; i++) {
    // A. Weight the rooms (50% Single, 35% Double, 15% Suite)
    const roomRand = Math.random();
    let room = 'Single';
    if (roomRand > 0.5 && roomRand <= 0.85) room = 'Double';
    else if (roomRand > 0.85) room = 'Suite';

    // B. Create a "Summer Peak" bias for check-in dates
    let year = 2024 + Math.floor(Math.random() * 3);
    let month = Math.floor(Math.random() * 12) + 1;

    // 30% chance to force the booking into June, July, or August
    if (Math.random() < 0.3) {
      month = [6, 7, 8][Math.floor(Math.random() * 3)];
    }

    let day = Math.floor(Math.random() * 28) + 1;
    const checkInDate = `${year}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;

    // Check out is 1-5 days later
    const checkOutDay = day + Math.floor(Math.random() * 5) + 1;
    const checkOutDate = `${year}-${month.toString().padStart(2, '0')}-${checkOutDay.toString().padStart(2, '0')}`;

    // C. Pick a random semantic note
    const note = semanticNotes[Math.floor(Math.random() * semanticNotes.length)];

    // D. Insert into the legacy database
    const query = "INSERT INTO bookings (customer_name, room_type, check_in, check_out, special_requests) VALUES (?, ?, ?, ?, ?)";

    db.query(query, [`Guest_${i}`, room, checkInDate, checkOutDate, note], (err) => {
      if (err) throw err;
      completed++;
      if (completed === count) {
        console.log(`✅ Successfully generated ${count} highly patterned records!`);
        process.exit();
      }
    });
  }
}