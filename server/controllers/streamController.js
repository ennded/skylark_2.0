import Stream from "../models/Stream.js";

export const createStream = async (req, res) => {
  try {
    const { url } = req.body;
    const stream = new Stream({ url });
    await stream.save();
    res.status(201).json(stream);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const getStreams = async (req, res) => {
  try {
    const streams = await Stream.find();
    res.json(streams);
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
};

export const deleteStream = async (req, res) => {
  try {
    const stream = await Stream.findByIdAndDelete(req.params.id);
    if (!stream) {
      return res.status(404).json({ error: "Stream not found" });
    }
    res.json({ message: "Stream deleted" });
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
};
