const Test = require('../models/test');
const TestResult = require('../models/testResult');

// Controller xử lý tất cả các thao tác với kết quả bài test
class TestResultController {
  
  // Bắt đầu làm bài test
  static async startTest(req, res) {
    try {
      const testId = req.params.id;
      
      // Lấy ID người dùng từ request (giả sử đã xác thực)
      const userId = req.user ? req.user.id : null;
      // const userId = "663888888888888888888888";

      // Kiểm tra bài test tồn tại không
      const test = await Test.findById(testId);
      if (!test) {
        return res.status(404).json({ message: 'Không tìm thấy bài test' });
      }
      
      // Kiểm tra bài test đã được xuất bản chưa
      if (test.status !== 'published') {
        return res.status(400).json({ message: 'Bài test chưa được xuất bản' });
      }
      
      // Kiểm tra xem người dùng đã có bài test đang làm dở không
      const existingResult = await TestResult.findOne({
        testId,
        userId,
        status: 'in-progress'
      });
      
      if (existingResult) {
        // Nếu đã có, trả về thông tin bài test đang làm
        return res.status(200).json({
          message: 'Tiếp tục bài test đang làm',
          testResult: existingResult
        });
      }
      
      // Tạo kết quả bài test mới
      const testResult = new TestResult({
        testId,
        userId,
        totalQuestions: test.questions.length,
        startTime: new Date(),
        status: 'in-progress',
        answers: []
      });
      
      // Lưu vào database
      const savedTestResult = await testResult.save();
      
      // Trả về thông tin bài test cho người dùng (không bao gồm đáp án)
      const testInfo = {
        _id: test._id,
        title: test.title,
        description: test.description,
        timeLimit: test.timeLimit,
        questions: test.questions.map(q => ({
          _id: q._id,
          question: q.question,
          type: q.type,
          options: q.type === 'multiple-choice' ? q.options : undefined
        })),
        totalQuestions: test.questions.length,
        resultId: savedTestResult._id
      };
      
      res.status(200).json(testInfo);
    } catch (error) {
      console.error('Lỗi khi bắt đầu bài test:', error);
      res.status(500).json({ message: 'Lỗi khi bắt đầu bài test', error: error.message });
    }
  }
  
  // Lưu câu trả lời
  static async saveAnswer(req, res) {
    try {
      const resultId = req.params.resultId;
      const { questionId, answer } = req.body;
      
      // Kiểm tra dữ liệu đầu vào
      if (!questionId || answer === undefined) {
        return res.status(400).json({ message: 'Thiếu thông tin câu trả lời' });
      }
      
      // Tìm kết quả bài test
      const testResult = await TestResult.findById(resultId);
      if (!testResult) {
        return res.status(404).json({ message: 'Không tìm thấy kết quả bài test' });
      }
      
      // Kiểm tra trạng thái
      if (testResult.status !== 'in-progress') {
        return res.status(400).json({ message: 'Bài test đã kết thúc, không thể thêm câu trả lời' });
      }
      
      // Tìm bài test để lấy thông tin câu hỏi
      const test = await Test.findById(testResult.testId);
      if (!test) {
        return res.status(404).json({ message: 'Không tìm thấy bài test' });
      }
      
      // Tìm câu hỏi trong bài test
      const question = test.questions.id(questionId);
      if (!question) {
        return res.status(404).json({ message: 'Không tìm thấy câu hỏi' });
      }
      
      // Kiểm tra xem câu trả lời đã tồn tại chưa
      const existingAnswerIndex = testResult.answers.findIndex(
        a => a.questionId.toString() === questionId
      );
      
      // Tạo đối tượng câu trả lời
      const answerObj = {
        questionId,
        question: question.question,
        questionType: question.type,
        userAnswer: answer,
        correctAnswer: question.correctAnswers,
        isCorrect: TestResultController.checkAnswer(answer, question.correctAnswers, question.type)
      };
      
      // Cập nhật hoặc thêm câu trả lời
      if (existingAnswerIndex !== -1) {
        testResult.answers[existingAnswerIndex] = answerObj;
      } else {
        testResult.answers.push(answerObj);
      }
      
      // Lưu thay đổi
      await testResult.save();
      
      res.status(200).json({ message: 'Đã lưu câu trả lời' });
    } catch (error) {
      console.error('Lỗi khi lưu câu trả lời:', error);
      res.status(500).json({ message: 'Lỗi khi lưu câu trả lời', error: error.message });
    }
  }
  
