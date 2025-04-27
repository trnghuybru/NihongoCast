const mongoose = require('mongoose');

// Định nghĩa schema cho kết quả một câu trả lời
const answerSchema = new mongoose.Schema({
  // ID của câu hỏi
  questionId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true
  },
  // Nội dung câu hỏi (lưu để đối chiếu)
  question: {
    type: String
  },
  // Loại câu hỏi
  questionType: {
    type: String,
    enum: ['multiple-choice', 'essay', 'fill-blank', 'drag-drop']
  },
  // Câu trả lời của người dùng
  userAnswer: {
    type: mongoose.Schema.Types.Mixed // Có thể là String, Number, Array tùy loại câu hỏi
  },
  // Đáp án đúng
  correctAnswer: {
    type: mongoose.Schema.Types.Mixed
  },
  // Đúng hay sai
  isCorrect: {
    type: Boolean
  },
  // Điểm số cho câu này (nếu câu hỏi có trọng số khác nhau)
  score: {
    type: Number,
    default: 1
  }
});

// Định nghĩa schema cho kết quả bài test
const testResultSchema = new mongoose.Schema({
  // ID của bài test
  testId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Test',
    required: true
  },
  // ID của người dùng làm bài
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  // Các câu trả lời
  answers: [answerSchema],
  // Điểm tổng
  totalScore: {
    type: Number,
    default: 0
  },
  // Số câu đúng
  correctAnswers: {
    type: Number,
    default: 0
  },
  // Tổng số câu
  totalQuestions: {
    type: Number,
    required: true
  },
  // Thời gian bắt đầu làm bài
  startTime: {
    type: Date,
    default: Date.now
  },
  // Thời gian nộp bài
  submitTime: {
    type: Date
  },
  // Thời gian làm bài (tính bằng giây)
  duration: {
    type: Number
  },
  // Nhận xét và đánh giá
  feedback: {
    type: String
  },
  // Trạng thái: 'in-progress', 'completed', 'graded'
  status: {
    type: String,
    enum: ['in-progress', 'completed', 'graded'],
    default: 'in-progress'
  }
}, { timestamps: true });

// Phương thức tính điểm và số câu đúng
testResultSchema.methods.calculateScore = function() {
  let correctCount = 0;
  let totalScore = 0;
  
  this.answers.forEach(answer => {
    if (answer.isCorrect) {
      correctCount++;
      totalScore += answer.score;
    }
  });
  
  this.correctAnswers = correctCount;
  this.totalScore = totalScore;
  
  return { correctAnswers: correctCount, totalScore };
};

module.exports = mongoose.model('TestResult', testResultSchema); 