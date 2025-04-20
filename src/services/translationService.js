import axios from "axios";

const API_URL = "http://127.0.0.1:2704/api/translate_batch"; // Sử dụng endpoint batch

export const fetchTranslationsService = async (texts) => {
  try {
    const response = await axios.post(API_URL, { texts });
    const translatedTexts = response.data; // Giả sử API trả về mảng các bản dịch theo thứ tự

    // Chuyển mảng kết quả thành object để dễ truy xuất theo câu gốc
    const translationsMap = {};
    texts.forEach((text, index) => {
      translationsMap[text] = translatedTexts[index];
    });

    return translationsMap;
  } catch (error) {
    console.error("Lỗi API dịch:", error);
    return {}; // Trả về object rỗng nếu có lỗi
  }
};
