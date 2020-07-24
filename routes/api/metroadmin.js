const { City } = require("../../models/city");
const { Trains } = require("../../models/train");
const { CityStations } = require("../../models/city_stations");
const { Bookings } = require("../../models/booking");
const { User } = require("../../models/User");

const express = require("express");
const router = express.Router();


//Cities Management


router.get("/cities", async(req, res) => {
    var cities = await City.find();
    console.log(cities);
    res.render('manage_base', {cities});
});

router.get("/cities/create", async(req, res) => {
    res.render('create_new_city');
});

router.post("/cities/create", async(req, res) => {
    if(!req.body.name){res.render('create_new_city',{message : 'Enter city!'})}
    if(!req.body.latitude){res.render('create_new_city', {message : 'Give Latitude!'})}
    if(!req.body.longitude){res.render('create_new_city',{message : 'Give Longitude!'})}
    if(!req.body.citycode){res.render('create_new_city', {message : 'Give Code for the City!'})}
    let city = await City.find({ "name": req.body.name });
    console.log(city.length);
    
    if(city.length == 0){
        let new_city = new City({
            name: req.body.name,
            latitude: req.body.latitude,
            longitude: req.body.longitude,
            citycode: req.body.citycode
        });
        try
        {
            new_city.save((err)=>res.render('create_new_city', {message : 'Invalid inputs!' + err}));
            res.redirect('/metroadmin/cities');
        }
        catch{
            res.render('create_new_city', {message : 'Invalid inputs!'});
        }
    }
    else{
        res.render('create_new_city', {message : 'City already exists!'});
    }
});

router.get('/cities/update/:ccode', async(req, res) => {
    var city = await City.find({"citycode" : req.params.ccode });
    console.log(city[0].name);
    res.render('update_city', {city});
});

router.post('/cities/update/:ccode', async(req, res) => {
    
    if(!req.body.name){res.render('update_city',{message : 'Enter city!'})}
    if(!req.body.latitude){res.render('update_city', {message : 'Give Latitude!'})}
    if(!req.body.longitude){res.render('update_city',{message : 'Give Longitude!'})}
    if(!req.body.citycode){res.render('update_city', {message : 'Give Code for the City!'})}

    var result = await City.update({"citycode" : req.params.ccode }, {
        $set: {
            name : req.body.name,
            latitude: req.body.latitude,
            longitude: req.body.longitude,
            citycode: req.body.citycode
        }
    });  
    console.log(result);
    res.redirect('/metroadmin/cities');
});

router.get('/cities/delete/:ccode', async(req, res) => {
    var result = await City.deleteOne({"citycode" : req.params.ccode });
    console.log(result);
    res.redirect('/metroadmin/cities');
});



//Trains management

router.get("/trains", async(req, res) => {
    var all_trains = await Trains.find();
    console.log(all_trains);
    res.render('manage_trains', {all_trains})
});

router.get("/trains/create", async(req, res) => {
    var cities = await City.find();
    var stations = await CityStations.find();
    res.render('create_new_train', {cities, stations});
});

router.post("/trains/create", async(req, res) => {
    if(!req.body.capacity){res.render('create_new_train', {message: 'Enter Capacity!'})}
    if(!req.body.cityname){res.render('create_new_train', {message: 'Give City!'})}
    if(!req.body.start_time){res.render('create_new_train', {message: 'Give Start Time!'})}
    if(!req.body.end_time){res.render('create_new_train', {message: 'Give End Time!'})}
    if(!req.body.fromStation){res.render('create_new_train', {message: 'Give Source!'})}
    if(!req.body.toStation){res.render('create_new_train', {message: 'Give Destination!'})}
    let city = await City.findOne({ name: req.body.cityname });
    let source = await CityStations.findOne({ name: req.body.fromStation, "city.name": req.body.cityname });
    let destination = await CityStations.findOne({ "name": req.body.toStation, "city.name": req.body.cityname });

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
        res.render('create_new_train', {message: "A train already exists in that route in the given time interval."})
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
        console.log("Saved new train");
        console.log(new_train);
        res.redirect('/metroadmin/trains');
    }
});

