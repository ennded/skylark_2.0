import express from "express";
import {
  createStream,
  getStreams,
  deleteStream,
} from "../controllers/streamController.js";

const router = express.Router();

router.post("/", createStream);
router.get("/", getStreams);
router.delete("/:id", deleteStream);

export default router;
