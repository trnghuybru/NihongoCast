const Test = require('../models/test');
const AiService = require('../services/aiService');

// Controller xử lý tất cả các thao tác với bài test
class TestController {
  
  // Lấy tất cả bài test
  static async getAllTests(req, res) {
    try {
      // Lấy các query params
      const { creator, status } = req.query;
      
      // Xây dựng query
      const query = {};
      if (creator) query.creator = creator;
      if (status) query.status = status;
      
      // Thực hiện query với các tham số lọc
      const tests = await Test.find(query).sort({ createdAt: -1 });
      
      res.status(200).json(tests);
    } catch (error) {
      console.error('Lỗi khi lấy danh sách bài test:', error);
      res.status(500).json({ message: 'Lỗi khi lấy danh sách bài test', error: error.message });
    }
  }
  
  // Lấy chi tiết một bài test
  static async getTestById(req, res) {
    try {
      const testId = req.params.id;
      console.log(testId);
      const test = await Test.findById(testId);
      if (!test) {
        return res.status(404).json({ message: 'Không tìm thấy bài test' });
      }
      
      res.status(200).json(test);
    } catch (error) {
      console.error('Lỗi khi lấy thông tin bài test:', error);
      res.status(500).json({ message: 'Lỗi khi lấy thông tin bài test', error: error.message });
    }
  }
  
  // Tạo bài test mới (thủ công)
  static async createManualTest(req, res) {
    try {
      const { title, description, questions, timeLimit, showAnswersAfterSubmit } = req.body;
      
      // Kiểm tra dữ liệu đầu vào
      if (!title || !questions || !Array.isArray(questions) || questions.length === 0) {
        return res.status(400).json({ message: 'Thiếu thông tin cần thiết để tạo bài test' });
      }
      
      // Lấy ID người dùng từ request (giả sử đã xác thực)
      const creator = req.user ? req.user.id : null;
      
      // Tạo bài test mới
      const newTest = new Test({
        title,
        description,
        creator,
        creationMethod: 'manual',
        questions,
        timeLimit: timeLimit || 30,
        showAnswersAfterSubmit: showAnswersAfterSubmit !== undefined ? showAnswersAfterSubmit : true,
        status: 'draft'
      });
      
      // Lưu bài test
      const savedTest = await newTest.save();
      
      res.status(201).json(savedTest);
    } catch (error) {
      console.error('Lỗi khi tạo bài test thủ công:', error);
      res.status(500).json({ message: 'Lỗi khi tạo bài test', error: error.message });
    }
  }
  
  // Tạo bài test bằng AI
  static async createAiTest(req, res) {
    try {
      const { title, description, sourceType, sourceId, questionCount, difficulty, questionTypes, timeLimit } = req.body;
      
      // Kiểm tra dữ liệu đầu vào
      if (!title || !sourceType || !sourceId) {
        return res.status(400).json({ message: 'Thiếu thông tin cần thiết để tạo bài test AI' });
      }
      
      // Lấy ID người dùng từ request (giả sử đã xác thực)
      const creator = req.user ? req.user.id : null;
      
      // Tạo options cho AI
      const aiOptions = {
        questionCount: questionCount || 10,
        difficulty: difficulty || 'medium',
        questionTypes: questionTypes || ['multiple-choice']
      };
      
      // Tạo câu hỏi từ nguồn dữ liệu theo loại
      let questions = [];
      
      if (sourceType === 'flashcard') {
        questions = await AiService.generateQuestionsFromFlashcards(sourceId, aiOptions);
      } else if (sourceType === 'video' || sourceType === 'podcast') {
        // Giả sử có transcript
        const transcript = "Đây là transcript mẫu để tạo câu hỏi. Trong thực tế sẽ lấy từ nguồn dữ liệu.";
        questions = await AiService.generateQuestionsFromMedia(sourceId, sourceType, transcript, aiOptions);
      } else {
        return res.status(400).json({ message: 'Loại nguồn dữ liệu không hỗ trợ' });
      }
      
      // Tạo bài test mới
      const newTest = new Test({
        title,
        description,
        creator,
        creationMethod: 'ai',
        aiSource: sourceType,
        sourceId,
        questions,
        timeLimit: timeLimit || 30,
        status: 'draft'
      });
      
      // Lưu bài test
      const savedTest = await newTest.save();
      
      res.status(201).json(savedTest);
    } catch (error) {
      console.error('Lỗi khi tạo bài test bằng AI:', error);
      res.status(500).json({ message: 'Lỗi khi tạo bài test bằng AI', error: error.message });
    }
  }
  
  // Cập nhật bài test
  static async updateTest(req, res) {
    try {
      const testId = req.params.id;
      const { title, description, questions, timeLimit, showAnswersAfterSubmit, status } = req.body;
      
      // Tìm bài test hiện tại
      const test = await Test.findById(testId);
      if (!test) {
        return res.status(404).json({ message: 'Không tìm thấy bài test' });
      }
      
      // Cập nhật thông tin
      if (title) test.title = title;
      if (description !== undefined) test.description = description;
      if (questions && Array.isArray(questions)) test.questions = questions;
      if (timeLimit) test.timeLimit = timeLimit;
      if (showAnswersAfterSubmit !== undefined) test.showAnswersAfterSubmit = showAnswersAfterSubmit;
      if (status && ['draft', 'published'].includes(status)) test.status = status;
      
      // Lưu thay đổi
      const updatedTest = await test.save();
      
      res.status(200).json(updatedTest);
    } catch (error) {
      console.error('Lỗi khi cập nhật bài test:', error);
      res.status(500).json({ message: 'Lỗi khi cập nhật bài test', error: error.message });
    }
  }
  
  // Xuất bản bài test
  static async publishTest(req, res) {
    try {
      const testId = req.params.id;
      
      // Tìm bài test
      const test = await Test.findById(testId);
      if (!test) {
        return res.status(404).json({ message: 'Không tìm thấy bài test' });
      }
      
      // Kiểm tra xem bài test có câu hỏi không
      if (!test.questions || test.questions.length === 0) {
        return res.status(400).json({ message: 'Bài test cần có ít nhất một câu hỏi để xuất bản' });
      }
      
      // Cập nhật trạng thái
      test.status = 'published';
      
      // Lưu thay đổi
      const publishedTest = await test.save();
      
      res.status(200).json(publishedTest);
    } catch (error) {
      console.error('Lỗi khi xuất bản bài test:', error);
      res.status(500).json({ message: 'Lỗi khi xuất bản bài test', error: error.message });
    }
  }
  
  // Xóa bài test
  static async deleteTest(req, res) {
    try {
      const testId = req.params.id;
      
      // Tìm và xóa bài test
      const deletedTest = await Test.findByIdAndDelete(testId);
      
      if (!deletedTest) {
        return res.status(404).json({ message: 'Không tìm thấy bài test' });
      }
      
      res.status(200).json({ message: 'Đã xóa bài test thành công' });
    } catch (error) {
      console.error('Lỗi khi xóa bài test:', error);
      res.status(500).json({ message: 'Lỗi khi xóa bài test', error: error.message });
    }
  }
}

module.exports = TestController; 