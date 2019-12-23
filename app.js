const express = require("express");
const exphbs = require("express-handlebars");

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

// How middleware works
app.use((req, res, next) => {
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

// ALL Event Route
app.get("/events", (req, res) => {
  res.render("events");
});

// Blog Route
app.get("/blog", (req, res) => {
  res.render("blog");
});

const port = 5000;

app.listen(port, () => {
  console.log(`Server running on ${port}`);
});
