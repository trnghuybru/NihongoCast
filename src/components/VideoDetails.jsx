import React from "react";

function VideoDetails({ video }) {
  return (
    <div className="flex flex-col justify-between p-4 border border-gray-200 rounded">
      <div className="mb-4 flex justify-between items-center">
        <div className="flex items-center">
          {/* Sử dụng URL ảnh chủ kênh từ video.snippet.channelThumbnail */}
          <img
            src="../src/assets/logo.png"
            alt={video.snippet.channelTitle}
            className="w-10 h-10 rounded-full mr-2"
          />
          <h3 className="font-semibold">{video.snippet.channelTitle}</h3>
        </div>
        <a
          href={`https://www.youtube.com/channel/${video.snippet.channelId}`}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block bg-blue-500 text-white px-4 py-2 rounded-xl mt-2"
        >
          Theo dõi
        </a>
      </div>
      <hr className="mb-6 text-gray-200" />
      <div className="overflow-y-auto overflow-x-hidden description-scroll">
        {video.snippet.description && (
          <p className="text-gray-600">{video.snippet.description}</p>
        )}
      </div>
    </div>
  );
}

export default VideoDetails;
