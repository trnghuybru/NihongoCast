import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useState, useEffect } from "react";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import VideoPage from "./pages/VideoPage";
import AuthPage from "./pages/AuthPage";
import { getVideos } from "./services/youtubeService";
import PodcastMiniPlayer from "./components/PodcastMiniPlayer";
import { VideoProvider } from "./contexts/VideoContext";
import { useLocation } from "react-router-dom";

// Component con để dùng useLocation sau khi Router đã render
function AppContent({ videos, onSearch }) {
  const location = useLocation();
  const isVideoPage = location.pathname.startsWith("/video/");

  return (
    <>
      <Navbar onSearch={onSearch} />
      <Routes>
        <Route path="/" element={<Home videos={videos} />} />
        <Route path="/video/:videoId" element={<VideoPage />} />
        <Route path="/auth" element={<AuthPage />} />
        {/* Route toi */}
      </Routes>
      {!isVideoPage && <PodcastMiniPlayer />}
    </>
  );
}

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
    <VideoProvider>
      <Router>
        <AppContent videos={videos} onSearch={setQuery} />
      </Router>
    </VideoProvider>
  );
}

export default App;
