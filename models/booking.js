const mongoose = require("mongoose");


const BookingsSchema = mongoose.Schema({
  booking_code: {
    type: String,
    required: true,
    maxlength: 255
  },
  user_id: {
    type: String,
    required: true,
    maxlength: 255     
  },
  train_id: {
    type: String,
    required: true,
    maxlength: 255     
  },
  ticket_num: {
    type: Number,
    required: true
  },
  cost: {
    type: Number,
    required: true
  },
  city: mongoose.Schema.Types.Mixed,
  fromStation: mongoose.Schema.Types.Mixed,
  toStation: mongoose.Schema.Types.Mixed,
});
const Bookings = new mongoose.model("Bookings", BookingsSchema);
module.exports.Bookings = Bookings;
