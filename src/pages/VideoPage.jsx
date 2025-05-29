// src/pages/VideoPage.jsx
import React, { useEffect, useState, useRef, useCallback } from "react";
import { useParams } from "react-router-dom";
import { getVideoDetails } from "../services/youtubeService";
import YouTubePlayer from "../components/YoutubePlayer";
import VideoDetails from "../components/VideoDetails";
import Subtitles from "../components/Subtitles";
import { useVideo } from "../contexts/VideoContext";

// Helper: parse ISO8601 "PT#M#S" → seconds
function parseISODuration(iso) {
  const m = iso.match(/PT(\d+)M/);
  const s = iso.match(/(\d+)S/);
  return (m ? +m[1] * 60 : 0) + (s ? +s[1] : 0);
}

export default function VideoPage() {
  const { videoId } = useParams();
  const { playVideo, updateProgress } = useVideo();
  const [video, setVideo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentTime, setCurrentTime] = useState(0);
  const seekRef = useRef(null);

  useEffect(() => {
    let alive = true;
    async function fetchData() {
      try {
        const data = await getVideoDetails(videoId);
        if (!alive) return;
        setVideo(data);

        // Guard missing contentDetails.duration
        const iso = data.contentDetails?.duration;
        const durationSec = iso ? parseISODuration(iso) : 0;

        // map to minimal shape
        playVideo({
          id: videoId,
          title: data.snippet.title,
          channelTitle: data.snippet.channelTitle,
          thumbnail: data.snippet.thumbnails.medium.url,
          duration: durationSec,
        });
      } catch (e) {
        console.error("Lỗi khi fetch video:", e);
      } finally {
        if (alive) setLoading(false);
      }
    }
    fetchData();
    return () => {
      alive = false;
      // no cleanup — keep mini‑player state
    };
  }, [videoId, playVideo]);

  // Sử dụng useCallback để tạo stable function reference
  const onTimeUpdate = useCallback(
    (current, total) => {
      setCurrentTime(current);
      updateProgress(current, total);
    },
    [updateProgress]
  );

  // onSeek cũng nên stable
  const onSeek = useCallback((fn) => {
    seekRef.current = fn;
  }, []);

  // Handle subtitle click cũng nên stable
  const handleSubtitleClick = useCallback((time) => {
    if (seekRef.current) {
      seekRef.current(time);
    }
  }, []);

  if (loading) return <div>Đang tải video...</div>;
  if (!video) return <div>Không tìm thấy video!</div>;

  return (
    <div className="container mx-auto p-4 pt-24">
      <h2 className="text-xl font-semibold mb-4">{video.snippet.title}</h2>
      <div className="grid grid-cols-2 gap-6">
        <div className="flex flex-col gap-4">
          <YouTubePlayer
            videoId={videoId}
            onTimeUpdate={onTimeUpdate}
            onSeek={onSeek}
          />
          <VideoDetails video={video} />
        </div>
        <Subtitles
          videoId={videoId}
          currentTime={currentTime}
          onSubtitleClick={handleSubtitleClick}
        />
      </div>
    </div>
  );
}
