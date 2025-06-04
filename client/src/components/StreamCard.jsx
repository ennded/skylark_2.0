import { useState, useEffect, useRef } from "react";

const StreamCard = ({ stream, socket, onRemove }) => {
  const [frame, setFrame] = useState("");
  const [isPlaying, setIsPlaying] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const imgRef = useRef(null);

  useEffect(() => {
    if (!socket) return;

    const handleFrame = (data) => {
      setFrame(data);
      setIsLoading(false);
      setError("");
    };

    const handleError = (err) => {
      setError(err);
      setIsLoading(false);
    };

    socket.on("frame", handleFrame);
    socket.on("stream-error", handleError);

    // Join stream room
    socket.emit("join", stream._id);

    return () => {
      socket.off("frame", handleFrame);
      socket.off("stream-error", handleError);
      socket.emit("leave", stream._id);
    };
  }, [socket, stream._id]);

  const togglePlay = () => {
    if (isPlaying) {
      socket.emit("pause", stream._id);
    } else {
      socket.emit("resume", stream._id);
    }
    setIsPlaying(!isPlaying);
  };

  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-200">
      <div className="relative aspect-video bg-gray-900">
        {isLoading && !error && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-gray-800 p-4">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            <p className="mt-3 text-gray-300 text-sm">
              Connecting to stream...
            </p>
          </div>
        )}

        {error && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-red-50 p-4">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-12 w-12 text-red-500"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
            <p className="mt-2 text-red-600 font-medium text-center max-w-xs">
              {error}
            </p>
          </div>
        )}

        {frame && (
          <img
            ref={imgRef}
            src={`data:image/jpeg;base64,${frame}`}
            alt={`Stream ${stream._id}`}
            className={`w-full h-full object-contain ${
              !isPlaying ? "opacity-50" : ""
            }`}
          />
        )}

        <div className="absolute top-3 left-3">
          <span
            className={`px-2 py-1 text-xs rounded-full ${
              stream.status === "active"
                ? "bg-green-100 text-green-800"
                : stream.status === "paused"
                ? "bg-yellow-100 text-yellow-800"
                : "bg-red-100 text-red-800"
            }`}
          >
            {stream.status}
          </span>
        </div>
      </div>

      <div className="p-4">
        <div className="mb-3">
          <h3 className="text-sm font-medium text-gray-500 mb-1">Stream ID</h3>
          <p className="font-mono text-sm text-gray-700 truncate">
            {stream._id}
          </p>
        </div>

        <div className="mb-4">
          <h3 className="text-sm font-medium text-gray-500 mb-1">RTSP URL</h3>
          <p className="text-sm text-gray-700 truncate" title={stream.url}>
            {stream.url}
          </p>
        </div>

        <div className="flex justify-between">
          <button
            onClick={togglePlay}
            className={`px-4 py-2 rounded-lg flex items-center ${
              isPlaying
                ? "bg-yellow-500 hover:bg-yellow-600"
                : "bg-green-500 hover:bg-green-600"
            } text-white transition-colors`}
          >
            {isPlaying ? (
              <>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4 mr-1"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zM7 8a1 1 0 012 0v4a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v4a1 1 0 102 0V8a1 1 0 00-1-1z"
                    clipRule="evenodd"
                  />
                </svg>
                Pause
              </>
            ) : (
              <>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4 mr-1"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z"
                    clipRule="evenodd"
                  />
                </svg>
                Play
              </>
            )}
          </button>

          <button
            onClick={() => onRemove(stream._id)}
            className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors flex items-center"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4 mr-1"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                clipRule="evenodd"
              />
            </svg>
            Remove
          </button>
        </div>
      </div>
    </div>
  );
};

export default StreamCard;
