const mongoose = require("mongoose");

const streamSchema = new mongoose.Schema({
  url: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  status: { type: String, enum: ["active", "paused"], default: "active" },
});

module.exports = mongoose.model("Stream", streamSchema);
