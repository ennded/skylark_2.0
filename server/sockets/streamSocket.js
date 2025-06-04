const { startStreaming } = require("../services/ffmpegStreamer");
const activeStreams = new Map();

function streamSocket(io) {
  io.on("connection", (socket) => {
    console.log("Client connected:", socket.id);

    socket.on("joinStream", ({ id, url }) => {
      socket.join(id);
      if (!activeStreams.has(id)) {
        const ffmpegProcess = startStreaming(url, io, id);
        activeStreams.set(id, ffmpegProcess);
      }
    });

    socket.on("pauseStream", (id) => {
      if (activeStreams.has(id)) {
        activeStreams.get(id).kill("SIGSTOP");
      }
    });

    socket.on("resumeStream", (id) => {
      if (activeStreams.has(id)) {
        activeStreams.get(id).kill("SIGCONT");
      }
    });

    socket.on("leaveStream", (id) => {
      socket.leave(id);
    });

    socket.on("removeStream", (id) => {
      if (activeStreams.has(id)) {
        activeStreams.get(id).kill();
        activeStreams.delete(id);
      }
    });

    socket.on("disconnect", () => {
      console.log(`Client disconnected: ${socket.id}`);
    });
  });
}

module.exports = streamSocket;
