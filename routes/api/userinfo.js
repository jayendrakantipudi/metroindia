const auth = require("../../middleware/auth");
const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
var nodemailer = require('nodemailer');
const multer = require("multer");
const Token=require('../../models/Token');
const passport=require('passport');
const config = require("config");
const jwt = require('jsonwebtoken');
//require('../../config/passport.js');
const storage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, "./uploads/");
  },
  filename: function(req, file, cb) {
    cb(null, new Date().toISOString() + file.originalname);
  }
});

const fileFilter = (req, file, cb) => {
  //accept on certain types of files

  if (
    file.mimetype === "image/jpeg" ||
    file.mimetype === "image/jpg" ||
    file.mimetype === "image/png" ||
    file.mimetype === "image/gif"
  ) {
    cb(null, true);
  } else {
    cb(null, false);
  }
};
const upload = multer({
  storage: storage,
  limits: { fileSize: 1024 * 1024 * 100 },
  fileFilter: fileFilter
}).single("profilepic");

//Load User Model
const { User, validate } = require("../../models/User");

// @route   GET api/userinfo/test
// @descrip Tests userinfo route
// @access  Public
// router.get("/test", (req, res) => res.json({ msg: "User Info works" }));

// @route   GET api/userinfo/register
// @descrip Register User
// @access  Public

////  To Upload Images--- Uncomment below code. ///

// router.post("/register", upload, async (req, res) => {
//   console.log(req.file);
//   console.log(req.body);
//
//   const { error } = validate(req.body);
//
//   if (error) {
//     console.log(error.details[0].message);
//     return res.status(400).send(error.details[0].message);
//   }
//   let isUser = await User.findOne({ username: req.body.username });
//   if (isUser) {
//     // errors.username = "Username already exists";
//     return res.status(400).send("Username already exists");
//   }
//
//   isUser = await User.findOne({ email: req.body.email });
//   if (isUser) {
//     return res.status(400).send("An user already registered using above email");
//   }
//
//   let user = new User({
//     username: req.body.username,
//     firstname: req.body.firstname,
//     lastname: req.body.lastname,
//     email: req.body.email,
//     password: req.body.password,
//     phoneno: req.body.phoneno,
//     // gender: req.body.gender,
//   });
//
//   bcrypt.genSalt(10, (err, salt) => {
//     bcrypt.hash(user.password, salt, (err, hash) => {
//       if (err) throw err;
//       user.password = hash;
//       user
//         .save()
//         .then(user => {
//           var token = user.generateAuthToken();
//
//           //token.save(function (err) {
//             //if (err) { return res.status(500).send({ msg: err.message }); }
//           //   var transporter = nodemailer.createTransport({
//           //     host: 'smtp.gmail.com',
//           //     port: 465,
//           //     secure: true, // use SSL
//           //     auth: {
//           //         user: 'bookrest.com@gmail.com',
//           //         pass: 'ead@0139'
//           //     }
//           // });
//           // var mailOptions = { from: 'no-reply@metro.com', to: user.email, subject: 'Account Verification Token', text: 'Hello,\n\n' + 'Please verify your account by clicking the link: \nhttp:\/\/' + req.headers.host + '\/api/userinfo/confirmation\/' + token + '.\n' };
//           // transporter.sendMail(mailOptions, function (err) {
//           //     if (err) { return res.status(500).send({ msg: err.message }); }
//           //
//           //     return res.render('msg',{msg:user.email,msg1:'A verification email has been sent to'});
//           //   });
//           //});
//           res.header("x-auth-token", token).json(user);
//         })
//         .catch(err => console.log(err));
//     });
//   });
//
// });


router.get("/checking", async(req, res) => {
  res.send("It's Working....!!!");
})

