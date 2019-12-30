const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Create  Message Sender Schema
const MessageSchema = new Schema({
  senderName: {
    type: String,
    required: true
  },
  senderEmail: {
    type: String,
    required: true
  },
  message: {
    type: String,
    required: true
  },
  date: {
    type: Date,
    default: Date.now
  }
});

mongoose.model("messages", MessageSchema);
