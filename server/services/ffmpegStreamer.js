const { spawn } = require("child_process");
const { PassThrough } = require("stream");
const { encode } = require("base64-arraybuffer");

function startStreaming(url, socket, roomId) {
  const ffmpeg = spawn("ffmpeg", [
    "-rtsp_transport",
    "tcp",
    "-i",
    url,
    "-f",
    "image2pipe",
    "-qscale",
    "5",
    "-vf",
    "fps=10",
    "-update",
    "1",
    "-vcodec",
    "mjpeg",
    "-",
  ]);

  const stream = new PassThrough();
  ffmpeg.stdout.pipe(stream);

  let frame = [];
  stream.on("data", (chunk) => {
    frame.push(chunk);
  });

  stream.on("end", () => {
    const buffer = Buffer.concat(frame);
    const base64Frame = buffer.toString("base64");
    socket.to(roomId).emit("frame", base64Frame);
    frame = [];
  });

  ffmpeg.stderr.on("data", (data) => {
    console.error(`FFmpeg stderr: ${data}`);
  });

  ffmpeg.on("exit", () => {
    console.log(`FFmpeg exited for ${url}`);
  });

  return ffmpeg;
}

module.exports = { startStreaming };
