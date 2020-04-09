const mongoose = require("mongoose");


const CitySchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
    maxlength: 255
  },
  latitude: {
    type: String,
    required: true,
    maxlength: 255
  },
  longitude: {
    type: String,
    required: true,
    maxlength: 255
  },
  citycode: {
    type: String,
    required: true,
    maxlength: 2
  }
});
const City = new mongoose.model("City", CitySchema);
module.exports.City = City;
