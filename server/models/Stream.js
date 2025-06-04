import mongoose from "mongoose";

const streamSchema = new mongoose.Schema({
  url: {
    type: String,
    required: true,
    unique: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  status: {
    type: String,
    enum: ["active", "paused", "error"],
    default: "active",
  },
});

const Stream = mongoose.model("Stream", streamSchema);

export default Stream;
