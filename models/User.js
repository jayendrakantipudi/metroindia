const config = require("config");
const jwt = require("jsonwebtoken");
const Joi = require("@hapi/joi");
const mongoose = require("mongoose");
mongoose.set("useCreateIndex", true);


const UserSchema = mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    minlength: 4,
    maxlength: 255
  },
  firstname: {
    type: String,
    required: true,
    minlength: 4,
    maxlength: 255
  },
  lastname: {
    type: String,
    required: true,
    minlength: 4,
    maxlength: 255
  },
  email: {
    type: String,
    unique: true,
    required: true,
    minlength: 4,
    maxlength: 255
  },
  password: {
    type: String,
    required: true,
    minlength: 8,
    maxlength: 1024
  },
  // phoneno: {
  //   type: String,
  //   required: true,
  //   minlength: 10,
  //   maxlength: 10
  // },
  // gender: {
  //   type: String,
  //   required: true,
  //   enum: ["male", "female"]
  // },
  // profilepic: {
  //   type: String,
  //   required: true,
  //   default: "no picture"
  // },
  // googleid:{
  //   type:String,
  // },
  // resetPasswordToken: {type:String},
  // resetPasswordExpires: {type:Date},
  isEmailVerified:{
    type:Boolean,
    default:false
  }

});
UserSchema.methods.generateAuthToken = function() {
  const token = jwt.sign({ _id: this._id }, config.get("jwtPrivateKey"), {
    expiresIn: 604800
  });
  return token;
};
const User = new mongoose.model("User", UserSchema);

function ValidateUser(User) {
  const schema = Joi.object({
    username: Joi.string()
      .min(4)
      .max(255)
      .required(),
    firstname: Joi.string()
      .min(4)
      .max(255)
      .required(),
    lastname: Joi.string()
      .min(4)
      .max(255)
      .required(),
    email: Joi.string()
      .min(4)
      .max(255)
      .required()
      .email(),
    password: Joi.string()
      .min(8)
      .max(255)
      .required(),
    // phoneno: Joi.string()
    //   .min(10)
    //   .max(10)
    //   .required(),
    // gender: Joi.string().required(),
    // profilepic: Joi.string(),
    // profilepicparse: Joi.any()
  });

  return schema.validate(User);
  // console.log(result);
}

module.exports.User = User;
module.exports.validate = ValidateUser;
