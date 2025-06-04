const express = require("express");
const router = express.Router();
const {
  addStream,
  getStreams,
  deleteStream,
} = require("../controllers/streamController");

router.post("/", addStream);
router.get("/", getStreams);
router.delete("/:id", deleteStream);

module.exports = router;
