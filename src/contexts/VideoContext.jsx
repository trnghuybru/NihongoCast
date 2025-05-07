// src/contexts/VideoContext.jsx
import { createContext, useState, useContext, useCallback } from "react";

const VideoContext = createContext(null);

export function VideoProvider({ children }) {
  const [currentVideo, setCurrentVideo] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState({ current: 0, total: 0 });

  // videoData must include id, title, channelTitle, thumbnail, duration
  const playVideo = useCallback((videoData) => {
    setCurrentVideo(videoData);
    setIsPlaying(true);
    setProgress({ current: 0, total: videoData.duration || 0 });
  }, []);

  const togglePlayPause = useCallback(() => {
    setIsPlaying((prev) => !prev);
  }, []);

  const updateProgress = useCallback((current, total) => {
    setProgress((prev) => {
      if (prev.current === current && prev.total === total) return prev;
      return { current, total: total ?? prev.total };
    });
  }, []);

  return (
    <VideoContext.Provider
      value={{
        currentVideo,
        isPlaying,
        progress,
        playVideo,
        togglePlayPause,
        updateProgress,
        setIsPlaying, // <--- expose setter so YouTubePlayer can update play state
      }}
    >
      {children}
    </VideoContext.Provider>
  );
}

export function useVideo() {
  const ctx = useContext(VideoContext);
  if (!ctx) throw new Error("useVideo must be used within VideoProvider");
  return ctx;
}
