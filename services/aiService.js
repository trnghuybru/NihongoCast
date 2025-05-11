const axios = require('axios');
const FLASHCARD_API_URL = process.env.FLASHCARD_API_URL || 'http://localhost:3001';


// Service xử lý tạo câu hỏi bằng AI
class AiService {
  

  // Phương thức tạo câu hỏi từ bộ flashcard
  static async generateQuestionsFromFlashcards(deckId, options = {}) {
    try {
      // Gọi API đến flashcard-api thay vì dùng model trực tiếp
      const response = await axios.get(`${FLASHCARD_API_URL}/api/flashcard-decks/${deckId}`);
      const deck = response.data;
  
      if (!deck || !deck.flashcards) {
        throw new Error('Không tìm thấy bộ flashcard hoặc bộ dữ liệu không hợp lệ');
      }
  
      const questionCount = options.questionCount || 10;
      const difficulty = options.difficulty || 'medium';
      const questionTypes = options.questionTypes || ['multiple-choice'];
  
      const flashcardData = deck.flashcards.map(card => ({
        japanese: card.japanese,
        vietnamese: card.vietnamese
      }));
  
      const questions = this.mockGenerateQuestions(flashcardData, questionCount, difficulty, questionTypes);
      return questions;
  
    } catch (error) {
      console.error('Lỗi khi tạo câu hỏi từ flashcard:', error.message);
      throw error;
    }
  }
  
  
  // Phương thức tạo câu hỏi từ video/podcast (giả lập)
  static async generateQuestionsFromMedia(mediaId, mediaType, transcript, options = {}) {
    try {
      // Thực tế sẽ lấy transcript từ video/podcast
      // Đây chỉ là mô phỏng
      
      const questionCount = options.questionCount || 5;
      const difficulty = options.difficulty || 'medium';
      const questionTypes = options.questionTypes || ['multiple-choice', 'essay'];
      
      // Mô phỏng gọi API AI với transcript
      const questions = this.mockGenerateQuestionsFromTranscript(
        transcript,
        questionCount,
        difficulty,
        questionTypes
      );
      
      return questions;
    } catch (error) {
      console.error(`Lỗi khi tạo câu hỏi từ ${mediaType}:`, error);
      throw error;
    }
  }
  
  // Mô phỏng gọi API AI (trong thực tế sẽ gọi API thật)
  static async callAiApi(data, questionCount, difficulty, questionTypes) {
    try {
      // Đây là nơi bạn sẽ gọi API AI thực sự
      // Ví dụ với OpenAI:
      /*
      const response = await axios.post('https://api.openai.com/v1/completions', {
        model: 'text-davinci-003',
        prompt: `Tạo ${questionCount} câu hỏi ${difficulty} dựa trên dữ liệu này: ${JSON.stringify(data)}`,
        max_tokens: 2000,
        temperature: 0.7
      }, {
        headers: {
          'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
          'Content-Type': 'application/json'
        }
      });
      
      return this.parseAiResponse(response.data.choices[0].text);
      */
      
      // Tạm thời trả về giả lập
      return this.mockGenerateQuestions(data, questionCount, difficulty, questionTypes);
    } catch (error) {
      console.error('Lỗi khi gọi API AI:', error);
      throw error;
    }
  }
  
  // Mô phỏng tạo câu hỏi từ bộ flashcard
  static mockGenerateQuestions(flashcardData, questionCount, difficulty, questionTypes) {
    const questions = [];
    
    // Đảm bảo không tạo quá số flashcard hiện có
    const maxQuestions = Math.min(questionCount, flashcardData.length);
    
    // Tạo câu hỏi trắc nghiệm
    for (let i = 0; i < maxQuestions; i++) {
      const randomIndex = Math.floor(Math.random() * flashcardData.length);
      const flashcard = flashcardData[randomIndex];
      
      // Xáo trộn mảng để chọn ra các flashcard làm đáp án sai
      const otherOptions = flashcardData
        .filter((_, index) => index !== randomIndex)
        .sort(() => 0.5 - Math.random())
        .slice(0, 3);
      
      // Tạo các phương án trả lời
      const options = [
        flashcard.vietnamese,
        ...otherOptions.map(card => card.vietnamese)
      ].sort(() => 0.5 - Math.random()); // Xáo trộn các đáp án
      
      const questionType = questionTypes[Math.floor(Math.random() * questionTypes.length)];
      
      // Tạo câu hỏi theo loại
      if (questionType === 'multiple-choice') {
        questions.push({
          question: `"${flashcard.japanese}" trong tiếng Việt có nghĩa là gì?`,
          type: 'multiple-choice',
          options,
          correctAnswers: flashcard.vietnamese,
          explanation: `"${flashcard.japanese}" có nghĩa là "${flashcard.vietnamese}" trong tiếng Việt.`,
          difficulty
        });
      } else if (questionType === 'fill-blank') {
        questions.push({
          question: `Điền từ tiếng Nhật cho từ "${flashcard.vietnamese}": ________`,
          type: 'fill-blank',
          correctAnswers: flashcard.japanese,
          explanation: `"${flashcard.vietnamese}" trong tiếng Nhật là "${flashcard.japanese}".`,
          difficulty
        });
      }
    }
    
    return questions;
  }
  
  // Mô phỏng tạo câu hỏi từ transcript
  static mockGenerateQuestionsFromTranscript(transcript, questionCount, difficulty, questionTypes) {
    // Trong thực tế, AI sẽ phân tích transcript để tạo câu hỏi có ý nghĩa
    // Đây chỉ là một mô phỏng đơn giản
    
    const questions = [];
    
    // Tạo các câu hỏi mẫu dựa trên transcript
    for (let i = 0; i < questionCount; i++) {
      const questionType = questionTypes[Math.floor(Math.random() * questionTypes.length)];
      
      if (questionType === 'multiple-choice') {
        questions.push({
          question: `Câu hỏi mẫu ${i+1} từ transcript: Đâu là ý chính của đoạn?`,
          type: 'multiple-choice',
          options: [
            'Đáp án A mẫu',
            'Đáp án B mẫu',
            'Đáp án C mẫu',
            'Đáp án D mẫu'
          ],
          correctAnswers: 'Đáp án A mẫu',
          explanation: 'Giải thích mẫu cho câu hỏi này.',
          difficulty
        });
      } else if (questionType === 'essay') {
        questions.push({
          question: `Hãy phân tích và giải thích ý nghĩa của đoạn văn sau trong transcript: "Phần trích dẫn mẫu ${i+1}"`,
          type: 'essay',
          correctAnswers: 'Đây là hướng dẫn trả lời cho giáo viên chấm bài.',
          explanation: 'Mục tiêu của câu hỏi này là kiểm tra khả năng phân tích văn bản.',
          difficulty
        });
      }
    }
    
    return questions;
  }
  
  // Phân tích phản hồi từ AI (sẽ thực hiện khi có API thật)
  static parseAiResponse(aiResponseText) {
    // Phân tích phản hồi văn bản từ AI thành cấu trúc câu hỏi
    // Đây là nơi bạn sẽ chuyển đổi văn bản AI trả về thành đối tượng câu hỏi
    
    // Trong thực tế, bạn sẽ viết logic phân tích cụ thể dựa trên định dạng phản hồi của API
    
    return []; // Trả về mảng câu hỏi đã phân tích
  }
}

module.exports = AiService; 