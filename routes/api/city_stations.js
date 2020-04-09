const { CityStations } = require("../../models/city_stations");
const mongoose = require('mongoose');
var City = mongoose.model('City');
const express = require("express");
const router = express.Router();


router.get("/all", async(req, res) => {
    var all_stations = await CityStations.find();
    res.send(all_stations);
});

router.get("/:cityname", async(req, res) => {
    var all_stations = await CityStations.find({ "city.name": req.params.cityname });
    res.send(all_stations);
});

router.post("/addstation", async(req, res) => {
    if(!req.body.name){res.send('Enter Station!')}
    if(!req.body.latitude){res.send('Give Latitude!')}
    if(!req.body.longitude){res.send('Give Longitude!')}
    if(!req.body.cityname){res.send('Give City Name!')}
    if(!req.body.stationcode){res.send('Give Code for the Station!')}

    let cityStation = await CityStations.find({ name: req.body.name, "city.name": req.body.cityname });
    
    if(cityStation.length == 0){

        let city = await City.find({ name: req.body.cityname });

        let new_station = new CityStations({
            name: req.body.name,
            latitude: req.body.latitude,
            longitude: req.body.longitude,
            city: city,
            stationcode: req.body.stationcode
        });
        new_station.save();
        res.send(new_station)
    }
    else{
        res.send('A Station with similar name in the city already exists!');
    }
});


module.exports = router;
