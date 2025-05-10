import { useEffect, useState } from "react";
import { Route, BrowserRouter as Router, Routes, useLocation } from "react-router-dom";
import Navbar from "./components/Navbar";
import PodcastMiniPlayer from "./components/PodcastMiniPlayer";
import { VideoProvider } from "./contexts/VideoContext";
import AuthPage from "./pages/AuthPage";
import CreateDeckPage from "./pages/CreateDeckPage";
import DeckDetailPage from "./pages/DeckDetailPage";
import DecksPage from "./pages/DecksPage";
import Flashcard from "./pages/Flashcard";
import Home from "./pages/Home";
import Kaiwa from "./pages/Kaiwa";
import CreateRoom from "./pages/CreateRoom";
import NotFoundPage from "./pages/NotFoundPage";
import StudyPage from "./pages/StudyPage";
import VideoPage from "./pages/VideoPage";
import { getVideos } from "./services/youtubeService";

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
        <Navbar onSearch={setQuery} />
        <Routes>
          <Route path="/" element={<Home videos={videos} />} />
          <Route path="/video/:videoId" element={<VideoPage />} />
          <Route path="/auth" element={<AuthPage />} />
          <Route path="/create-room" element={<CreateRoom />} />
          <Route path="/meeting/:id" element={<Kaiwa />} />
          <Route path="/flashcards" element={<Flashcard />} />
          <Route path="/decks" element={<DecksPage />} />
          <Route path="/decks/new" element={<CreateDeckPage />} />
          <Route path="/decks/:deckId" element={<DeckDetailPage />} />
          <Route path="/decks/:deckId/study" element={<StudyPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </Router>
    </VideoProvider>
  );
}

export default App;
