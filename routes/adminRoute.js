var express = require('express');
var router = express.Router();
const Admin = require("../Modal/adminSchema");
const Message = require("../Modal/messagesSchema")
var JWT = require("jsonwebtoken");
var { isLoggedIn } = require("./utility/verifyToken");

var bcryptjs = require("bcryptjs");
var { validationResult } = require("express-validator")

    /* GET admin listing. */
    router.get('/admin', function (req, res, next) {
        res.render("adminSignIn");
    });

    /* GET admin SignUp Page */
    router.get('/adminSignUp', function (req, res, next) {
        res.render("adminSignUp");
    });

    /* GET admin ForgetPassword */
    router.get("/AdminForgetPassword", function (req, res, next) {
        res.render("adminForgetPassword");
    });

    /* GET admin ForgetPassword */
    router.get("/AdminSuccessPage", function (req, res, next) {
        res.render("AdminSuccessPage");
    });

    /* POST FOR Admin REGISTER */
    router.post('/AdminRegister', function (req, res, next) {

        var err = validationResult(req);
        if (!err.isEmpty()) return res.status(406).json(err.errors);
    
        const { adminname, email, password } = req.body;
        const newAdmin = new Admin({ adminname, password, email });
        Admin.findOne({ adminname }).
        then( admin => {
    
            if (admin) return res.send({ message: "Admin Already Extits. Choose Another Name" });
    
            bcryptjs.genSalt(10, (err, salt) => {
            bcryptjs.hash(newAdmin.password, salt, (err, hash) => {
                if (err) throw err;
                newAdmin.password = hash;
                newAdmin.save().
                then( admin => res.status(201).render("AdminSuccessPage", { admin })).
                catch(err => res.send({ message: "Internal Server Error !" }));
            })
            })
        })
        .catch(err => res.send({ message: "Internal Server Error !!" }));
    
    
    });
    
    
    
    /* Post admin LOGIN */
    router.post("/AdminLogin", function (req, res, next) {
    
        var err = validationResult(req);
        if (!err.isEmpty()) return res.status(406).json(err.errors);
    
        const { adminname, password } = req.body;
        Admin.findOne({ adminname }).
        then( admin => {
            if (!admin) return res.send({ message: "admin not found. Please Try Again" });
            bcryptjs.compare(password, admin.password).
            then(isMatch => {
                if (!isMatch) return res.send({ message: "Password Incoorect" })
    
                const token = JWT.sign({ user }, "JWT Token For My Project", { expiresIn: "60min" });
                req.header("auth-token", token)
                res.status(200).render("AdminSuccessPage", { admin, token });
            })
    
        })
        .catch(err => res.send({ message: "internal Server Problam !" }));
    });

/* posts users ForgetPassword */
router.post("/adminForgetPassword", function (req, res, next) {
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
