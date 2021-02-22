var express = require('express');
var router = express.Router();
const User = require("../Modal/userSchema");
const Message = require("../Modal/messagesSchema")
var JWT = require("jsonwebtoken");
var { isLoggedIn } = require("./utility/verifyToken");

var bcryptjs = require("bcryptjs");
var { validationResult } = require("express-validator")
var nodemailer = require("nodemailer")

/* GET users listing. */
router.get('/', function (req, res, next) {
  res.render("SignInPage");
});

/* GET users SignUp Page */
router.get('/signUp', function (req, res, next) {
  res.render("SignUpPage");
});

/* GET users ForgetPassword */
router.get("/forgetPassword", function (req, res, next) {
  res.render("ForgetPassword");
});

/* GET users AddInformationPage if loggedIn */
router.get("/AddInformationPage", isLoggedIn, function (req, res, next) {
  res.render("AddInformationPage");
});

/* POST FOR user REGISTER */
router.post('/register', function (req, res, next) {

  var err = validationResult(req);
  if (!err.isEmpty()) return res.status(406).json(err.errors);

  const { username, email, password } = req.body;
  const newUser = new User({ username, password, email });
  User.findOne({ username, email }).
    then(user => {

      if (user) return res.send({ message: "user Already Extits. Choose Another Name" });

      bcryptjs.genSalt(10, (err, salt) => {
        bcryptjs.hash(newUser.password, salt, (err, hash) => {
          if (err) throw err;
          newUser.password = hash;
          newUser.save().
            then(user => res.status(201).render("AddInformationPage", { user })).
            catch(err => res.send({ message: "Internal Server Error !" }));
        })
      })
    })
    .catch(err => res.send({ message: "Internal Server Error !!" }));


});



/* Post users LOGIN */
router.post("/login", function (req, res, next) {

  var err = validationResult(req);
  if (!err.isEmpty()) return res.status(406).json(err.errors);

  const { username, password } = req.body;
  User.findOne({ username }).
    then(user => {
      if (!user) return res.send({ message: "user not found. Please Try Again" });
      bcryptjs.compare(password, user.password).
        then(isMatch => {
          if (!isMatch) return res.send({ message: "Password Incoorect" })

          const token = JWT.sign({ user }, "JWT Token For My Project", { expiresIn: "60min" });
          req.header("auth-token", token)
          res.status(200).render("AddInformationPage", { user, token });
        })

    })
    .catch(err => res.send({ message: "internal Server Problam !" }));
});


/* posts users ForgetPassword */
router.post("/forgetPassword", function (req, res, next) {
  let password = String(Math.floor(Math.random() * (999999999 - 100000) + 100000));
  User.findOne({ email: req.body.email }).
    then(user => {
      if (!user) return res.send(user);

      const Transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: "pratikb@setblue.com",
          pass: "PratikB@123"
        }
      });

      const mailOptions = {
        from: '"SetBlue Inc." < Sheryish.kill.Inc@gmail.com>',
        to: req.body.email.trim(),
        subject: "Auto Generated Password ",
        text: `Your Password is "${password}".`
      }

      Transporter.sendMail(mailOptions, (error, info) => {
        if (error) res.send("internal sever problem");

        bcryptjs.genSalt(10, (err, salt) => {
          bcryptjs.hash(password, salt, (err, hash) => {
            if (err) throw err;
            user.password = hash;
            user.save();
            res.send("your new Password send to your Email check")
          })

        })

      })

    })
});








module.exports = router;
