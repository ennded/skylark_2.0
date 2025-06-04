import { useState, useEffect } from "react";
import StreamGrid from "./components/StreamGrid.jsx";

function App() {
  const [streams, setStreams] = useState([]);
  const [urlInput, setUrlInput] = useState("");

  useEffect(() => {
    fetchStreams();
  }, []);

  const fetchStreams = async () => {
    try {
      const response = await fetch("http://localhost:5000/streams");
      const data = await response.json();
      setStreams(data);
    } catch (error) {
      console.error("Error fetching streams:", error);
    }
  };

  const addStream = async (e) => {
    e.preventDefault();
    if (!urlInput.trim()) return;

    try {
      const response = await fetch("http://localhost:5000/streams", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: urlInput }),
      });

      const newStream = await response.json();
      setStreams([...streams, newStream]);
      setUrlInput("");
    } catch (error) {
      console.error("Error adding stream:", error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <header className="bg-white shadow-sm py-4">
        <div className="container mx-auto px-4">
          <h1 className="text-2xl font-bold text-gray-800">
            RTSP Stream Viewer
          </h1>
        </div>
      </header>

      <main className="flex-grow container mx-auto px-4 py-6">
        <form
          onSubmit={addStream}
          className="mb-8 bg-white p-6 rounded-lg shadow max-w-4xl mx-auto"
        >
          <div className="space-y-4">
            <div>
              <label
                htmlFor="rtsp-url"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Enter RTSP URL
              </label>
              <div className="flex gap-3">
                <input
                  id="rtsp-url"
                  type="text"
                  value={urlInput}
                  onChange={(e) => setUrlInput(e.target.value)}
                  placeholder="e.g., rtsp://username:password@ip:port/stream"
                  className="flex-grow px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
                <button
                  type="submit"
                  className="px-6 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Add Stream
                </button>
              </div>
            </div>

            <div className="bg-blue-50 p-3 rounded-lg">
              <p className="text-sm text-blue-700">
                <span className="font-medium">Example:</span>{" "}
                rtsp://admin:admin123@49.248.155.178:555/cam/realmonitor?channel=1&subtype=0
              </p>
            </div>
          </div>
        </form>

        <StreamGrid streams={streams} setStreams={setStreams} />
      </main>

      <footer className="bg-white py-4 mt-8 border-t">
        <div className="container mx-auto px-4 text-center text-gray-500">
          RTSP Stream Viewer © {new Date().getFullYear()}
        </div>
      </footer>
    </div>
  );
}

export default App;
