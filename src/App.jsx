import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useState, useEffect } from "react";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import VideoPage from "./pages/VideoPage";
import AuthPage from "./pages/AuthPage";
import { getVideos } from "./services/youtubeService";

function App() {
  const [query, setQuery] = useState("japanese short podcast");
  const [videos, setVideos] = useState([]);

  useEffect(() => {
    async function fetchVideos() {
      const data = await getVideos(query);
      setVideos(data);
    }
    fetchVideos();
  }, [query]);

  return (
    <Router>
      <Navbar onSearch={setQuery} />
      <Routes>
        <Route path="/" element={<Home videos={videos} />} />
        <Route path="/video/:videoId" element={<VideoPage />} />
        <Route path="/auth" element={<AuthPage />} />
      </Routes>
    </Router>
  );
}

export default App;
