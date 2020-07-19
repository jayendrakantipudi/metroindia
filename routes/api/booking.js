const { Trains } = require("../../models/train");
const { Bookings } = require("../../models/booking");
const mongoose = require('mongoose');
var City = mongoose.model('City');
var CityStations = mongoose.model('CityStations');
const express = require("express");
const router = express.Router();


router.get("/all", async(req, res) => {
    var all_bookings = await Bookings.find();
    res.send(all_bookings);
});

router.post("/getBookings", async(req, res) => {
    var bookings_avail = await Bookings.find({ "user_id": req.body.user_id });
    if(bookings_avail.length == 0){
        var message = "No bookings till now!";
        res.send(message);
    }
    else{
        res.send(bookings_avail);
    }
});

router.post("/booktrain", async(req, res) => {
    if(!req.body.train_id){res.send('Enter train_id!')}
    if(!req.body.email){res.send('Enter Email!')}
    if(!req.body.from){res.send('Enter from!')}
    if(!req.body.to){res.send('Enter to!')}
    if(!req.body.ticket_num){res.send('Enter ticket_num!')}


    let get_user = await User.findOne({ email: req.body.email });

    const user_id = get_user._id;

    let selected_train = await Trains.findOne({ _id: req.body.train_id });

    let city = await City.findOne({ name: selected_train.city.name });
    let source = await CityStations.findOne({ name: req.body.from, "city.name": city.name });
    let destination = await CityStations.findOne({ name: req.body.to, "city.name": city.name });

    var user_bookings = await Bookings.find({ "user_id": user_id });

    if(!selected_train){
        res.send("No train with given ID!")
    }
    else{

        var userID = user_id;
        
        var train_code = selected_train.code;

        var num_bookings = user_bookings.length;

        var unique_code = userID + train_code + num_bookings.toString();

        var train_stops = selected_train.stops;
        var start_ind = train_stops.indexOf(req.body.from);
        var end_ind = train_stops.indexOf(req.body.to);
        var cost_to_travel = end_ind - start_ind;
        cost_to_travel = req.body.ticket_num * cost_to_travel * 10;
        

        let new_train = new Bookings({
            booking_code: unique_code,
            user_id: user_id,
            train_id: req.body.train_id,
            ticket_num: req.body.ticket_num,
            cost: cost_to_travel,
            city: city,
            fromStation: source,
            toStation: destination
        });

        new_train.save();
        res.send(new_train)
    }
});


module.exports = router;
