import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faHeadphones,
  faMicrophoneAlt,
  faClosedCaptioning,
} from "@fortawesome/free-solid-svg-icons";

const features = [
  {
    icon: (
      <FontAwesomeIcon icon={faHeadphones} className="text-2xl text-red-500" />
    ),
    bg: "bg-red-100",
    title: "Học qua hội thoại thực tế",
    description:
      "Học tiếng Nhật qua các tình huống và cuộc trò chuyện thực tế, không chỉ là mẫu câu trong sách vở.",
  },
  {
    icon: (
      <FontAwesomeIcon
        icon={faMicrophoneAlt}
        className="text-2xl text-yellow-500"
      />
    ),
    bg: "bg-yellow-100",
    title: "Luyện phát âm",
    description:
      "Ghi âm và so sánh cách phát âm của bạn với người bản xứ ngay trong ứng dụng.",
  },
  {
    icon: (
      <FontAwesomeIcon
        icon={faClosedCaptioning}
        className="text-2xl text-blue-500"
      />
    ),
    bg: "bg-blue-100",
    title: "Phụ đề tương tác",
    description:
      "Nhấp vào bất kỳ từ nào trong phụ đề để xem nghĩa, ví dụ và phân tích chữ Hán.",
  },
];

export default function NihongoCastFeatures() {
  return (
    <section className="mb-12 bg-white rounded-xl shadow-md p-6">
      <h3 className="text-2xl font-bold text-gray-800 mb-6 text-center">
        Vì sao nên học cùng NihongoCast?
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {features.map((feature, index) => (
          <div key={index} className="text-center">
            <div
              className={`w-16 h-16 mx-auto mb-4 ${feature.bg} rounded-full flex items-center justify-center`}
            >
              {feature.icon}
            </div>
            <h4 className="font-bold text-lg mb-2">{feature.title}</h4>
            <p className="text-gray-600">{feature.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
