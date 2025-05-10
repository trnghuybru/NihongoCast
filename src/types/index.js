// Định nghĩa các hằng số cho QuestionType
export const QuestionType = {
  "multiple-choice": "multiple-choice",
  "essay": "essay",
  "fill-blank": "fill-blank",
  "drag-drop": "drag-drop"
};

// Khai báo các đối tượng Option và Question theo kiểu dữ liệu thông thường trong JS
export function Option(id, text, isCorrect) {
  this.id = id;
  this.text = text;
  this.isCorrect = isCorrect || false;
}

export function Question(id, type, text, options = [], answer = "", points) {
  this.id = id;
  this.type = type;
  this.text = text;
  this.options = options;
  this.answer = answer;
  this.points = points;
}

export function Test(id, title, description, questions, timeLimit = null, isPublished, createdAt, updatedAt, createdBy) {
  this.id = id;
  this.title = title;
  this.description = description;
  this.questions = questions;
  this.timeLimit = timeLimit;
  this.isPublished = isPublished;
  this.createdAt = createdAt;
  this.updatedAt = updatedAt;
  this.createdBy = createdBy;
}

export function TestResult(id, testId, userId, score, maxScore, startedAt, submittedAt = null, answers) {
  this.id = id;
  this.testId = testId;
  this.userId = userId;
  this.score = score;
  this.maxScore = maxScore;
  this.startedAt = startedAt;
  this.submittedAt = submittedAt;
  this.answers = answers;
}

export function User(id, name, email) {
  this.id = id;
  this.name = name;
  this.email = email;
}
