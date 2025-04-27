const mongoose = require('mongoose');

// Định nghĩa schema cho một câu hỏi
const questionSchema = new mongoose.Schema({
  // Nội dung câu hỏi
  question: {
    type: String,
    required: true,
    trim: true
  },
  // Loại câu hỏi: 'multiple-choice' (trắc nghiệm), 'essay' (tự luận), 'fill-blank' (điền từ), 'drag-drop' (kéo thả)
  type: {
    type: String, 
    required: true,
    enum: ['multiple-choice', 'essay', 'fill-blank', 'drag-drop'],
    default: 'multiple-choice'
  },
  // Các lựa chọn cho câu hỏi trắc nghiệm
  options: [String],
  // Đáp án đúng
  correctAnswers: {
    type: mongoose.Schema.Types.Mixed, // Có thể là String hoặc Array tùy loại câu hỏi
    required: true
  },
  // Giải thích đáp án
  explanation: {
    type: String,
    trim: true
  },
  // Độ khó: 'easy', 'medium', 'hard'
  difficulty: {
    type: String,
    enum: ['easy', 'medium', 'hard'],
    default: 'medium'
  }
}, { timestamps: true });

// Định nghĩa schema cho bài test
const testSchema = new mongoose.Schema({
  // Tên bài test
  title: {
    type: String,
    required: true,
    trim: true
  },
  // Mô tả bài test
  description: {
    type: String,
    trim: true
  },
  // Người tạo
  creator: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  // Phương thức tạo: 'manual' (thủ công) hoặc 'ai' (tự động)
  creationMethod: {
    type: String,
    enum: ['manual', 'ai'],
    default: 'manual'
  },
  // Nguồn dữ liệu cho tạo bài test bằng AI: 'flashcard', 'video', 'podcast'
  aiSource: {
    type: String,
    enum: ['flashcard', 'video', 'podcast'],
  },
  // ID của nguồn dữ liệu (nếu có)
  sourceId: {
    type: mongoose.Schema.Types.ObjectId
  },
  // Các câu hỏi trong bài test
  questions: [questionSchema],
  // Thời gian làm bài (phút)
  timeLimit: {
    type: Number,
    default: 30
  },
  // Trạng thái: 'draft', 'published'
  status: {
    type: String,
    enum: ['draft', 'published'],
    default: 'draft'
  },
  // Có hiển thị đáp án sau khi làm không
  showAnswersAfterSubmit: {
    type: Boolean,
    default: true
  }
}, { timestamps: true });

module.exports = mongoose.model('Test', testSchema); 