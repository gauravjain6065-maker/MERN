const mongoose = require("mongoose");

const MessageSchema = new mongoose.Schema({
  property: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Property",
    required: true,
  },
  senderName: {
    type: String,
    required: true,
    trim: true,
  },
  senderEmail: {
    type: String,
    required: true,
    trim: true,
  },
  senderPhone: {
    type: String,
    trim: true,
  },
  message: {
    type: String,
    required: true,
  },
  receiver: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Message", MessageSchema);
