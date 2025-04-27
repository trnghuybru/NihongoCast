# Module Tạo Bài Test

Module này cho phép người dùng tạo và làm các bài kiểm tra từ nội dung học được, với hai chế độ tạo bài test: thủ công và tự động bằng AI.

## Chức năng chính

1. **Tạo bài test thủ công**: Người dùng tự nhập câu hỏi và đáp án
2. **Tạo bài test tự động bằng AI**: Hệ thống sử dụng AI để tạo câu hỏi dựa trên nguồn dữ liệu (flashcard, video, podcast)
3. **Làm bài test và nhận kết quả**: Người dùng làm bài test, hệ thống chấm điểm và hiển thị feedback

## API Endpoints

### Quản lý bài test

- **GET /api/tests**: Lấy danh sách bài test
- **GET /api/tests/:id**: Lấy thông tin chi tiết một bài test
- **POST /api/tests/manual**: Tạo bài test thủ công
  ```json
  {
    "title": "Tên bài test",
    "description": "Mô tả bài test",
    "questions": [
      {
        "question": "Nội dung câu hỏi",
        "type": "multiple-choice",
        "options": ["Lựa chọn A", "Lựa chọn B", "Lựa chọn C", "Lựa chọn D"],
        "correctAnswers": "Lựa chọn A",
        "explanation": "Giải thích cho đáp án"
      }
    ],
    "timeLimit": 30,
    "showAnswersAfterSubmit": true
  }
  ```
- **POST /api/tests/ai**: Tạo bài test tự động bằng AI
  ```json
  {
    "title": "Tên bài test",
    "description": "Mô tả bài test",
    "sourceType": "flashcard",
    "sourceId": "id-của-bộ-flashcard",
    "questionCount": 10,
    "difficulty": "medium",
    "questionTypes": ["multiple-choice", "fill-blank"],
    "timeLimit": 30
  }
  ```
- **PUT /api/tests/:id**: Cập nhật thông tin bài test
- **POST /api/tests/:id/publish**: Xuất bản bài test
- **DELETE /api/tests/:id**: Xóa bài test

### Làm bài test

- **GET /api/tests/:id/start**: Bắt đầu làm bài test
- **POST /api/test-results/:resultId/answers**: Lưu câu trả lời
  ```json
  {
    "questionId": "id-của-câu-hỏi",
    "answer": "Câu trả lời của người dùng"
  }
  ```
- **POST /api/test-results/:resultId/submit**: Nộp bài test

### Xem kết quả

- **GET /api/users/:userId/test-results**: Lấy danh sách kết quả bài test của người dùng
- **GET /api/test-results/:resultId**: Xem chi tiết kết quả bài test

## Các loại câu hỏi hỗ trợ

- **multiple-choice**: Câu hỏi trắc nghiệm
- **essay**: Câu hỏi tự luận
- **fill-blank**: Câu hỏi điền từ
- **drag-drop**: Câu hỏi kéo thả

## Luồng hoạt động

### Tạo bài test
1. Người dùng chọn tạo bài test thủ công hoặc tự động
2. Nếu thủ công: Nhập từng câu hỏi và đáp án
3. Nếu tự động: Chọn nguồn dữ liệu (flashcard, video, podcast) và hệ thống sẽ sinh câu hỏi
4. Bài test được lưu vào database

### Làm bài test
1. Người dùng bắt đầu làm bài test
2. Người dùng trả lời các câu hỏi
3. Người dùng nộp bài
4. Hệ thống chấm điểm, lưu kết quả và hiển thị feedback

## Yêu cầu hệ thống
- Node.js
- MongoDB
- Express

## Lưu ý khi sử dụng chức năng AI
Chức năng tạo bài test tự động bằng AI hiện đang sử dụng mô phỏng. Để tích hợp với AI thực tế, bạn cần:

1. Đăng ký tài khoản API với các dịch vụ AI (ví dụ: OpenAI)
2. Cập nhật file `.env` với API key
3. Sửa đổi phương thức `callAiApi()` trong `aiService.js` để gọi API thực tế 