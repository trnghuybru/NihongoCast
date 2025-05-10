import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useState, useEffect } from "react";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import VideoPage from "./pages/VideoPage";
import AuthPage from "./pages/AuthPage";
import { getVideos } from "./services/youtubeService";
import Flashcard from "./pages/Flashcard";
import DecksPage from "./pages/DecksPage";
import DeckDetailPage from "./pages/DeckDetailPage";
import CreateDeckPage from "./pages/CreateDeckPage";
import StudyPage from "./pages/StudyPage";
import NotFoundPage from "./pages/NotFoundPage";
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
import TestDashboard from "./pages/TestDashboard";
import CreateTestPage from "./pages/CreateTestPage";
import TestDetailPage from "./pages/TestDetailPage";
import TakeTestPage from "./pages/TakeTestPage";
import TestResultPage from "./pages/TestResultPage";

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
          <Route path="/flashcards" element={<Flashcard />} />
          <Route path="/decks" element={<DecksPage />} />
          <Route path="/decks/new" element={<CreateDeckPage />} />
          <Route path="/decks/:deckId" element={<DeckDetailPage />} />
          <Route path="/decks/:deckId/study" element={<StudyPage />} />
          <Route path="*" element={<NotFoundPage />} />
          <Route path="/tests" element={<TestDashboard />} />
          <Route path="/tests/create/:type" element={<CreateTestPage />} />
          <Route path="/tests/:id" element={<TestDetailPage />} />
          <Route path="/tests/:id/take" element={<TakeTestPage />} />
          <Route path="/test-results/:resultId" element={<TestResultPage />} />
        </Routes>
      </Router>
    </VideoProvider>
  );
}

export default App;
