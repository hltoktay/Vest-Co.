const express = require("express");
const router = express.Router();

const mongoose = require("mongoose");

const { ensureAuthenticated } = require("../config/auth");

// Load Event Model
require("../models/Events");
const Event = mongoose.model("events");

// Events Index Page
router.get("/my_events", ensureAuthenticated, (req, res) => {
  Event.find({ user: req.user.id })
    .sort({ date: "desc" })
    .then(events => {
      res.render("events/my_events", {
        events: events
      });
    });
});

// FIND EVENTS
router.get("/find_events", (req, res) => {
  var noMatch = null;
  if (req.query.search) {
    const regex = new RegExp(escapeRegex(req.query.search), "gi");
    // Get all events from db
    Event.find({ title: regex }, (err, events) => {
      if (err) {
        console.log(err);
      } else {
        if (events.length < 1) {
          noMatch = "No match found, pls try again";
        }
        // req.flash("error_msg", "There is no event found...");
        res.render("all_events", { events: events, noMatch: noMatch });
      }
    });
  } else {
    // Get all events from DB
    Event.find({}, (err, events) => {
      if (err) {
        console.log(err);
      } else {
        // req.flash("error_msg", "There is no event found...");
        res.render("all_events", { events: events, noMatch: noMatch });
      }
    });
  }
});

// Add Events Form
router.get("/add", ensureAuthenticated, (req, res) => {
  res.render("events/add");
});

// Edit Events Form
router.get("/edit/:id", ensureAuthenticated, (req, res) => {
  Event.findOne({
    _id: req.params.id
  }).then(event => {
    if (event.user != req.user.id) {
      req.flash("error_msg", "Not Autorized");
      res.redirect("events/my_events");
    } else {
      res.render("events/edit", {
        event: event
      });
    }
  });
});

// Process Form
router.post("/", ensureAuthenticated, (req, res) => {
  console.log(req.body);
  let errors = [];

  if (!req.body.title) {
    errors.push({ text: "Please add title" });
  }
  if (!req.body.details) {
    errors.push({ text: "Please add some details" });
  }
  if (!req.body.location) {
    errors.push({ text: "Please add a location" });
  }
  if (!req.body.phone) {
    errors.push({ text: "Please add a contact number" });
  }

  if (errors.length > 0) {
    res.render("/add", {
      errors: errors,
      title: req.body.title,
      details: req.body.details,
      location: req.body.location,
      phone: req.body.phone,
      time: req.body.time
    });
  } else {
    const newUser = {
      title: req.body.title,
      details: req.body.details,
      location: req.body.location,
      city: req.body.city,
      phone: req.body.phone,
      time: req.body.time,
      user: req.user.id
    };
    new Event(newUser).save().then(event => {
      req.flash("success_msg", "Event Addded");
      res.redirect("/events/my_events");
    });
  }
});

// Edit Form Process
router.put("/:id", ensureAuthenticated, (req, res) => {
  Event.findOne({
    _id: req.params.id
  }).then(event => {
    // new values
    event.title = req.body.title;
    event.details = req.body.details;
    event.location = req.body.location;
    event.city = req.body.city;
    event.phone = req.body.phone;
    event.time = req.body.time;

    event.save().then(event => {
      req.flash("success_msg", "Event Updated");
      res.redirect("/events/my_events");
    });
  });
});

// Delete Event
router.delete("/:id", ensureAuthenticated, (req, res) => {
  Event.remove({ _id: req.params.id }).then(() => {
    req.flash("success_msg", "Event Removed");
    res.redirect("/events/my_events");
  });
});

function escapeRegex(text) {
  return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
}

module.exports = router;