router.get('/trains/update/:tcode', async(req, res) => {
    var cities = await City.find();
    var stations = await CityStations.find();
    var train = await Trains.find({"code" : req.params.tcode });
    console.log(train);
    res.render('update_train', {train, cities, stations});
});

router.post("/trains/update/:tcode", async(req, res) => {
    if(!req.body.capacity){res.render('update_train', {message: 'Enter Capacity!'})}
    if(!req.body.cityname){res.render('update_train', {message: 'Give City!'})}
    if(!req.body.start_time){res.render('update_train', {message: 'Give Start Time!'})}
    if(!req.body.end_time){res.render('update_train', {message: 'Give End Time!'})}
    if(!req.body.fromStation){res.render('update_train', {message: 'Give Source!'})}
    if(!req.body.toStation){res.render('update_train', {message: 'Give Destination!'})}
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
        res.render('update_train', {message: "A train already exists in that route in the given time interval."})
    }
    else{

        let totalTrains = await Trains.find({ "fromStation.name": req.body.fromStation, "toStation.name": req.body.toStation });

        var trainNum = totalTrains.length + 1;
        var generatedCode = city.citycode + source.stationcode + destination.stationcode + trainNum.toString();
        

        var result = await Trains.update({"code" : req.params.tcode }, {
            $set: {
                code: generatedCode,
                capacity: req.body.capacity,
                start_time: req.body.start_time,
                end_time: req.body.end_time,
                city: city,
                stops:stops_arr,
                fromStation: source,
                toStation: destination
            }
        });

        res.redirect('/metroadmin/trains');
    }
});

router.get('/trains/delete/:tcode', async(req, res) => {
    var result = await Trains.deleteOne({"code" : req.params.tcode });
    console.log(result);
    res.redirect('/metroadmin/trains');
});

//Stations management



router.get("/stations", async(req, res) => {
    var all_stations = await CityStations.find();
    console.log(all_stations);
    res.render('manage_stations', {all_stations})
});

router.get("/stations/create", async(req, res) => {
    var cities = await City.find();
    var stations = await CityStations.find();
    res.render('create_new_station', {cities, stations});
});

router.post("/stations/create", async(req, res) => {
    if(!req.body.name){res.render('create_new_station',{message:'Enter Station!'})}
    if(!req.body.latitude){res.render('create_new_station',{message:'Give Latitude!'})}
    if(!req.body.longitude){res.render('create_new_station',{message:'Give Longitude!'})}
    if(!req.body.cityname){res.render('create_new_station',{message:'Give City Name!'})}
    if(!req.body.stationcode){res.render('create_new_station',{message:'Give Code for the Station!'})}

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
        res.redirect('/metroadmin/stations')
    }
    else{
        res.render('create_new_station',{message:'A Station with similar name in the city already exists!'});
    }
});

router.get('/stations/update/:scode', async(req, res) => {
    var cities = await City.find();
    var station = await CityStations.find({"stationcode" : req.params.scode });
    // console.log(station[0].city[0].name);
    var statcode = station[0].stationcode;
    var citname = station[0].city[0].name;
    console.log(station[0].stationcode);
    res.render('update_station', {cities, station, statcode, citname});
});

router.post("/stations/update/:scode", async(req, res) => {
    if(!req.body.name){res.render('update_station',{message:'Enter Station!'})}
    if(!req.body.latitude){res.render('update_station',{message:'Give Latitude!'})}
    if(!req.body.longitude){res.render('update_station',{message:'Give Longitude!'})}
    if(!req.body.cityname){res.render('update_station',{message:'Give City Name!'})}
    if(!req.body.stationcode){res.render('update_station',{message:'Give Code for the Station!'})}

    let cityStation = await CityStations.find({ "name": req.body.name, "city.name": req.body.cityname });
    
    if(cityStation.length == 0){

        let city = await City.find({ name: req.body.cityname });

        var result = await CityStations.update({"statiocode" : req.params.scode }, {
            $set: {
                name: req.body.name,
                latitude: req.body.latitude,
                longitude: req.body.longitude,
                city: city,
                stationcode: req.body.stationcode
            }
        });
        res.render('/metroindia/stations')
    }
    else{
        res.render('update_station',{message:'A Station with similar name in the city already exists!'});
    }
});

