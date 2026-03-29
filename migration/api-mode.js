

// const axios = require("axios");
// const mysql = require("mysql2/promise");

// // Pricing logic
// function getRoomPrice(roomType, checkIn) {
// const basePrices = {
// Single: 100,
// Double: 200,
// Suite: 400
// };

// let price = basePrices[roomType] || 150;

// const month = new Date(checkIn).getMonth();
// if (month === 11 || month === 0) {
// price = price * 1.2;
// }

// return price;
// }

// // Nights calculation
// function calculateNights(checkIn, checkOut) {
// const diff = new Date(checkOut) - new Date(checkIn);
// return Math.ceil(diff / (1000 * 60 * 60 * 24));
// }

// async function migrate() {
// try {
// const db = await mysql.createConnection({
// host: "localhost",
// user: "root",
// password: "",
// database: "legacy_hotel_new"
// });

// const result = await db.execute("SELECT * FROM bookings");
// const rows = result[0];

// const grouped = {};

// rows.forEach(function(r) {
//   const key = r.customer_name + "_" + r.check_in + "_" + r.check_out;

//   if (!grouped[key]) {
//     grouped[key] = [];
//   }

//   grouped[key].push(r);
// });

// for (let key in grouped) {
//   const bookings = grouped[key];

//   const customer = bookings[0].customer_name;
//   const checkIn = bookings[0].check_in;
//   const checkOut = bookings[0].check_out;

//   const nights = calculateNights(checkIn, checkOut);

//   const rooms = bookings.map(function(b) {
//     const price = getRoomPrice(b.room_type, checkIn);
//     return {
//       room_type: b.room_type,
//       price: price
//     };
//   });

//   let totalPrice = 0;
//   rooms.forEach(function(r) {
//     totalPrice += r.price * nights;
//   });

//   const payload = {
//     customer_name: customer,
//     rooms: rooms,
//     check_in: checkIn,
//     check_out: checkOut,
//     totalPrice: totalPrice
//   };

//   await axios.post("http://localhost:6001/bookings", payload);
// }

// console.log("✅ API Migration Done");


// } catch (err) {
// console.error("❌ Migration Error:", err.message);
// }
// }

// migrate();

const axios = require("axios");
const mysql = require("mysql2/promise");

// 🔹 Normalize date (FIXES TIMEZONE BUG)
function formatDate(date) {
  return new Date(date).toISOString().split("T")[0];
}

// 🔹 Pricing logic
function getRoomPrice(roomType, checkIn) {
  const basePrices = {
    Single: 100,
    Double: 200,
    Suite: 400
  };

  let price = basePrices[roomType] || 150;

  const month = new Date(checkIn).getMonth();

  // Peak season pricing (Dec, Jan)
  if (month === 11 || month === 0) {
    price *= 1.2;
  }

  return price;
}

// 🔹 Nights calculation
function calculateNights(checkIn, checkOut) {
  const diff = new Date(checkOut) - new Date(checkIn);
  return Math.ceil(diff / (1000 * 60 * 60 * 24));
}

async function migrate() {
  try {
    // ✅ Connect MySQL
    const db = await mysql.createConnection({
      host: "localhost",
      user: "root",
      password: "",
      database: "legacy_hotel_new"
    });

    console.log("MySQL connected");

    // ✅ Fetch data
    const [rows] = await db.execute("SELECT * FROM bookings");
    console.log(`Fetched ${rows.length} legacy bookings`);

    const grouped = {};

    // 🔹 Group bookings (CRITICAL LOGIC)
    rows.forEach((r) => {
      const key = `${r.customer_name}_${formatDate(r.check_in)}_${formatDate(r.check_out)}`;

      if (!grouped[key]) {
        grouped[key] = [];
      }

      grouped[key].push(r);
    });

    console.log(`Grouped into ${Object.keys(grouped).length} bookings`);

    let successCount = 0;
    let failCount = 0;

    // 🔹 Transform + Send to API
    for (let key in grouped) {
      const bookings = grouped[key];

      const customer = bookings[0].customer_name;
      const checkIn = bookings[0].check_in;
      const checkOut = bookings[0].check_out;

      const nights = calculateNights(checkIn, checkOut);

      const rooms = bookings.map((b) => {
        const price = getRoomPrice(b.room_type, checkIn);

        return {
          room_type: b.room_type,
          price: price,
          guests: 1 // ✅ added
        };
      });

      const totalPrice = rooms.reduce((sum, r) => {
        return sum + (r.price * nights);
      }, 0);

      const payload = {
        customer_name: customer,
        rooms: rooms,
        check_in: checkIn,
        check_out: checkOut,
        totalPrice: totalPrice
      };

      try {
        await axios.post("http://localhost:6001/bookings", payload);
        successCount++;
      } catch (err) {
        failCount++;
        console.error("❌ Failed booking:", customer, "-", err.message);
      }
    }

    console.log("🎉 API Migration Completed!");
    console.log(`✅ Success: ${successCount}`);
    console.log(`❌ Failed: ${failCount}`);

    // ✅ Close DB connection
    await db.end();
    console.log("MySQL connection closed");

  } catch (err) {
    console.error("❌ Migration Error:", err.message);
  }
}

// 🚀 Run migration
migrate();