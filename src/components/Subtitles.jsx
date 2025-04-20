import React, { useState, useEffect, useRef } from "react";
import { MoreVertical } from "lucide-react";
import { fetchSubtitlesService } from "../services/subtitlesService";
import ChatbotPopup from "./ChatbotPopup";

function Subtitles({ videoId, currentTime, onSubtitleClick }) {
  const [subtitles, setSubtitles] = useState([]);
  const [loadingSubtitles, setLoadingSubtitles] = useState(false);
  const [popupSubtitle, setPopupSubtitle] = useState(null);
  const containerRef = useRef(null);

  async function fetchSubtitles() {
    setLoadingSubtitles(true);
    try {
      const subtitlesData = await fetchSubtitlesService(videoId);
      setSubtitles(subtitlesData);
    } catch (error) {
      console.error("Lỗi khi fetch phụ đề:", error);
    } finally {
      setLoadingSubtitles(false);
    }
  }

  useEffect(() => {
    if (containerRef.current) {
      const activeElement =
        containerRef.current.querySelector(".active-subtitle");
      if (activeElement) {
        containerRef.current.scrollTo({
          top: activeElement.offsetTop - containerRef.current.offsetTop,
          behavior: "smooth",
        });
      }
    }
  }, [currentTime, subtitles]);

  return (
    <div className="sticky top-24 w-full bg-white p-4 rounded shadow-sm h-[650px] flex flex-col z-10">
      <div className="mb-4 flex justify-between items-center">
        <h2 className="text-lg font-bold">Phụ đề</h2>
        {subtitles.length === 0 && (
          <button
            onClick={fetchSubtitles}
            disabled={loadingSubtitles}
            className="border-2 border-red text-white px-6 py-2 rounded-xl font-semibold bg-red-500 hover:border-white transition cursor-pointer"
          >
            {loadingSubtitles ? "Đang tải phụ đề..." : "Lấy phụ đề"}
          </button>
        )}
      </div>
      <div ref={containerRef} className="flex-1 space-y-2 overflow-y-auto">
        {subtitles.length === 0 ? (
          <div className="text-gray-500">Chưa có phụ đề nào</div>
        ) : (
          subtitles.map((subtitle, index) => {
            const isActive =
              currentTime >= subtitle.start && currentTime <= subtitle.end;

            return (
              <div
                key={index}
                className={`relative p-2 rounded transition-colors duration-200 border flex justify-between items-center ${
                  isActive
                    ? "active-subtitle bg-blue-200 border-blue-400 font-semibold"
                    : "bg-gray-100 border-gray-200 hover:bg-gray-200"
                } cursor-pointer`}
              >
                <div
                  onClick={() => onSubtitleClick(subtitle.start)}
                  className="flex-1"
                >
                  <p className="text-gray-800">{subtitle.text}</p>
                  <small className="text-gray-600">
                    {subtitle.start} - {subtitle.end}
                  </small>
                </div>
                <button
                  onClick={() => setPopupSubtitle(subtitle)}
                  className="p-2 rounded-full hover:bg-gray-300"
                >
                  <MoreVertical size={20} />
                </button>
              </div>
            );
          })
        )}
      </div>
      {popupSubtitle && (
        <ChatbotPopup
          subtitle={popupSubtitle}
          onClose={() => setPopupSubtitle(null)}
        />
      )}
    </div>
  );
}

export default Subtitles;
