import { useState, useEffect } from "react";
import StreamCard from "./StreamCard.jsx";
import { io } from "socket.io-client";

const StreamGrid = ({ streams, setStreams }) => {
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    const newSocket = io("http://localhost:5000");
    setSocket(newSocket);

    return () => {
      if (newSocket) newSocket.disconnect();
    };
  }, []);

  const removeStream = async (id) => {
    try {
      await fetch(`http://localhost:5000/streams/${id}`, {
        method: "DELETE",
      });
      setStreams(streams.filter((stream) => stream._id !== id));
    } catch (error) {
      console.error("Error deleting stream:", error);
    }
  };

  if (streams.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow p-8 text-center max-w-2xl mx-auto">
        <div className="bg-gray-200 border-2 border-dashed rounded-xl w-16 h-16 mx-auto mb-4" />
        <h3 className="text-xl font-medium text-gray-700 mb-2">
          No streams added
        </h3>
        <p className="text-gray-500">
          Add an RTSP stream using the form above to get started
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 px-4 py-6">
      {streams.map((stream) => (
        <StreamCard
          key={stream._id}
          stream={stream}
          socket={socket}
          onRemove={removeStream}
        />
      ))}
    </div>
  );
};

export default StreamGrid;
