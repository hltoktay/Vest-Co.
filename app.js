const express = require("express");
const path = require("path");
const exphbs = require("express-handlebars");
const bodyParser = require("body-parser");
const methodOverride = require("method-override");
const flash = require("connect-flash");
const session = require("express-session");
const passport = require("passport");

const mongoose = require("mongoose");

const app = express();

// Load Routes
const events = require("./routes/events");
const users = require("./routes/users");

// Passport Config
require("./config/passport")(passport);

// DB CONFIG
const db = require("./config/database");

// Load Event Model
require("./models/Events");
const Event = mongoose.model("events");

// Load Message Model
require("./models/Message");
const Message = mongoose.model("messages");

// Connect to mongoose
mongoose
  .connect(db.mongoURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then(() => {
    console.log("Mongo Db Connected...");
  })
  .catch(err => console.log(err));

// Handlebars Middleware
app.engine("handlebars", exphbs());
app.set("view engine", "handlebars");

// Body Parser middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Static Folder
app.use(express.static(path.join(__dirname, "public")));

// Method override middleware
app.use(methodOverride("_method"));

// Express session middleware
app.use(
  session({
    secret: "secret",
    resave: true,
    saveUninitialized: true
  })
);

// Passport middlware
app.use(passport.initialize());
app.use(passport.session());

app.use(flash());

// Global variables
app.use(function(req, res, next) {
  res.locals.success_msg = req.flash("success_msg");
  res.locals.error_msg = req.flash("error_msg");
  res.locals.error = req.flash("error");
  res.locals.user = req.user || null;
  next();
});

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

// Pricing Route
app.get("/pricing", (req, res) => {
  res.render("pricing");
});

// Blog Route
app.get("/blog", (req, res) => {
  res.render("blog");
});

// Contact Route
app.get("/contact", (req, res) => {
  res.render("contact");
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

// Profile route
app.get("/profile", (req, res) => {
  res.render("users/profile");
});

// Message sender
app.post("/", (req, res) => {
  console.log(req.body.message);
  let errors = [];

  if (!req.body.senderName) {
    errors.push({ text: "Please add a name" });
  }

  if (!req.body.senderEmail) {
    errors.push({ text: "Please add a email" });
  }

  if (errors.length > 0) {
    res.render("index", {
      errors: errors,
      senderName: req.body.senderName,
      senderEmail: req.body.senderEmail
    });
  } else {
    const newMessage = {
      senderName: req.body.senderName,
      senderEmail: req.body.senderEmail,
      message: req.body.message
    };
    new Message(newMessage)
      .save()
      .then(message => {
        req.flash("success_msg", "Your Message Had Been Sended");
        res.redirect("/");
      })
      .catch(err => {
        throw err;
      });
  }
});

// Use routes
app.use("/events", events);
app.use("/users", users);

const port = process.env.PORT || 5000;

app.listen(port, () => {
  console.log(`Server running on ${port}`);
});
