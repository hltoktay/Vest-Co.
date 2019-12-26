const express = require("express");
const path = require("path");
const exphbs = require("express-handlebars");
const bodyParser = require("body-parser");
const methodOverride = require("method-override");

const mongoose = require("mongoose");

const app = express();

// Connect to mongoose
mongoose
  .connect("mongodb://localhost/Vest-Co", {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then(() => {
    console.log("Mongo Db Connected...");
  })
  .catch(err => console.log(err));

// Load Event Model
require("./models/Events");
const Event = mongoose.model("events");

// Handlebars Middleware
app.engine("handlebars", exphbs());
app.set("view engine", "handlebars");

// Body Parser middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Method override middleware
app.use(methodOverride("_method"));

// Static Folder
app.use(express.static(path.join(__dirname, "public")));

// Index Route
app.get("/", (req, res) => {
  const title = "Vest Co.";
  res.render("index", {
    title: title
  });
});

// About Route
app.get("/about", (req, res) => {
  res.render("about");
});

// Events Index Page
app.get("/events/my_events", (req, res) => {
  Event.find({})
    .sort({ date: "desc" })
    .then(events => {
      res.render("events/my_events", {
        events: events
      });
    });
});

// Add Events Form
app.get("/events/add", (req, res) => {
  res.render("events/add");
});

// Edit Events Form
app.get("/events/edit/:id", (req, res) => {
  Event.findOne({
    _id: req.params.id
  }).then(event => {
    res.render("events/edit", {
      event: event
    });
  });
});

// Process Form
app.post("/events", (req, res) => {
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
    res.render("events/add", {
      errors: errors,
      title: req.body.title,
      details: req.body.details,
      location: req.body.location,
      phone: req.body.phone,
      time: req.body.time
    });
    console.log(req.body.title);
  } else {
    const newUser = {
      title: req.body.title,
      details: req.body.details,
      location: req.body.location,
      city: req.body.city,
      phone: req.body.phone,
      time: req.body.time
    };
    new Event(newUser).save().then(event => {
      res.redirect("/events/my_events");
    });
  }
});

// Pricing Route
app.get("/pricing", (req, res) => {
  res.render("pricing");
});

// ALL Event Route
app.get("/all_events", (req, res) => {
  Event.find({})
    .sort({ date: "desc" })
    .then(events => {
      res.render("all_events", {
        events: events
      });
    });
});

// Blog Route
app.get("/blog", (req, res) => {
  res.render("blog");
});

const port = 5000;

// Edit Form Process
app.put("/events/:id", (req, res) => {
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
      res.redirect("/events/my_events");
    });
  });
});

// Delete Event
app.delete("/events/:id", (req, res) => {
  Event.remove({ _id: req.params.id }).then(() => {
    res.redirect("/events/my_events");
  });
});

app.listen(port, () => {
  console.log(`Server running on ${port}`);
});
