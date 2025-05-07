import React, { useMemo, useRef, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Volume2,
  FileText,
} from "lucide-react";
import { useVideo } from "../contexts/VideoContext";

function PodcastMiniPlayer() {
  const {
    currentVideo,
    isPlaying,
    progress,
    togglePlayPause,
    updateProgress,
    setIsPlaying,
  } = useVideo();
  const navigate = useNavigate();
  const miniPlayerRef = useRef(null);

  // Player reference
  const playerRef = useRef(null);
  const [playerReady, setPlayerReady] = useState(false);
  // Unique ID to avoid conflicts with main player
  const playerContainerId = "mini-audio-player-container";

  // Track if we're on the video page or not
  const [isOnVideoPage, setIsOnVideoPage] = useState(false);

  // Check if we're on a video page to avoid duplicate players
  useEffect(() => {
    const checkIfOnVideoPage = () => {
      const isVideoPage = window.location.pathname.includes("/video/");
      setIsOnVideoPage(isVideoPage);

      // If we become active (navigating away from video page), initialize our player
      if (
        !isVideoPage &&
        currentVideo &&
        !playerRef.current &&
        window.YT &&
        window.YT.Player
      ) {
        initializeAudioPlayer();
      }

      // If we navigate to video page, destroy our player to avoid conflicts
      if (isVideoPage && playerRef.current) {
        try {
          playerRef.current.destroy();
          playerRef.current = null;
          setPlayerReady(false);
        } catch (e) {
          console.error("Error destroying player:", e);
        }
      }
    };

    // Check immediately
    checkIfOnVideoPage();

    // Listen for route changes
    const handleRouteChange = () => {
      checkIfOnVideoPage();
    };

    window.addEventListener("popstate", handleRouteChange);

    return () => {
      window.removeEventListener("popstate", handleRouteChange);
    };
  }, [currentVideo]);

  // Create container for mini player
  useEffect(() => {
    // Create a container for the hidden YouTube player if it doesn't exist
    let container = document.getElementById(playerContainerId);
    if (!container) {
      container = document.createElement("div");
      container.id = playerContainerId;
      container.style.width = "1px";
      container.style.height = "1px";
      container.style.position = "absolute";
      container.style.visibility = "hidden";
      container.style.pointerEvents = "none";
      document.body.appendChild(container);
    }

    return () => {
      // Clean up
      if (playerRef.current) {
        try {
          playerRef.current.destroy();
        } catch (e) {
          console.error("Error destroying player:", e);
        }
        playerRef.current = null;
        setPlayerReady(false);
      }

      // Remove progress tracking interval
      if (miniPlayerRef.current) {
        clearInterval(miniPlayerRef.current);
      }
    };
  }, []);

  // Load YouTube API if needed
  useEffect(() => {
    // Only load API if not already loaded and not on video page
    if (!window.YT && !isOnVideoPage) {
      // Avoid overriding existing callbacks
      const originalCallback = window.onYouTubeIframeAPIReady;

      window.onYouTubeIframeAPIReady = () => {
        // Call original callback if it exists
        if (typeof originalCallback === "function") {
          originalCallback();
        }

        // Then initialize our player
        if (currentVideo && !isOnVideoPage) {
          initializeAudioPlayer();
        }
      };

      const tag = document.createElement("script");
      tag.src = "https://www.youtube.com/iframe_api";
      const firstScriptTag = document.getElementsByTagName("script")[0];
      firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
    } else if (
      window.YT &&
      window.YT.Player &&
      currentVideo &&
      !isOnVideoPage &&
      !playerRef.current
    ) {
      // API already loaded, initialize player directly
      initializeAudioPlayer();
    }
  }, [isOnVideoPage, currentVideo]);

  // Respond to isPlaying changes
  useEffect(() => {
    if (isOnVideoPage) {
      // Don't control playback when on video page - let the main player handle it
      return;
    }

    if (playerRef.current && playerReady) {
      try {
        if (isPlaying) {
          playerRef.current.playVideo();
        } else {
          playerRef.current.pauseVideo();
        }
      } catch (e) {
        console.error("Error controlling playback:", e);
      }
    }
  }, [isPlaying, isOnVideoPage]);

  const initializeAudioPlayer = () => {
    if (!currentVideo || !window.YT || !window.YT.Player || isOnVideoPage)
      return;

    try {
      // Clean up any existing player
      if (playerRef.current) {
        try {
          playerRef.current.destroy();
        } catch (e) {
          console.error("Error destroying existing player:", e);
        }
        playerRef.current = null;
        setPlayerReady(false);
      }

      // Make sure container exists
      const container = document.getElementById(playerContainerId);
      if (!container) return;

      // Clear the container
      container.innerHTML = "";

      // Create a new div element inside the container for the player
      const playerElement = document.createElement("div");
      playerElement.id = "youtube-mini-audio-player";
      container.appendChild(playerElement);

      // Create YouTube player configured for audio only
      playerRef.current = new window.YT.Player("youtube-mini-audio-player", {
        videoId: currentVideo.id,
        height: 1,
        width: 1,
        playerVars: {
          autoplay: isPlaying ? 1 : 0,
          controls: 0,
          disablekb: 1,
          enablejsapi: 1,
          fs: 0,
          rel: 0,
          playsinline: 1,
          modestbranding: 1,
        },
        events: {
          onReady: (event) => {
            console.log("Mini audio player ready");
            setPlayerReady(true);

            if (isPlaying) {
              event.target.playVideo();
            } else {
              event.target.pauseVideo();
            }

            // Set the current time if needed
            if (progress.current > 0) {
              event.target.seekTo(progress.current);
            }

            // Start tracking progress if we're not on the video page
            if (!isOnVideoPage) {
              startProgressTracking();
            }
          },
          onStateChange: (event) => {
            // Only update state if we're not on the video page
            if (!isOnVideoPage) {
              // Update playing state based on YouTube player state
              if (event.data === window.YT.PlayerState.PLAYING) {
                setIsPlaying(true);
              } else if (event.data === window.YT.PlayerState.PAUSED) {
                setIsPlaying(false);
              } else if (event.data === window.YT.PlayerState.ENDED) {
                setIsPlaying(false);
              }
            }
          },
          onError: (event) => {
            console.error("YouTube mini player error:", event.data);
            setPlayerReady(false);
          },
        },
      });
    } catch (e) {
      console.error("Error initializing mini player:", e);
      setPlayerReady(false);
    }
  };

  // Separate function to start tracking progress
  const startProgressTracking = () => {
    // Clear any existing interval
    if (miniPlayerRef.current) {
      clearInterval(miniPlayerRef.current);
    }

    const progressInterval = setInterval(() => {
      // Only update progress if we're not on the video page
      if (
        !isOnVideoPage &&
        playerRef.current &&
        playerReady &&
        typeof playerRef.current.getCurrentTime === "function"
      ) {
        try {
          const currentTime = playerRef.current.getCurrentTime();
          const duration = playerRef.current.getDuration();
          if (!isNaN(currentTime) && !isNaN(duration)) {
            updateProgress(currentTime, duration);
          }
        } catch (e) {
          console.error("Error updating progress:", e);
        }
      }
    }, 1000);

    // Store the interval ID for cleanup
    miniPlayerRef.current = progressInterval;
  };

  // Format helpers
  const formattedCurrent = useMemo(() => {
    const s = Math.floor(progress.current);
    const m = Math.floor(s / 60);
    const sec = String(s % 60).padStart(2, "0");
    return `${m}:${sec}`;
  }, [progress.current]);

  const formattedTotal = useMemo(() => {
    const s = Math.floor(progress.total);
    const m = Math.floor(s / 60);
    const sec = String(s % 60).padStart(2, "0");
    return `${m}:${sec}`;
  }, [progress.total]);

  const percent = useMemo(() => {
    return progress.total > 0 ? (progress.current / progress.total) * 100 : 0;
  }, [progress.current, progress.total]);

  // If no video in context, hide:
  if (!currentVideo) return null;

  const goToVideo = () => {
    navigate(`/video/${currentVideo.id}`);
  };

  const handleBarClick = (e) => {
    e.stopPropagation();
    const { left, width } = e.currentTarget.getBoundingClientRect();
    const pct = (e.clientX - left) / width;
    const newTime = progress.total * pct;

    if (isOnVideoPage) {
      // We're on the video page, just navigate with timestamp
      navigate(`/video/${currentVideo.id}?t=${Math.floor(newTime)}`);
    } else {
      // Seek directly in the mini player
      if (
        playerRef.current &&
        playerReady &&
        typeof playerRef.current.seekTo === "function"
      ) {
        try {
          playerRef.current.seekTo(newTime);
          updateProgress(newTime, progress.total);
        } catch (e) {
          console.error("Error seeking:", e);
          // Fallback to navigation
          navigate(`/video/${currentVideo.id}?t=${Math.floor(newTime)}`);
        }
      } else {
        // Fallback to navigation if player isn't ready
        navigate(`/video/${currentVideo.id}?t=${Math.floor(newTime)}`);
      }
    }
  };

  // Handle skip forward/backward
  const skipForward = () => {
    if (isOnVideoPage) {
      // Navigate with new timestamp
      navigate(
        `/video/${currentVideo.id}?t=${Math.floor(
          Math.min(progress.current + 10, progress.total)
        )}`
      );
    } else if (
      playerRef.current &&
      playerReady &&
      typeof playerRef.current.seekTo === "function"
    ) {
      try {
        const newTime = Math.min(progress.current + 10, progress.total);
        playerRef.current.seekTo(newTime);
        updateProgress(newTime, progress.total);
      } catch (e) {
        console.error("Error skipping forward:", e);
      }
    }
  };

  const skipBackward = () => {
    if (isOnVideoPage) {
      // Navigate with new timestamp
      navigate(
        `/video/${currentVideo.id}?t=${Math.floor(
          Math.max(progress.current - 10, 0)
        )}`
      );
    } else if (
      playerRef.current &&
      playerReady &&
      typeof playerRef.current.seekTo === "function"
    ) {
      try {
        const newTime = Math.max(progress.current - 10, 0);
        playerRef.current.seekTo(newTime);
        updateProgress(newTime, progress.total);
      } catch (e) {
        console.error("Error skipping backward:", e);
      }
    }
  };

  const handleTogglePlayPause = () => {
    if (isOnVideoPage) {
      // Just toggle the state, the main player will respond
      togglePlayPause();
    } else if (playerRef.current && playerReady) {
      // Control our player directly
      togglePlayPause();
    } else {
      // If player isn't ready, try to initialize it
      if (currentVideo && !isOnVideoPage) {
        initializeAudioPlayer();
        // After initialization, it should auto-play based on the isPlaying state
        setIsPlaying(true);
      } else {
        // Just toggle the state as fallback
        togglePlayPause();
      }
    }
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white shadow-lg border-t border-gray-200 p-3 md:block z-10">
      <div className="container mx-auto flex items-center justify-between">
        <div
          className="flex items-center space-x-4 cursor-pointer"
          onClick={goToVideo}
        >
          <img
            src={currentVideo.thumbnail}
            alt={currentVideo.title}
            className="w-12 h-12 rounded-lg object-cover"
          />
          <div>
            <h5 className="font-semibold text-sm line-clamp-1">
              {currentVideo.title}
            </h5>
            <p className="text-xs text-gray-600">{currentVideo.channelTitle}</p>
          </div>
        </div>

        <div className="flex items-center space-x-6">
          <button
            className="text-gray-600 hover:text-red-500"
            onClick={skipBackward}
          >
            <SkipBack size={20} />
          </button>
          <button
            className="bg-red-500 text-white p-3 rounded-full hover:bg-red-600"
            onClick={handleTogglePlayPause}
          >
            {isPlaying ? <Pause size={18} /> : <Play size={18} />}
          </button>
          <button
            className="text-gray-600 hover:text-red-500"
            onClick={skipForward}
          >
            <SkipForward size={20} />
          </button>
        </div>

        <div className="flex items-center space-x-4">
          <div className="w-40">
            <div
              className="h-2 bg-gray-200 rounded-full cursor-pointer relative"
              onClick={handleBarClick}
            >
              <div
                className="h-2 bg-red-500 rounded-full absolute left-0 top-0"
                style={{ width: `${percent}%` }}
              />
            </div>
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>{formattedCurrent}</span>
              <span>{formattedTotal}</span>
            </div>
          </div>

          <button className="text-gray-600 hover:text-red-500">
            <Volume2 size={20} />
          </button>
          <button className="text-gray-600 hover:text-red-500">
            <FileText size={20} />
          </button>
        </div>
      </div>
    </div>
  );
}

export default React.memo(PodcastMiniPlayer);
