import React, { useEffect, useRef, useState } from "react";

export default function StreamCard({ stream, socket, onDelete }) {
  const [frame, setFrame] = useState("");
  const [playing, setPlaying] = useState(true);
  const imgRef = useRef();

  useEffect(() => {
    socket.emit("joinStream", { id: stream._id, url: stream.url });

    socket.on("frame", (data) => {
      setFrame(data);
    });

    return () => {
      socket.emit("leaveStream", stream._id);
    };
  }, [socket, stream._id]);

  const togglePlay = () => {
    if (playing) {
      socket.emit("pauseStream", stream._id);
    } else {
      socket.emit("resumeStream", stream._id);
    }
    setPlaying(!playing);
  };

  return (
    <div className="bg-gray-800 p-4 rounded-xl shadow-md">
      <img
        ref={imgRef}
        src={`data:image/jpeg;base64,${frame}`}
        alt="Live stream"
        className="w-full h-60 object-cover rounded"
      />
      <p className="text-sm mt-2 truncate">{stream.url}</p>

      <div className="flex gap-2 mt-2">
        <button
          onClick={togglePlay}
          className="bg-yellow-500 px-3 py-1 rounded hover:bg-yellow-600"
        >
          {playing ? "⏸ Pause" : "▶️ Resume"}
        </button>

        <button
          onClick={() => onDelete(stream._id)}
          className="bg-red-600 px-3 py-1 rounded hover:bg-red-700"
        >
          ❌ Remove
        </button>
      </div>
    </div>
  );
}
