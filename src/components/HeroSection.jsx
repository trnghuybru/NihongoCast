import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlay, faHeadphones } from "@fortawesome/free-solid-svg-icons";

function HeroSection() {
  return (
    <section className="gradient-bg text-white py-12 mt-14">
      <div className="container mx-auto px-4 flex flex-col md:flex-row items-center">
        {/* Left side */}
        <div className="md:w-1/2 mb-8 md:mb-0">
          <h2 className="text-4xl font-bold mb-4">
            Chinh phục tiếng Nhật qua từng podcast, học mọi lúc, mọi nơi!
          </h2>
          <p className="text-xl mb-6">
            Khám phá những cuộc trò chuyện thực tế, được tuyển chọn phù hợp cho
            mọi trình độ – từ người mới bắt đầu đến nâng cao.
          </p>
          <div className="flex space-x-4">
            <button className="bg-white text-red-500 px-6 py-2 rounded-full font-semibold hover:bg-gray-100 transition flex items-center">
              <FontAwesomeIcon icon={faPlay} className="mr-2" />
              Nghe ngay
            </button>
            <button className="border-2 border-white text-white px-6 py-2 rounded-full font-semibold hover:bg-white hover:text-red-500 transition">
              Cách hoạt động
            </button>
          </div>
        </div>

        {/* Right side */}
        <div className="md:w-1/2 relative ">
          <img
            src="src/assets/avt.png"
            alt="Japanese sensei"
            className=" rounded-lg w-1/2 max-w-md mx-auto animate-floating"
          />
          <div className="absolute -bottom-6 -right-6 bg-white p-3 rounded-full shadow-lg">
            <div className="bg-red-500 text-white p-3 rounded-full">
              <FontAwesomeIcon icon={faHeadphones} className="text-2xl" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default HeroSection;
