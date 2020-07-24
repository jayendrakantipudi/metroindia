const { Trains } = require("../../models/train");
const mongoose = require('mongoose');
var City = mongoose.model('City');
var CityStations = mongoose.model('CityStations');
const express = require("express");
const router = express.Router();


router.get("/all", async(req, res) => {
    var all_trains = await Trains.find();
    res.send(all_trains);
});

router.post("/getTrains", async(req, res) => {
    console.log('Coming from android!!')
    let src = await CityStations.findOne({ name: req.body.from });
    let dest = await CityStations.findOne({ name: req.body.to });
    if(!src){
        res.send({'message': 'No Such Source'})
    }
    else if(!dest){
        res.send({'message': 'No Such Destination'})
    }
    else{
        var trains_avail = await Trains.find({ "stops": { $all: [src.name, dest.name] }})
        var trains_possible = [];
        var src_name = src.name;
        var dest_name = dest.name;
        for (let i = 0; i < trains_avail.length; i++) {
            var element = trains_avail[i];
            var stops_array = element.stops;
            
            var src_ind = stops_array.indexOf(src_name);
            var dest_ind = stops_array.indexOf(dest_name);
            if(src_ind < dest_ind){
                trains_possible.push(element)
            }
        }
        if(trains_possible.length > 0){
            var json_obj = {"trains": trains_possible}
            json_obj["message"] = "Yes"
            res.send(json_obj);
        }
        else{
            res.send({"message":"No"})
        }
    }

    
});

router.post("/addtrain", async(req, res) => {
    if(!req.body.capacity){res.send('Enter Capacity!')}
    if(!req.body.cityname){res.send('Give City!')}
    if(!req.body.start_time){res.send('Give Start Time!')}
    if(!req.body.end_time){res.send('Give End Time!')}
    if(!req.body.fromStation){res.send('Give Source!')}
    if(!req.body.toStation){res.send('Give Destination!')}


    let city = await City.findOne({ name: req.body.cityname });
    let source = await CityStations.findOne({ name: req.body.fromStation, "city.name": req.body.cityname });
    let destination = await CityStations.findOne({ name: req.body.toStation, "city.name": req.body.cityname });

    let availTrains = await Trains.find({ "fromStation.name": req.body.fromStation, 
                                          "toStation.name": req.body.toStation, 
                                          "start_time": req.body.start_time,
                                          "end_time": req.body.end_time, });

    var num_stops = req.body.stops;
    var stops_arr = [req.body.fromStation];
    if(num_stops.length > 0){
        for(let i = 0; i < num_stops.length; i++){
            stops_arr.push(num_stops[i]);
        }        
    }
    stops_arr.push(req.body.toStation);

    if(availTrains.length > 0){
        res.send("A train already exists in that route in the given time interval.")
    }
    else{

        let totalTrains = await Trains.find({ "fromStation.name": req.body.fromStation, "toStation.name": req.body.toStation });

        var trainNum = totalTrains.length + 1;
        var generatedCode = city.citycode + source.stationcode + destination.stationcode + trainNum.toString();
        

        let new_train = new Trains({
            code: generatedCode,
            capacity: req.body.capacity,
            start_time: req.body.start_time,
            end_time: req.body.end_time,
            city: city,
            stops:stops_arr,
            fromStation: source,
            toStation: destination
            
        });

        new_train.save();
        res.send(new_train)
    }
});


module.exports = router;
