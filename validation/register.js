const Validator = require("validator");
const isEmpty = require("./is-empty");

module.exports = function validateRegisterInput(data) {
  let errors = {};

  data.username = !isEmpty(data.username) ? data.username : "";
  data.firstname = !isEmpty(data.firstname) ? data.firstname : "";
  data.lastname = !isEmpty(data.lastname) ? data.lastname : "";
  data.email = !isEmpty(data.email) ? data.email : "";
  data.password = !isEmpty(data.password) ? data.password : "";
  data.password2 = !isEmpty(data.password2) ? data.password2 : "";
  data.phoneno = !isEmpty(data.phoneno) ? data.phoneno : "";
  data.Address = !isEmpty(data.Address) ? data.Address : "";
  data.pincode = !isEmpty(data.pincode) ? data.pincode : "";
  data.gender = !isEmpty(data.gender) ? data.gender : "";
  data.role = !isEmpty(data.role) ? data.role : "";
  data.profilepic = !isEmpty(data.profilepic) ? data.profilepic : "";

  if (!Validator.isLength(data.username, { min: 4, max: 255 })) {
    errors.username = "Username must be in between 4 and 255 characters";
  }

  if (Validator.isEmpty(data.name)) {
    errors.username = "Username field is required";
  }

  if (Validator.isEmpty(data.email)) {
    errors.email = "Email field is required";
  }

  if (Validator.isEmail(data.email)) {
    errors.email = "Email field is invalid";
  }

  if (Validator.isEmpty(data.password)) {
    errors.password = "Password field is required";
  }

  if (!Validator.isLength(data.password, { min: 5, max: 1024 })) {
    errors.password = "Password must be in between 5 and 1024 characters";
  }

  return {
    errors,
    isValid: isEmpty(errors)
  };
};
