import React from "react";
import { Link, useNavigate } from "react-router-dom";
import HeroSection from "../components/HeroSection";
import NihongoCastFeatures from "../components/NihongoCastFeature";
import { useVideo } from "../contexts/VideoContext"; // Import context hook

function Home({ videos }) {
  const navigate = useNavigate();
  const { playVideo } = useVideo(); // Sử dụng context để lưu thông tin video

  // Xử lý click vào video
  const handleVideoClick = (e, video) => {
    e.preventDefault(); // Ngăn chặn hành vi mặc định của Link

    // Lưu thông tin video vào context
    playVideo({
      id: video.id.videoId,
      title: video.snippet.title,
      channelTitle: video.snippet.channelTitle,
      thumbnail: video.snippet.thumbnails.medium.url,
      description: video.snippet.description,
      // Vì API search của YouTube không trả về thời lượng,
      // ta có thể để mặc định hoặc cập nhật sau khi fetch thông tin chi tiết
      duration: 0,
    });

    // Điều hướng đến trang video
    navigate(`/video/${video.id.videoId}`);
  };

  return (
    <div className="bg-gray-100 min-h-screen">
      <HeroSection />
      <main className="pt-16 container mx-auto px-4 pb-24">
        {" "}
        {/* Tăng padding bottom để tránh mini player che nội dung */}
        <h2 className="text-2xl font-semibold mb-4">Newest Podcasts</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 mb-12">
          {videos.map((video) => (
            <div
              key={video.id.videoId}
              onClick={(e) => handleVideoClick(e, video)}
              className="bg-white shadow-md rounded-xl overflow-hidden hover:-translate-y-1 transition cursor-pointer"
            >
              <img
                src={video.snippet.thumbnails.medium.url}
                alt={video.snippet.title}
                className="w-full h-48 object-cover"
              />
              <div className="p-3">
                <h3 className="text-md font-semibold line-clamp-2">
                  {video.snippet.title}
                </h3>
                <p className="text-sm text-gray-500">
                  {video.snippet.channelTitle}
                </p>
              </div>
            </div>
          ))}
        </div>
        <NihongoCastFeatures />
      </main>
    </div>
  );
}

export default Home;