router.post("/register", async (req, res) => {
  console.log(req.file);
  console.log(req.body);

  const { error } = validate(req.body);

  if (error) {
    console.log(error.details[0].message);
    return res.send(error.details[0].message);
  }
  let isUser = await User.findOne({ email: req.body.email });
  if (isUser) {
    // errors.username = "Username already exists";
    return res.send("Email already exists");
  }

  isUser = await User.findOne({ email: req.body.email });
  if (isUser) {
    return res.send("An user already registered using above email");
  }

  let user = new User({
    username: req.body.username,
    firstname: req.body.firstname,
    lastname: req.body.lastname,
    email: req.body.email,
    password: req.body.password,
    // phoneno: req.body.phoneno,
    // gender: req.body.gender,
  });

  bcrypt.genSalt(10, (err, salt) => {
    bcrypt.hash(user.password, salt, (err, hash) => {
      if (err) throw err;
      user.password = hash;
      user
        .save()
        .then(user => {
          const token = user.generateAuthToken();
          var transporter = nodemailer.createTransport({
            host: "smtp.gmail.com",
            port: 465,
            secure: true, // use SSL
            auth: {
              user: "metroindia.pvtltd@gmail.com",
              pass: "metro@123"
            }
          });
          var mailOptions = {
            from: "no-reply@metro.com",
            to: user.email,
            subject: "Account Verification Token",
            text:
              "Hello,\n\n" +
              "Please verify your account by clicking the link: \n http://" +
              "localhost:5000" + //Should be changed later
              "/api/userinfo/confirmation/" +
              token +
              ".\n"
          };
          transporter.sendMail(mailOptions, function(err) {
            if (err) {
              return res.status(500).send({ msg: err.message });
            }

            return res.render("msg", {
              msg: user.email,
              msg1: "A verification email has been sent to"
            });
          });
          res.send("Please check your email to complete registration");
        })
        .catch(err => console.log(err));
    });
  });
});

router.get("/confirmation/:token", async (req, res) => {
  const decoded = jwt.verify(req.params.token, config.get("jwtPrivateKey"));
    req.user = decoded;
    console.log(req.user);

  try {
    const decoded = jwt.verify(req.params.token, config.get("jwtPrivateKey"));
    req.user = decoded;
    console.log(req.user);

    const newuser = {};

    newuser.isEmailVerified = true;

    const user = await User.findById(req.user._id);
    if (user) {
      //Update
      //   console.log("I am in right path");
      newone = await User.findOneAndUpdate(
        { _id: user._id },
        { $set: newuser },
        { new: true }
      )
        .then()
        .catch(err => res.send({ errormessage: err }));
    } else {
      res.send("invalid token");
    }
  } catch (e) {
    console.log("errors");
    res.send("Email Verification failed");
  }

  res.send('<html><title>User Verified</title><body><h1 style="text-align:center">User Verified!<br>Now you can login...</h1></body></html>');
});

// @route   GET api/userinfo/current
// @descrip Get Logged in user information
// @access  Private
router.get("/current", auth, async (req, res) => {
  const user = await User.findById(req.user._id).select("-password");
  res.send(user);
});

// @route   UPDATE api/userinfo/current
// @descrip Get Logged in user information
// @access  Private
router.put("/editprofile", upload, auth, async (req, res) => {
  console.log(req.file);
  console.log(req.body);

  const old_user = await User.findById(req.user._id).select("-password");

  const newuser = {};

  if (req.body.firstname) {
    newuser.firstname = req.body.firstname;
  }

  if (req.body.lastname) {
    newuser.lastname = req.body.lastname;
  }

  if (req.body.email) {
    newuser.email = req.body.email;
  }

  if (req.body.phoneno) {
    newuser.phoneno = req.body.phoneno;
  }


  // if (req.file) {
  //   newuser.profilepic = req.file.path;
  // }

  // console.log(newuser);

  const user = await User.findById(req.user._id);
  if (user) {
    //Update
    console.log("I am in right path");
    newone = await User.findOneAndUpdate(
      { _id: req.user._id },
      { $set: newuser },
      { new: true }
    )
      .then()
      .catch(err => res.send({ errormessage: err }));
  } else {
    res.send({ errormessage: "invalid token" });
  }

  console.log(`hi   ${newone}`);

  res.send(newone);
});


router.get('/google',passport.authenticate('google',{
  scope:['profile','email']
}));

