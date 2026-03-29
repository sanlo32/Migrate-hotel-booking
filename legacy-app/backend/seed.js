const mysql = require("mysql2");
const faker = require("@faker-js/faker").faker;

const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "legacy_hotel_new"
});

for (let i = 0; i < 1000; i++) {
  db.query(
    "INSERT INTO bookings (customer_name, room_type, check_in, check_out) VALUES (?, ?, ?, ?)",
    [
      faker.person.fullName(),
      ["Single", "Double", "Suite"][Math.floor(Math.random() * 3)],
      faker.date.future(),
      faker.date.future()
    ]
  );
}

console.log("1000 bookings inserted");