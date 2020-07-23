const mongoose = require("mongoose");


const SmartCardSchema = mongoose.Schema({
  card_code: {
        type: Number,
        required: true
  },
  user_email: {
    type: String,
    required: true,
    maxlength: 255
  },
  credit: {
    type: Number,
    required: true
  },
  valid_month: {
    type: Number,
    required: true
  },
  city: mongoose.Schema.Types.Mixed
},{ timestamps: true });
const SmartCard = new mongoose.model("SmartCard", SmartCardSchema);
module.exports.SmartCard = SmartCard;