router.get('/google/redirect',passport.authenticate('google'),(req,res)=>{
  console.log('im here');
  //return res.redirect('/users/dashboard')
})




// router.get('/confirmation/:token',async(req, res) => {
//   // console.log(req)
//   //   req.assert('email', 'Email is not valid').isEmail();
//   //   req.assert('email', 'Email cannot be blank').notEmpty();
//   //   req.assert('token', 'Token cannot be blank').notEmpty();
//   //   req.sanitize('email').normalizeEmail({ remove_dots: false });
//   //
//   //   // Check for validation errors
//   //   var errors = req.validationErrors();
//   //   if (errors) return res.status(400).send(errors);
// console.log('came')
// var getToken = await Token.findOne({ token: req.params.token });
//   if (getToken){

//     const user = await User.findById(getToken._userId);
//     if (user) {
//       //Update
//       console.log("I am in right path");
//       newone = await User.findOneAndUpdate(
//         { _id: getToken._userId },
//         { $set: {isVerified: true} },
//         { new: true }
//       )
//         .then()
//         .catch(err => res.send({ errormessage: err }));
//     } else {
//       res.send({ errormessage: "invalid token" });
//     }


//     // var user = User.findOne({ _id: getToken._userId });
//     // user.isVerified = true;
//     // user.save();
//     // User.findOneAndUpdate(
//     //   {_id: },
//     //   {
//     //     $set: {
//     //       isVerified: true
//     //     }
//     //   })
//     res.send('<html><title>User Verified</title><body><h1>User Verified!!!!!!</h1></body></html>')
//   }
    // Find a matching token
    // Token.findOne({ token: req.params.token }, function (err, token) {
    //     if (!token) return res.render('msg',{  msg: 'We were unable to find a valid token. Your token my have expired.',msg1:'Not Verified' });
    //
    //     // If we found a token, find a matching user
    //     User.findOne({ _id: token._userId }, function (err, user) {
    //         if (!user) return res.render('msg',{ msg: 'We were unable to find a user for this token.',msg1:'Not Verified' });
    //         if (user.isVerified) return res.render('msg',{  msg: 'This user has already been verified.',msg1:'Not Verified' });
    //
    //         // Verify and save the user
    //         user.isVerified = true;
    //         user.save(function (err) {
    //             if (err) { return res.render('msg',{ msg: err.message,msg1:'Not Verified' }); }
    //           return res.render('msg',{msg:"The account has been verified. Please log in.",msg1:'Verified'});
    //         });
    //     });
    // });
// });

router.post('/resend',function(req,res,next){

  // req.assert('email', 'Email is not valid').isEmail();
  //   req.assert('email', 'Email cannot be blank').notEmpty();
  //   req.sanitize('email').normalizeEmail({ remove_dots: false });
  //
  //   // Check for validation errors
  //   var errors = req.validationErrors();
  //   if (errors) return res.status(400).send(errors);

    User.findOne({ email: req.body.email }, function (err, user) {
        if (!user) return res.status(400).send({ msg: 'We were unable to find a user with that email.' });
        if (user.isVerified) return res.status(400).send({ msg: 'This account has already been verified. Please log in.' });

        // Create a verification token, save it, and send email
        var token = new Token({ _userId: user._id, token: crypto.randomBytes(16).toString('hex') });

        // Save the token
        token.save(function (err) {
            if (err) { return res.status(500).send({ msg: err.message }); }

            // Send the email
            var transporter = nodemailer.createTransport({ service: 'Sendgrid', auth: { user: process.env.SENDGRID_USERNAME, pass: process.env.SENDGRID_PASSWORD } });
            var mailOptions = { from: 'no-reply@codemoto.io', to: user.email, subject: 'Account Verification Token', text: 'Hello,\n\n' + 'Please verify your account by clicking the link: \nhttp:\/\/' + req.headers.host + '\/confirmation\/' + token.token + '.\n' };
            transporter.sendMail(mailOptions, function (err) {
                if (err) { return res.status(500).send({ msg: err.message }); }
                res.status(200).send('A verification email has been sent to ' + user.email + '.');
            });
        });

    });

});




module.exports = router;
