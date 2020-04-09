const mongoose = require("mongoose");


const CityStationsSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
    maxlength: 255
  },
  stationcode: {
    type: String,
    required: true,
    unique: true,
    maxlength: 2
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
  city: mongoose.Schema.Types.Mixed,
});
const CityStations = new mongoose.model("CityStations", CityStationsSchema);
module.exports.CityStations = CityStations;
