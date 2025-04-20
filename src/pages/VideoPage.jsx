import React, { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import { getVideoDetails } from "../services/youtubeService";
import YouTubePlayer from "../components/YoutubePlayer";
import VideoDetails from "../components/VideoDetails";
import Subtitles from "../components/Subtitles";

function VideoPage() {
  const { videoId } = useParams();
  const [video, setVideo] = useState(null);
  const [loadingVideo, setLoadingVideo] = useState(true);
  const [currentTime, setCurrentTime] = useState(0);
  const seekRef = useRef(null); // 🌟 Ref để lưu hàm seekTo từ YouTubePlayer

  useEffect(() => {
    async function fetchVideo() {
      try {
        const data = await getVideoDetails(videoId);
        setVideo(data);
      } catch (error) {
        console.error("Lỗi khi fetch video:", error);
      } finally {
        setLoadingVideo(false);
      }
    }
    fetchVideo();
  }, [videoId]);

  if (loadingVideo) {
    return <div>Đang tải video...</div>;
  }

  if (!video) {
    return <div>Không tìm thấy video nào!</div>;
  }

  return (
    <div className="container mx-auto p-4 pt-24">
      <h2 className="text-xl font-semibold mb-4">{video.snippet.title}</h2>
      <div className="grid grid-cols-2 gap-6">
        <div className="flex flex-col gap-4">
          <YouTubePlayer
            videoId={videoId}
            onTimeUpdate={setCurrentTime}
            onSeek={(seekFn) => (seekRef.current = seekFn)} // 🌟 Lưu hàm seekTo
          />
          <VideoDetails video={video} />
        </div>
        <Subtitles
          videoId={videoId}
          currentTime={currentTime}
          onSubtitleClick={(time) => seekRef.current && seekRef.current(time)} // 🌟 Click phụ đề để tua video
        />
      </div>
    </div>
  );
}

export default VideoPage;
