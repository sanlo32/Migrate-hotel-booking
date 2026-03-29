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



const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema({
  customer_name: {
    type: String,
    required: true
  },

  type: {
    type: String,
    enum: ["hotel", "flight"],
    default: "hotel"
  },

  hotel_name: String,
  flight_number: String,

  rooms: [
    {
      room_type: String,
      price: Number,
      guests: {
        type: Number,
        default: 1
      }
    }
  ],

  check_in: Date,
  check_out: Date,

  totalPrice: {
    type: Number,
    default: 0
  }

}, { timestamps: true });

module.exports = mongoose.model("Booking", bookingSchema);