router.get('/stations/delete/:scode', async(req, res) => {
    var result = await CityStations.deleteOne({"stationcode" : req.params.scode });
    console.log(result);
    res.redirect('/metroadmin/stations');
});


//Bookings management


router.get("/bookings", async(req, res) => {
    var all_bookings = await Bookings.find();
    console.log(all_bookings);
    res.render('manage_bookings', {all_bookings})
});

router.get("/bookings/create", async(req, res) => {
    var cities = await City.find();
    var stations = await CityStations.find();
    res.render('create_new_booking', {cities, stations});
});

router.post("/bookings/create", async(req, res) => {
    if(!req.body.train_id){res.render('create_new_booking', {message:'Enter train_id'})}
    if(!req.body.email){res.render('create_new_booking', {message:'Enter Email'})}
    if(!req.body.from){res.render('create_new_booking', {message:'Enter from'})}
    if(!req.body.to){res.render('create_new_booking', {message:'Enter to'})}
    if(!req.body.ticket_num){res.render('create_new_booking', {message:'Enter ticket_num'})}


    let get_user = await User.findOne({ email: req.body.email });

    const user_id = get_user._id;

    let selected_train = await Trains.findOne({ code: req.body.train_id });

    let city = await City.findOne({ name: selected_train.city.name });
    let source = await CityStations.findOne({ name: req.body.from, "city.name": city.name });
    let destination = await CityStations.findOne({ name: req.body.to, "city.name": city.name });

    var user_bookings = await Bookings.find({ "user_id": user_id });

    if(!selected_train){
        res.render('create_new_booking', {message:"No train with given ID!"})
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
        res.redirect('/metroadmin/bookings');
    }
});

router.get('/bookings/update/:bcode', async(req, res) => {
    var cities = await City.find();
    var stations = await CityStations.find();
    var booking = await Bookings.find({"booking_code" : req.params.bcode });
    console.log(booking);
    var email = await User.find({"_id":booking[0].user_id});
    email = await email[0].email;
    console.log(email);
    res.render('update_booking', {booking, cities, stations, email});
});

router.post('/bookings/update/:bcode', async(req, res) => {
    if(!req.body.train_id){res.render('update_booking', {message:'Enter train_id!'})}
    if(!req.body.email){res.render('update_booking', {message:'Enter Email!'})}
    if(!req.body.city){res.render('update_booking', {message:'Enter Email!'})}
    if(!req.body.from){res.render('update_booking', {message:'Enter from!'})}
    if(!req.body.to){res.render('update_booking', {message:'Enter to!'})}
    if(!req.body.ticket_num){res.render('update_booking', {message:'Enter ticket_num!'})}


    let get_user = await User.findOne({ email: req.body.email });

    let user_id = get_user._id;

    let selected_train = await Trains.findOne({ code: req.body.train_id });

    let city = await City.findOne({ name: selected_train.city.name });
    let source = await CityStations.findOne({ name: req.body.from, "city.name": city.name });
    let destination = await CityStations.findOne({ name: req.body.to, "city.name": city.name });

    var user_bookings = await Bookings.find({ "user_id": user_id });

    if(!selected_train){
        res.render('update_booking', {message:"No train with given ID!"})
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

        var result = await Bookings.update({"booking_code" : req.params.bcode }, {
            $set: {
                booking_code: unique_code,
                user_id: user_id,
                train_id: req.body.train_id,
                ticket_num: req.body.ticket_num,
                cost: cost_to_travel,
                city: city,
                fromStation: source,
                toStation: destination
            }
        });
        res.redirect('/metroadmin/bookings');
    }
});

router.get('/bookings/delete/:bcode', async(req, res) => {
    var result = await Bookings.deleteOne({"booking_code" : req.params.bcode });
    console.log(result);
    res.redirect('/metroadmin/bookings');
});

module.exports = router;
