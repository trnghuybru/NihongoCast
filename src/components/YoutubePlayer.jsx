import React, { useEffect, useRef, useState } from "react";
import { useVideo } from "../contexts/VideoContext";

function YouTubePlayer({ videoId, onSeek, onTimeUpdate }) {
  const playerRef = useRef(null);
  const intervalRef = useRef(null);
  const lastTimeRef = useRef(0);
  const onTimeUpdateRef = useRef(onTimeUpdate); // Sử dụng ref để tránh dependency

  // Cập nhật ref khi onTimeUpdate thay đổi
  useEffect(() => {
    onTimeUpdateRef.current = onTimeUpdate;
  }, [onTimeUpdate]);

  // Sử dụng context
  const { isPlaying, setIsPlaying, updateProgress } = useVideo();
  const [playerError, setPlayerError] = useState(null);

  useEffect(() => {
    // Hủy interval cũ nếu có
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }

    // Hủy player cũ nếu có
    if (playerRef.current && typeof playerRef.current.destroy === "function") {
      try {
        playerRef.current.destroy();
      } catch (e) {
        console.error("Error destroying player:", e);
      }
      playerRef.current = null;
    }

    const onPlayerReady = (event) => {
      playerRef.current = event.target;
      const duration = event.target.getDuration();
      if (typeof duration === "number" && !isNaN(duration)) {
        updateProgress(0, duration);
      }

      intervalRef.current = setInterval(() => {
        try {
          if (
            playerRef.current &&
            typeof playerRef.current.getCurrentTime === "function"
          ) {
            const time = playerRef.current.getCurrentTime();
            const duration = playerRef.current.getDuration();

            if (
              typeof time === "number" &&
              !isNaN(time) &&
              Math.abs(time - lastTimeRef.current) >= 0.5
            ) {
              lastTimeRef.current = time;
              updateProgress(time, duration); // Cập nhật cho mini player

              // Gọi onTimeUpdate để cập nhật currentTime trong VideoPage
              if (onTimeUpdateRef.current) {
                onTimeUpdateRef.current(time);
              }
            }
          }
        } catch (e) {
          console.error("Error getting current time:", e);
          clearInterval(intervalRef.current);
        }
      }, 1000);
    };

    const onPlayerError = (event) => {
      console.error("YouTube Player Error:", event.data);
      setPlayerError(`Lỗi phát video: ${event.data}`);
    };

    const onPlayerStateChange = (event) => {
      switch (event.data) {
        case 1: // Video đang phát
          setIsPlaying(true);
          break;
        case 2: // Video tạm dừng
        case 0: // Video kết thúc
          setIsPlaying(false);
          break;
        default:
          break;
      }
    };

    // Tạo một div container mới để tránh xung đột
    const createPlayerContainer = () => {
      let playerContainer = document.getElementById("youtube-player-container");
      if (!playerContainer) {
        playerContainer = document.createElement("div");
        playerContainer.id = "youtube-player-container";
        const parentElement = document.getElementById("player");
        if (parentElement) {
          while (parentElement.firstChild) {
            parentElement.removeChild(parentElement.firstChild);
          }
          parentElement.appendChild(playerContainer);
        } else {
          console.error("Parent element 'player' not found");
          return false;
        }
      }
      return true;
    };

    const createPlayer = () => {
      if (!createPlayerContainer()) {
        return;
      }

      try {
        playerRef.current = new window.YT.Player("youtube-player-container", {
          videoId,
          playerVars: {
            autoplay: 1,
            controls: 1,
            rel: 0,
            modestbranding: 1,
            origin: window.location.origin,
            enablejsapi: 1,
          },
          events: {
            onReady: onPlayerReady,
            onError: onPlayerError,
            onStateChange: onPlayerStateChange,
          },
        });
      } catch (e) {
        console.error("Error creating YouTube player:", e);
        setPlayerError("Không thể khởi tạo trình phát YouTube");
      }
    };

    const loadYouTubeAPI = () => {
      if (window.YT && window.YT.Player) {
        createPlayer();
        return;
      }

      if (
        document.querySelector(
          'script[src="https://www.youtube.com/iframe_api"]'
        )
      ) {
        window.onYouTubeIframeAPIReady = createPlayer;
        return;
      }

      const tag = document.createElement("script");
      tag.src = "https://www.youtube.com/iframe_api";
      tag.onerror = () => {
        setPlayerError("Không thể tải YouTube API");
      };

      window.onYouTubeIframeAPIReady = createPlayer;

      const firstScriptTag = document.getElementsByTagName("script")[0];
      firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
    };

    setPlayerError(null);
    loadYouTubeAPI();

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }

      if (window.onYouTubeIframeAPIReady === createPlayer) {
        window.onYouTubeIframeAPIReady = null;
      }

      if (
        playerRef.current &&
        typeof playerRef.current.destroy === "function"
      ) {
        try {
          playerRef.current.destroy();
        } catch (e) {
          console.error("Error destroying player on unmount:", e);
        }
        playerRef.current = null;
      }
    };
  }, [videoId, setIsPlaying, updateProgress]); // Không thêm onTimeUpdate vào dependency

  const handleSeek = (time) => {
    if (playerRef.current && typeof playerRef.current.seekTo === "function") {
      try {
        playerRef.current.seekTo(time, true);
        lastTimeRef.current = time;

        // Cập nhật currentTime ngay lập tức khi seek
        if (onTimeUpdateRef.current) {
          onTimeUpdateRef.current(time);
        }
      } catch (e) {
        console.error("Error seeking video:", e);
      }
    }
  };

  useEffect(() => {
    if (onSeek) {
      onSeek(handleSeek);
    }
  }, [onSeek]);

  return (
    <div className="relative w-full">
      <div id="player" className="rounded-xl overflow-hidden"></div>
      {playerError && (
        <div className="absolute inset-0 bg-black bg-opacity-70 flex items-center justify-center text-white p-4 rounded-xl text-center">
          <div>
            <p className="mb-2">{playerError}</p>
            <p className="text-sm">
              Vui lòng thử tải lại trang hoặc kiểm tra kết nối mạng.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

export default YouTubePlayer;
