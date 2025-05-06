import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useState, useEffect } from "react";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import VideoPage from "./pages/VideoPage";
import AuthPage from "./pages/AuthPage";
import { getVideos } from "./services/youtubeService";
import Flashcard from "./pages/Flashcard";
import DecksPage from './pages/DecksPage';
import DeckDetailPage from './pages/DeckDetailPage';
import CreateDeckPage from './pages/CreateDeckPage';
import StudyPage from './pages/StudyPage';
import NotFoundPage from './pages/NotFoundPage';

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
        <Route path="/flashcards" element={<Flashcard/>} />
        <Route path="/decks" element={ <DecksPage/>} />
        <Route path="/decks/new" element={<CreateDeckPage />} />
        <Route path="/decks/:deckId" element={<DeckDetailPage />} />
        <Route path="/decks/:deckId/study" element={<StudyPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </Router>
  );
}

export default App;
