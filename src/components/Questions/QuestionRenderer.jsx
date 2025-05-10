import React from "react"
import MultipleChoiceQuestion from "./MultipleChoiceQuestion"
import EssayQuestion from "./EssayQuestion"
import FillBlankQuestion from "./FillBlankQuestion"
import DragDropQuestion from "./DragDropQuestion"

const QuestionRenderer = ({ question, onAnswer, userAnswer, isReview = false }) => {
  switch (question.type) {
    case "multiple-choice":
      return (
        <MultipleChoiceQuestion
          question={question}
          onAnswer={onAnswer}
          userAnswer={userAnswer}
          isReview={isReview}
        />
      )
    case "essay":
      return (
        <EssayQuestion
          question={question}
          onAnswer={onAnswer}
          userAnswer={userAnswer}
          isReview={isReview}
        />
      )
    case "fill-blank":
      return (
        <FillBlankQuestion
          question={question}
          onAnswer={onAnswer}
          userAnswer={userAnswer}
          isReview={isReview}
        />
      )
    case "drag-drop":
      return (
        <DragDropQuestion
          question={question}
          onAnswer={(id, answer) => onAnswer(id, answer)}
          userAnswer={userAnswer}
          isReview={isReview}
        />
      )
    default:
      return <div>Unsupported question type: {question.type}</div>
  }
}

export default QuestionRenderer
