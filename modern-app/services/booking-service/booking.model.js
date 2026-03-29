// const mongoose = require("mongoose");

// const bookingSchema = new mongoose.Schema({
//   customer_name: String,

//   rooms: [
//     {
//       room_type: String,
//       price: Number   // ✅ added
//     }
//   ],

//   check_in: Date,
//   check_out: Date,

//   totalPrice: Number   // ✅ added
// });

// module.exports = mongoose.model("Booking", bookingSchema);



const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  customer_name: { type: String, required: true },
  rooms: [{
    room_type: String,
    price: Number
  }],
  check_in: { type: Date, required: true },
  check_out: { type: Date, required: true },
  totalPrice: Number,
  special_requests: String
});

module.exports = mongoose.model('Booking', bookingSchema);