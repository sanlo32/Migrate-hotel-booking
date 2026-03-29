const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "legacy_hotel_new"
});

// Get all bookings
app.get("/bookings", (req, res) => {
  db.query("SELECT * FROM bookings", (err, result) => {
    if (err) return res.status(500).send(err);
    res.json(result);
  });
});

// Create booking
app.post("/bookings", (req, res) => {
  const { customer_name, room_type, check_in, check_out } = req.body;

  db.query(
    "INSERT INTO bookings (customer_name, room_type, check_in, check_out) VALUES (?, ?, ?, ?)",
    [customer_name, room_type, check_in, check_out],
    (err, result) => {
      if (err) return res.status(500).send(err);
      res.json({ id: result.insertId });
    }
  );
});
app.put("/bookings/:id", (req, res) => {
  const { id } = req.params;
  const { customer_name, room_type, check_in, check_out } = req.body;

  const sql = `
    UPDATE bookings 
    SET customer_name=?, room_type=?, check_in=?, check_out=?
    WHERE id=?
  `;

  db.query(
    sql,
    [customer_name, room_type, check_in, check_out, id],
    (err, result) => {
      if (err) {
        console.error("UPDATE ERROR:", err); // 👈 add this
        return res.status(500).json({ error: err.message });
      }

      if (result.affectedRows === 0) {
        return res.status(404).json({ message: "Booking not found" });
      }

      res.json({ id, customer_name, room_type, check_in, check_out });
    }
  );
});
app.listen(5000, () => console.log("Legacy API running on 5000"));