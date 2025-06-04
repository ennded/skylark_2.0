import { spawn } from "child_process";
import Stream from "../models/Stream.js";

const activeStreams = new Map();

const startFFmpegProcess = (streamId, rtspUrl, socket) => {
  const ffmpeg = spawn(
    "ffmpeg",
    [
      "-rtsp_transport",
      "tcp",
      "-i",
      rtspUrl,
      "-f",
      "mjpeg",
      "-q:v",
      "2",
      "-update",
      "1",
      "-",
    ],
    { stdio: ["ignore", "pipe", "ignore"] }
  );

  ffmpeg.stdout.on("data", (data) => {
    const frame = data.toString("base64");
    socket.to(streamId).emit("frame", frame);
  });

  ffmpeg.on("error", (error) => {
    console.error(`FFmpeg error for ${streamId}:`, error);
    socket.to(streamId).emit("stream-error", error.message);
    Stream.findByIdAndUpdate(streamId, { status: "error" }).exec();
  });

  ffmpeg.on("close", (code) => {
    console.log(`FFmpeg process closed for ${streamId} with code ${code}`);
    activeStreams.delete(streamId);
  });

  activeStreams.set(streamId, ffmpeg);
};

export const getOrCreateStream = (streamId, rtspUrl, socket) => {
  if (!activeStreams.has(streamId)) {
    startFFmpegProcess(streamId, rtspUrl, socket);
  }
  return activeStreams.get(streamId);
};

export const pauseStream = (streamId) => {
  const ffmpeg = activeStreams.get(streamId);
  if (ffmpeg) {
    ffmpeg.kill("SIGSTOP");
    Stream.findByIdAndUpdate(streamId, { status: "paused" }).exec();
  }
};

export const resumeStream = (streamId, rtspUrl, socket) => {
  const ffmpeg = activeStreams.get(streamId);
  if (ffmpeg) {
    ffmpeg.kill("SIGCONT");
  } else {
    startFFmpegProcess(streamId, rtspUrl, socket);
  }
  Stream.findByIdAndUpdate(streamId, { status: "active" }).exec();
};

export const stopStream = (streamId) => {
  const ffmpeg = activeStreams.get(streamId);
  if (ffmpeg) {
    ffmpeg.kill("SIGINT");
    activeStreams.delete(streamId);
  }
};

export const isStreamActive = (streamId) => {
  return activeStreams.has(streamId);
};
