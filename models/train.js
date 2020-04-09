const mongoose = require("mongoose");


const TrainsSchema = mongoose.Schema({
  code: {
    type: String,
    required: true,
    maxlength: 255
  },
  capacity: {
    type: Number,
    required: true
  },
  start_time: {
    type: Number,
    required: true
  },
  end_time: {
    type: Number,
    required: true
  },
  stops: mongoose.Schema.Types.Mixed,
  city: mongoose.Schema.Types.Mixed,
  fromStation: mongoose.Schema.Types.Mixed,
  toStation: mongoose.Schema.Types.Mixed,
});
const Trains = new mongoose.model("Trains", TrainsSchema);
module.exports.Trains = Trains;
