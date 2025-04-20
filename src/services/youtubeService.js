import axios from "axios";

const API_KEY = import.meta.env.VITE_YOUTUBE_API_KEY;
const BASE_URL = "https://www.googleapis.com/youtube/v3";

/**
 * Lấy danh sách video từ API YouTube dựa vào từ khóa tìm kiếm.
 * Bạn có thể tùy chỉnh query hoặc các tham số khác theo nhu cầu.
 */
export const getVideos = async (query = "English Short Podcast") => {
  try {
    const response = await axios.get(`${BASE_URL}/search`, {
      params: {
        part: "snippet",
        maxResults: 20,
        type: "video",
        q: query,
        key: API_KEY,
      },
    });
    return response.data.items;
  } catch (error) {
    console.error("Error fetching videos: ", error);
    return [];
  }
};

export async function getVideoDetails(videoId) {
  const response = await fetch(
    `https://www.googleapis.com/youtube/v3/videos?part=snippet&id=${videoId}&key=${API_KEY}`
  );

  const data = await response.json();
  return data.items[0];
}
