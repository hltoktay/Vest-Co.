const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");

const passport = require("passport");
const mongoose = require("mongoose");
const Strategy = require("passport-local").Strategy;
const sesssion = require("express-session");
const flash = require("connect-flash");

// Profile route
router.get("/users/profile", (req, res) => {
  res.render("users/profile");
});

module.exports = router;
