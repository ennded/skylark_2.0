import React from "react";
import StreamCard from "./StreamCard";

export default function StreamGrid({ streams, socket, onDelete }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {streams.map((stream) => (
        <StreamCard
          key={stream._id}
          stream={stream}
          socket={socket}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
}
