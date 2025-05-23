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
import MeetingResults from './pages/MeetingResults';
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
        {!(location.pathname.startsWith("/room/")) && <Navbar onSearch={setQuery} />}
        <Routes>
          <Route path="/" element={<Home videos={videos} />} />
          <Route path="/video/:videoId" element={<VideoPage />} />
          <Route path="/auth" element={<AuthPage />} />
          <Route path="/room" element={<CreateRoom />} />
          <Route path="/room/:roomId" element={<Kaiwa />} />
          <Route path="/meeting-results" element={<MeetingResults />} />
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
