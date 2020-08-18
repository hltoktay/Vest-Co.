const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const passport = require("passport");

const mongoose = require("mongoose");

// Load User Model
require("../models/User");
const User = mongoose.model("users");

// User LOGIN ROUTE
router.get("/login", (req, res) => {
  res.render("users/login");
});

// User REGISTER ROUTE
router.get("/register", (req, res) => {
  res.render("users/register");
});

// Login Form POST
router.post("/login", (req, res, next) => {
  passport.authenticate("local", {
    successRedirect: "/events/my_events",
    failureRedirect: "/users/login",
    failureFlash: true
  })(req, res, next);
});

// Register Form POST
router.post("/register", (req, res) => {
  let errors = [];

  // if (req.body.email != req.body.password2) {
  //   errors.push({ text: "Password do not match" });
  // }

  if (req.body.name.length < 4) {
    errors.push({ text: "At least 4 letter" });
  }

  if (req.body.password.length < 4) {
    errors.push({ text: "Min 4 characters" });
  }

  if (errors.length > 0) {
    res.render("users/register", {
      errors: errors,
      name: req.body.name,
      email: req.body.email,
      password: req.body.password
    });
  } else {
    User.findOne({ email: req.body.email }).then(user => {
      if (user) {
        req.flash("error_msg", "Email already registered");
        res.redirect("/users/register");
      } else {
        const newUser = new User({
          name: req.body.name,
          email: req.body.email,
          password: req.body.password
        });

        bcrypt.genSalt(10, (err, salt) => {
          bcrypt.hash(newUser.password, salt, (err, hash) => {
            if (err) throw err;
            newUser.password = hash;
            newUser
              .save()
              .then(user => {
                req.flash(
                  "success_msg",
                  "You are now registered and can log in"
                );
                res.redirect("/users/login");
              })
              .catch(err => {
                console.log(err);
                return;
              });
          });
        });
      }
    });
  }
});

// Logout User
router.get("/logout", (req, res) => {
  req.logout();
  req.flash("success_msg", "You are logged out");
  res.redirect("/users/login");
});

module.exports = router;
