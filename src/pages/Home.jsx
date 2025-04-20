import React from "react";
import { Link } from "react-router-dom";
import HeroSection from "../components/HeroSection";
import NihongoCastFeatures from "../components/NihongoCastFeature";

function Home({ videos }) {
  return (
    <div className="bg-gray-100 min-h-screen">
      <HeroSection />

      <main className="pt-16 container mx-auto px-4 pb-16">
        <h2 className="text-2xl font-semibold mb-4">Newest Podcasts</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 mb-12">
          {videos.map((video) => (
            <Link
              key={video.id.videoId}
              to={`/video/${video.id.videoId}`}
              state={{ video }}
              className="bg-white shadow-md rounded-xl overflow-hidden hover:-translate-y-1 transition"
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
            </Link>
          ))}
        </div>
        <NihongoCastFeatures />
      </main>
    </div>
  );
}

export default Home;
