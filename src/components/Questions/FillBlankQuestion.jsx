"use client"

import React, { useState, useEffect } from "react"

const FillBlankQuestion = ({
  question,
  onAnswer,
  userAnswer = "",
  isReview = false,
}) => {
  const [answer, setAnswer] = useState(userAnswer)

  useEffect(() => {
    if (userAnswer) {
      setAnswer(userAnswer)
    }
  }, [userAnswer])

  const handleChange = (e) => {
    const newAnswer = e.target.value
    setAnswer(newAnswer)
    onAnswer(question.id, newAnswer)
  }

  // Split the question text by the blank placeholder (e.g., "___")
  const parts = question.text.split("___")

  return (
    <div className="mb-6 p-4 bg-white rounded-lg shadow-md">
      <div className="text-lg font-medium mb-3">
        {parts.map((part, index) => (
          <React.Fragment key={index}>
            {part}
            {index < parts.length - 1 && (
              <input
                type="text"
                className="mx-1 px-2 py-1 w-32 border-b-2 border-orange-400 focus:outline-none focus:border-orange-600 bg-transparent"
                value={answer}
                onChange={handleChange}
                disabled={isReview}
              />
            )}
          </React.Fragment>
        ))}
      </div>

      {isReview && (
        <div className="mt-4">
          <div
            className={`p-3 rounded-md ${
              answer.toLowerCase() === question.answer?.toLowerCase()
                ? "bg-green-50 border border-green-200"
                : "bg-red-50 border border-red-200"
            }`}
          >
            <h4 className="font-medium mb-1">
              {answer.toLowerCase() === question.answer?.toLowerCase()
                ? "Correct!"
                : "Incorrect"}
            </h4>
            <p>
              Correct answer: <strong>{question.answer}</strong>
            </p>
          </div>
        </div>
      )}
    </div>
  )
}

export default FillBlankQuestion
