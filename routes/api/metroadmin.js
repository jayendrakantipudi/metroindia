const { City } = require("../../models/city");
const { Trains } = require("../../models/train");
const { CityStations } = require("../../models/city_stations");
const { Bookings } = require("../../models/booking");
const express = require("express");
const router = express.Router();
const morgan = require('morgan');


router.get("/cities", async(req, res) => {
    var cities = await City.find();
    console.log(cities);
    res.render('manage_base', {cities});
});


router.get("/stations", async(req, res) => {
    var all_stations = await CityStations.find();
    console.log(all_stations);
    var station_code = await CityStations.find().select('stationcode');
    console.log('Station codes are ' + station_code);
    res.render('manage_stations', {all_stations, station_code})
});

router.get("/trains", async(req, res) => {
    var all_trains = await Trains.find();
    console.log(all_trains);
    res.render('manage_trains', {all_trains})
});

router.get("/bookings", async(req, res) => {
    var all_bookings = await Bookings.find();
    console.log(all_bookings);
    res.render('manage_bookings', {all_bookings})
});


module.exports = router;
