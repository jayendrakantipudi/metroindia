const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const config = require("config");
const crypto = require('crypto');
const Joi = require("@hapi/joi");

const app = express();
var passport=require('passport');
const userinfo = require("./routes/api/userinfo");
const auth = require("./routes/api/auth");

//Body Parser Middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

//file upload static
app.use(express.static("uploads"));

//DB config

//Connect to MongoDB
mongoose.set("useFindAndModify", false);

if (!config.get("jwtPrivateKey")) {
  console.error("FATAL ERROR: jwtPrivateKey is not defined.");
  process.exit(1);
}

// const MONGO_PORT = "mongodb+srv://jayendra:jayendra@metro-vfxr0.mongodb.net/test?retryWrites=true&w=majority";
const MONGO_PORT = 'mongodb://localhost:27017/metro'




mongoose
  .connect(MONGO_PORT, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  }) // only in development environment
  .then(() => console.log("Connected to MongoDB..."))
  .catch(err => console.error("Could not connect to MongoDB....", err));

// Use Routes
app.use("/api/userinfo", userinfo);
app.use("/api/auth", auth);
app.use(passport.initialize());
app.use(passport.session());
require('./config/passport')(passport);


const port = process.env.PORT || 5000;

app.listen(port, () => console.log(`Server up and running on port ${port}`));