  // Nộp bài test
  static async submitTest(req, res) {
    try {
      const resultId = req.params.resultId;
      
      // Tìm kết quả bài test
      const testResult = await TestResult.findById(resultId);
      if (!testResult) {
        return res.status(404).json({ message: 'Không tìm thấy kết quả bài test' });
      }
      
      // Kiểm tra trạng thái
      if (testResult.status !== 'in-progress') {
        return res.status(400).json({ message: 'Bài test đã hoàn thành trước đó' });
      }
      
      // Tìm bài test để lấy thông tin
      const test = await Test.findById(testResult.testId);
      if (!test) {
        return res.status(404).json({ message: 'Không tìm thấy bài test' });
      }
      
      // Cập nhật thông tin nộp bài
      testResult.submitTime = new Date();
      testResult.duration = Math.round((testResult.submitTime - testResult.startTime) / 1000); // Thời gian làm bài tính bằng giây
      testResult.status = 'completed';
      
      // Tính điểm
      testResult.calculateScore();
      
      // Tạo nhận xét dựa trên điểm số
      const percentage = (testResult.correctAnswers / testResult.totalQuestions) * 100;
      
      if (percentage >= 90) {
        testResult.feedback = "Xuất sắc! Bạn đã nắm vững kiến thức.";
      } else if (percentage >= 70) {
        testResult.feedback = "Tốt! Bạn đã hiểu phần lớn nội dung.";
      } else if (percentage >= 50) {
        testResult.feedback = "Khá! Bạn cần củng cố thêm một số phần.";
      } else {
        testResult.feedback = "Cần cố gắng hơn! Hãy xem lại các phần kiến thức chưa nắm vững.";
      }
      
      // Lưu kết quả
      await testResult.save();
      
      // Chuẩn bị kết quả để trả về
      const result = {
        testTitle: test.title,
        totalQuestions: testResult.totalQuestions,
        correctAnswers: testResult.correctAnswers,
        score: testResult.totalScore,
        percentage: percentage.toFixed(2),
        feedback: testResult.feedback,
        duration: testResult.duration,
        // Nếu test cho phép hiển thị đáp án sau khi nộp bài
        answers: test.showAnswersAfterSubmit ? testResult.answers.map(answer => ({
          question: answer.question,
          userAnswer: answer.userAnswer,
          correctAnswer: answer.correctAnswer,
          isCorrect: answer.isCorrect
        })) : []
      };
      
      res.status(200).json(result);
    } catch (error) {
      console.error('Lỗi khi nộp bài test:', error);
      res.status(500).json({ message: 'Lỗi khi nộp bài test', error: error.message });
    }
  }
  
  // Lấy danh sách kết quả bài test của người dùng
  static async getUserTestResults(req, res) {
    try {
      // Lấy ID người dùng từ request
      const userId = req.params.userId || (req.user ? req.user.id : null);
      
      if (!userId) {
        return res.status(400).json({ message: 'Thiếu thông tin người dùng' });
      }
      
      // Lấy danh sách kết quả bài test của người dùng
      const results = await TestResult.find({
        userId,
        status: { $ne: 'in-progress' } // Chỉ lấy các bài test đã hoàn thành
      }).sort({ submitTime: -1 });
      
      // Lấy thông tin chi tiết của các bài test
      const resultWithTestInfo = await Promise.all(
        results.map(async (result) => {
          const test = await Test.findById(result.testId);
          return {
            _id: result._id,
            testId: result.testId,
            testTitle: test ? test.title : 'Bài test không tồn tại',
            totalQuestions: result.totalQuestions,
            correctAnswers: result.correctAnswers,
            score: result.totalScore,
            submitTime: result.submitTime,
            duration: result.duration,
            feedback: result.feedback
          };
        })
      );
      
      res.status(200).json(resultWithTestInfo);
    } catch (error) {
      console.error('Lỗi khi lấy danh sách kết quả bài test:', error);
      res.status(500).json({ message: 'Lỗi khi lấy danh sách kết quả bài test', error: error.message });
    }
  }
  
  // Lấy chi tiết kết quả bài test
  static async getTestResultDetail(req, res) {
    try {
      const resultId = req.params.resultId;
      
      // Tìm kết quả bài test
      const result = await TestResult.findById(resultId);
      if (!result) {
        return res.status(404).json({ message: 'Không tìm thấy kết quả bài test' });
      }
      
      // Tìm bài test để lấy thông tin
      const test = await Test.findById(result.testId);
      if (!test) {
        return res.status(404).json({ message: 'Không tìm thấy bài test' });
      }
      
      // Kiểm tra quyền truy cập (chỉ cho phép người dùng xem kết quả của họ)
      if (req.user && req.user.id !== result.userId.toString()) {
        return res.status(403).json({ message: 'Không có quyền truy cập kết quả này' });
      }
      
      // Chuẩn bị dữ liệu kết quả
      const detailedResult = {
        testId: result.testId,
        testTitle: test.title,
        totalQuestions: result.totalQuestions,
        correctAnswers: result.correctAnswers,
        totalScore: result.totalScore,
        percentage: ((result.correctAnswers / result.totalQuestions) * 100).toFixed(2),
        startTime: result.startTime,
        submitTime: result.submitTime,
        duration: result.duration,
        feedback: result.feedback,
        answers: result.answers.map(answer => ({
          question: answer.question,
          type: answer.questionType,
          userAnswer: answer.userAnswer,
          correctAnswer: answer.correctAnswer,
          isCorrect: answer.isCorrect,
          explanation: test.questions.id(answer.questionId)?.explanation || ''
        }))
      };
      
      res.status(200).json(detailedResult);
    } catch (error) {
      console.error('Lỗi khi lấy chi tiết kết quả bài test:', error);
      res.status(500).json({ message: 'Lỗi khi lấy chi tiết kết quả bài test', error: error.message });
    }
  }
  
  // Phương thức hỗ trợ kiểm tra câu trả lời
  static checkAnswer(userAnswer, correctAnswer, type) {
    if (!userAnswer) return false;
    
    switch (type) {
      case 'multiple-choice':
        return userAnswer === correctAnswer;
        
      case 'fill-blank':
        // Loại bỏ khoảng trắng và chuyển thành chữ thường để so sánh
        return userAnswer.trim().toLowerCase() === correctAnswer.trim().toLowerCase();
        
      case 'drag-drop':
        // Giả sử cả hai đều là mảng và cần so sánh chính xác
        if (Array.isArray(userAnswer) && Array.isArray(correctAnswer)) {
          if (userAnswer.length !== correctAnswer.length) return false;
          return userAnswer.every((val, index) => val === correctAnswer[index]);
        }
        return false;
        
      case 'essay':
        // Đối với câu hỏi tự luận, cần giáo viên chấm
        return 'needs-grading';
        
      default:
        return false;
    }
  }
}

module.exports = TestResultController; 