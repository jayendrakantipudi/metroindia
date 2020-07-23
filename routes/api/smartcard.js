const { SmartCard } = require("../../models/SmartCard");

const mongoose = require('mongoose');
// var SmartCard = mongoose.model('SmartCard');
var City = mongoose.model('City');
const { User } = require("../../models/User");
const express = require("express");
const router = express.Router();


router.get("/all", async(req, res) => {
    var all_cards = await SmartCard.find();
    res.send(all_cards);
});

router.post("/getCards", async(req, res) => {
    console.log('Coming from android!!')

    let cards = await SmartCard.find({ user_email: req.body.email });

    res.send(cards);

    
});

router.post("/buyCard", async(req, res) => {

    let city = await City.findOne({ name: req.body.cityname });
    
    const validTill = req.body.validMonth;
    let cards = await SmartCard.find({ user_email: req.body.email });

    var credits = 0;

    if(validTill == 1){
        credits = 1000;
    }
    else if(validTill == 3){
        credits = 3200;
    }
    else if(validTill == 6){
        credits = 6500;
    }

    let new_card = new SmartCard({
        card_code:cards.length,
        user_email: req.body.email,
        credit: credits,
        valid_month: validTill,
        city: city        
    });

    new_card.save();
    res.send(new_card)
});

router.post("/useCard", async(req, res) => {

    let card = await SmartCard.findOne({ card_code:req.body.card_num, user_email: req.body.email });

    var creditsUse = req.body.creditsUse;

    var bookID = req.body.bookid;

    var creditsLeft = card.credit;

    var temp = creditsLeft - creditsUse;

    if(temp < 0){
        res.send({"msg":"Fail","bookID":bookID});
    }

    var newone = await SmartCard.findOneAndUpdate(
        { card_code:req.body.card_num, user_email: req.body.email },
        { $set: {credit:temp} },
        { new: true }
      )
    
    var toSend = {
        "msg": "Success",
        "bookID":bookID
    };

    newone.save()

    res.send(newone)
});


module.exports = router;


