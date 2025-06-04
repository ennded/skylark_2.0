const Stream = require("../models/Stream");

const addStream = async (req, res) => {
  const { url } = req.body;
  if (!url) return res.status(400).json({ error: "URL is required" });

  try {
    const stream = await Stream.create({
      url,
      createdAt: new Date(),
      status: "active",
    });
    res.status(201).json(stream);
  } catch (err) {
    res.status(500).json({ error: "Failed to create stream" });
  }
};

const getStreams = async (req, res) => {
  try {
    const streams = await Stream.find();
    res.json(streams);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch streams" });
  }
};

const deleteStream = async (req, res) => {
  const { id } = req.params;
  try {
    await Stream.findByIdAndDelete(id);
    res.json({ message: "Stream deleted" });
  } catch (err) {
    res.status(500).json({ error: "Failed to delete stream" });
  }
};

module.exports = { addStream, getStreams, deleteStream };
