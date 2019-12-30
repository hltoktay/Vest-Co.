if (process.env.NODE_ENV === "production") {
  module.exports = {
    mongoURI:
      "mongodb+srv://hltoktay:vefa1234@cluster0-cex8o.mongodb.net/test?retryWrites=true&w=majority"
  };
} else {
  module.exports = { mongoURI: "mongodb://localhost/Vest-Co" };
}
