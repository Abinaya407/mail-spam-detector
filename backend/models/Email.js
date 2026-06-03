const mongoose = require("mongoose");

const EmailSchema = new mongoose.Schema({
  email: String,
  status: String,
  percentage: Number,
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Email", EmailSchema);