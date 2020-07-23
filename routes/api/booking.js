const { Trains } = require("../../models/train");
const { Bookings } = require("../../models/booking");
const { User } = require("../../models/User");
const mongoose = require('mongoose');
var City = mongoose.model('City');
var CityStations = mongoose.model('CityStations');
const express = require("express");
const router = express.Router();


router.get("/all", async(req, res) => {
    var all_bookings = await Bookings.find();
    res.send(all_bookings);
});

router.post("/getBook", async(req, res) => {
    
    
    var bookings_avail = await Bookings.findOne({ "booking_code": req.body.book_id });
    if(bookings_avail.length == 0){
        var json_obj = {};
        json_obj["message"] = "No";
        res.send(json_obj);
    }
    else{
        var json_obj = {"bookings": bookings_avail};
        json_obj["message"] = "Yes";
        res.send(json_obj);
    }
});


router.get("/ConfirmBooking/:BID", async(req, res) => {

    var bookings_avail = await Bookings.find({ "booking_code": req.param.BID });
    
    if(!bookings_avail.valid){
        var myquery = { "booking_code": req.param.BID };
        var newvalues = { $set: {valid: true} };
        Bookings.updateOne(myquery, newvalues, function(err, res) {
        if (err) throw err;
        console.log("Gateway Succesfull!");
        });
        res.send("Gateway Succesfull!")
    }
    else{
        res.send("Gateway Unsuccesfull!")
    }

    
});



router.post("/getBookings", async(req, res) => {
    
    const get_user = await User.findOne({ email: req.body.email_id });
    const user_id = get_user._id;
    
    var sort = {'createdAt': -1};
    var bookings_avail = await Bookings.find({ "user_id": user_id }).sort(sort);
    if(bookings_avail.length == 0){
        var json_obj = {};
        json_obj["message"] = "No";
        res.send(json_obj);
    }
    else{
        var json_obj = {"bookings": bookings_avail};
        json_obj["message"] = "Yes";
        res.send(json_obj);
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

    let selected_train = await Trains.findOne({ code: req.body.train_id });

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
            toStation: destination,
            valid: false,
            start_time:selected_train.start_time,
            end_time:selected_train.end_time
        });

        new_train.save();
        res.send(new_train)
    }
});


module.exports = router;



