import React, { useEffect, useState } from "react";
import axios from "axios";
import { io } from "socket.io-client";
import StreamGrid from "./components/StreamGrid";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
const socket = io(BACKEND_URL);

export default function App() {
  const [streams, setStreams] = useState([]);
  const [url, setUrl] = useState("");

  const fetchStreams = async () => {
    const res = await axios.get(`${BACKEND_URL}/streams`);
    setStreams(res.data);
  };

  const addStream = async () => {
    if (!url.trim()) return;
    await axios.post(`${BACKEND_URL}/streams`, { url });
    setUrl("");
    fetchStreams();
  };

  const deleteStream = async (id) => {
    await axios.delete(`${BACKEND_URL}/streams/${id}`);
    socket.emit("removeStream", id);
    fetchStreams();
  };

  useEffect(() => {
    fetchStreams();
  }, []);

  return (
    <div className="p-4 max-w-7xl mx-auto">
      <h1 className="text-3xl font-bold mb-4 text-center">
        📹 RTSP Stream Viewer
      </h1>

      <div className="flex gap-2 mb-6 justify-center">
        <input
          type="text"
          className="p-2 rounded w-1/2 text-black"
          placeholder="Enter RTSP URL"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
        />
        <button
          onClick={addStream}
          className="bg-green-600 px-4 py-2 rounded hover:bg-green-700"
        >
          ➕ Add Stream
        </button>
      </div>

      <StreamGrid streams={streams} socket={socket} onDelete={deleteStream} />
    </div>
  );
}
