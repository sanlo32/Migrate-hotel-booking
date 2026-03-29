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

// --- 1. Get all bookings ---
app.get("/bookings", (req, res) => {
  db.query("SELECT * FROM bookings", (err, result) => {
    if (err) {
      console.error("FETCH ERROR:", err);
      return res.status(500).json({ error: err.message });
    }
    res.json(result);
  });
});

// --- 2. Create booking (Updated with special_requests) ---
app.post("/bookings", (req, res) => {
  const { customer_name, room_type, check_in, check_out, special_requests } = req.body;

  const sql = "INSERT INTO bookings (customer_name, room_type, check_in, check_out, special_requests) VALUES (?, ?, ?, ?, ?)";

  db.query(
    sql,
    [customer_name, room_type, check_in, check_out, special_requests || ""],
    (err, result) => {
      if (err) {
        console.error("INSERT ERROR:", err);
        return res.status(500).json({ error: err.message });
      }
      res.json({ id: result.insertId });
    }
  );
});

// --- 3. Update booking (Updated with special_requests) ---
app.put("/bookings/:id", (req, res) => {
  const { id } = req.params;
  const { customer_name, room_type, check_in, check_out, special_requests } = req.body;

  const sql = `
    UPDATE bookings 
    SET customer_name=?, room_type=?, check_in=?, check_out=?, special_requests=?
    WHERE id=?
  `;

  db.query(
    sql,
    [customer_name, room_type, check_in, check_out, special_requests || "", id],
    (err, result) => {
      if (err) {
        console.error("UPDATE ERROR:", err);
        return res.status(500).json({ error: err.message });
      }

      if (result.affectedRows === 0) {
        return res.status(404).json({ message: "Booking not found" });
      }

      res.json({ id, customer_name, room_type, check_in, check_out, special_requests });
    }
  );
});

app.listen(5000, () => console.log("🚀 Legacy API running on http://localhost:5000"));