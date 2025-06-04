// ✅ Let's start with the backend first

// 🔹 Filename: /server/server.js
// 🧾 Purpose: Main backend server entry point

const express = require("express");
const http = require("http");
const mongoose = require("mongoose");
const cors = require("cors");
const { Server } = require("socket.io");
const dotenv = require("dotenv");
const streamRoutes = require("./routes/streams");
const streamSocket = require("./sockets/streamSocket");

dotenv.config();

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: process.env.FRONTEND_ORIGIN,
    methods: ["GET", "POST", "DELETE"],
  },
});

// Middleware
app.use(cors({ origin: process.env.FRONTEND_ORIGIN }));
app.use(express.json());

// Routes
app.use("/streams", streamRoutes);

// DB Connect
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("Mongo error", err));

// Socket setup
streamSocket(io);

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
