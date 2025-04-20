// src/services/subtitleService.js

export async function fetchSubtitlesService(videoId) {
  // Xây dựng URL YouTube từ videoId
  const youtube_url = `https://www.youtube.com/watch?v=${videoId}`;

  const response = await fetch("http://127.0.0.1:2704/api/transcribe/", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ youtube_url }), // gửi body đúng định dạng
  });

  if (!response.ok) {
    throw new Error("Lỗi khi fetch phụ đề");
  }

  const data = await response.json();
  return data.subtitles || [];
}
