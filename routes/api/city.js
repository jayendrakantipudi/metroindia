const { City } = require("../../models/city");
const express = require("express");
const router = express.Router();


router.get("/all", async(req, res) => {
    var cities = await City.find();
    res.send(cities);
});

router.post("/addcity", async(req, res) => {
    if(!req.body.name){res.send('Enter city!')}
    if(!req.body.latitude){res.send('Give Latitude!')}
    if(!req.body.longitude){res.send('Give Longitude!')}
    if(!req.body.citycode){res.send('Give Code for the City!')}
    let city = await City.find({ name: req.body.name });
    console.log(city.length);
    
    if(city.length == 0){
        let new_city = new City({
            name: req.body.name,
            latitude: req.body.latitude,
            longitude: req.body.longitude,
            citycode: req.body.citycode
        });
        new_city.save();
        res.send(new_city)
    }
    else{
        res.send('City already exists!');
    }
});


module.exports = router;
