import {
  getOrCreateStream,
  pauseStream,
  resumeStream,
  stopStream,
  isStreamActive,
} from "../services/ffmpegStreamer.js";
import Stream from "../models/Stream.js";

export const initializeSocket = (io) => {
  io.on("connection", (socket) => {
    console.log(`Client connected: ${socket.id}`);

    socket.on("join", async (streamId) => {
      socket.join(streamId);
      console.log(`Client ${socket.id} joined stream ${streamId}`);

      try {
        const stream = await Stream.findById(streamId);
        if (stream) {
          getOrCreateStream(streamId, stream.url, io);
        }
      } catch (error) {
        console.error("Error joining stream:", error);
      }
    });

    socket.on("pause", (streamId) => {
      pauseStream(streamId);
    });

    socket.on("resume", (streamId) => {
      const stream = Stream.findById(streamId);
      if (stream) {
        resumeStream(streamId, stream.url, io);
      }
    });

    socket.on("disconnect", () => {
      console.log(`Client disconnected: ${socket.id}`);
    });

    socket.on("leave", (streamId) => {
      socket.leave(streamId);
      const room = io.sockets.adapter.rooms.get(streamId);
      if (!room || room.size === 0) {
        stopStream(streamId);
      }
    });
  });
};
