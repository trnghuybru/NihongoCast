import React, { useEffect, useRef } from "react";

function YouTubePlayer({ videoId, onTimeUpdate, onSeek }) {
  const playerRef = useRef(null);
  const intervalRef = useRef(null);

  useEffect(() => {
    const onPlayerReady = (event) => {
      playerRef.current = event.target;
      intervalRef.current = setInterval(() => {
        const time = playerRef.current.getCurrentTime();
        onTimeUpdate(time);
      }, 1000);
    };

    const createPlayer = () => {
      if (!playerRef.current) {
        playerRef.current = new window.YT.Player("player", {
          videoId,
          height: "400",
          width: "100%",
          events: {
            onReady: onPlayerReady,
          },
        });
      } else {
        playerRef.current.loadVideoById(videoId);
      }
    };

    if (window.YT && window.YT.Player) {
      createPlayer();
    } else {
      const tag = document.createElement("script");
      tag.src = "https://www.youtube.com/iframe_api";
      const firstScriptTag = document.getElementsByTagName("script")[0];
      firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
      window.onYouTubeIframeAPIReady = createPlayer;
    }

    return () => {
      clearInterval(intervalRef.current);
      if (playerRef.current) {
        playerRef.current.destroy();
        playerRef.current = null;
      }
    };
  }, [videoId, onTimeUpdate]);

  // 🌟 Thêm phương thức tua video
  const handleSeek = (time) => {
    if (playerRef.current) {
      playerRef.current.seekTo(time, true);
    }
  };

  useEffect(() => {
    if (onSeek) {
      onSeek(handleSeek);
    }
  }, [onSeek]);

  return <div id="player" className="rounded-xl overflow-hidden"></div>;
}

export default YouTubePlayer;
