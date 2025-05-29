import { useEffect, useState } from "react";
import {
  Route,
  BrowserRouter as Router,
  Routes,
  useLocation,
} from "react-router-dom";
import Navbar from "./components/Navbar";
import PodcastMiniPlayer from "./components/PodcastMiniPlayer";
import { VideoProvider } from "./contexts/VideoContext";
import AuthPage from "./pages/AuthPage";
import CreateDeckPage from "./pages/CreateDeckPage";
import DeckDetailPage from "./pages/DeckDetailPage";
import DecksPage from "./pages/DecksPage";
import Flashcard from "./pages/Flashcard";
import Home from "./pages/Home";
import MeetingResults from "./pages/MeetingResults";
import Kaiwa from "./pages/Kaiwa";
import CreateRoom from "./pages/CreateRoom";
import NotFoundPage from "./pages/NotFoundPage";
import StudyPage from "./pages/StudyPage";
import VideoPage from "./pages/VideoPage";
import TestDashboard from "./pages/TestDashboard";
import CreateTestPage from "./pages/CreateTestPage";
import TestDetailPage from "./pages/TestDetailPage";
import TakeTestPage from "./pages/TakeTestPage";
import TestResultPage from "./pages/TestResultPage";
import { getVideos } from "./services/youtubeService";

// Component con để dùng useLocation sau khi Router đã render
function AppContent() {
  const location = useLocation();
  const [query, setQuery] = useState("japanese short podcast");
  const [videos, setVideos] = useState([]);

  const isVideoPage = location.pathname.startsWith("/video/");
  const isRoomPage = location.pathname.startsWith("/room/");

  useEffect(() => {
    async function fetchVideos() {
      const data = await getVideos(query);
      setVideos(data);
    }
    fetchVideos();
  }, [query]);

  return (
    <>
      {!isRoomPage && <Navbar onSearch={setQuery} />}
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
        <Route path="/tests" element={<TestDashboard />} />
        <Route path="/tests/create/:type" element={<CreateTestPage />} />
        <Route path="/tests/:id" element={<TestDetailPage />} />
        <Route path="/tests/:id/take" element={<TakeTestPage />} />
        <Route path="/test-results/:resultId" element={<TestResultPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
      {!isVideoPage && <PodcastMiniPlayer />}
    </>
  );
}

function App() {
  return (
    <VideoProvider>
      <Router>
        <AppContent />
      </Router>
    </VideoProvider>
  );
}

export default App;
