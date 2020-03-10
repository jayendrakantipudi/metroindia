const auth = require("../../middleware/auth");
const Joi = require("@hapi/joi");
const bcrypt = require("bcryptjs");
const _ = require("lodash");
const { User } = require("../../models/User");
const express = require("express");
const router = express.Router();

// @route   GET api/auth/test
// @descrip Tests auth route
// @access  Public
router.get("/test", (req, res) => res.json({ msg: "Auth works" }));

// @route   GET api/userinfo/login
// @descrip Login User / Returning JWT Token
// @access  Public
router.post("/login", async (req, res) => {
  const { error } = validate(req.body);

  if (error) {
    return res.send(error.details[0].message);
  }

  let user = await User.findOne({ email: req.body.email });
  if (!user) {
    return res.send("Invalid Email ");
  }

  if (!user.isEmailVerified){
    return res.send("Please verify the email first!");
  }

  const validPassword = await bcrypt.compare(req.body.password, user.password);

  if (!validPassword) {
    return res.send("Password Incorrect");
  }

  const token = user.generateAuthToken();

  const gotUser = await User.findOne({ email: req.body.email }).select(
    "-password"
  );

  console.log(gotUser._id);

  // res.send({
  //   getuser: gotUser,
  //   token: token
  // });
  res.send('Login Successful');
});

module.exports = router;

function validate(req) {
  const schema = Joi.object({
    email: Joi.string()
      .min(4)
      .max(255)
      .required(),
    password: Joi.string()
      .min(8)
      .max(255)
      .required()
  });

  return schema.validate(req);
}
