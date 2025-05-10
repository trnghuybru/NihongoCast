"use client"

import React, { useState } from "react"

const MultipleChoiceQuestion = ({
  question,
  onAnswer,
  userAnswer,
  isReview = false,
}) => {
  const [selectedOption, setSelectedOption] = useState(userAnswer)

  const handleOptionSelect = (optionId) => {
    if (isReview) return

    setSelectedOption(optionId)
    onAnswer(question.id, optionId)
  }

  return (
    <div className="mb-6 p-4 bg-white rounded-lg shadow-md">
      <h3 className="text-lg font-medium mb-3">{question.text}</h3>
      <div className="space-y-2">
        {question.options?.map((option) => (
          <div
            key={option.id}
            className={`p-3 border rounded-md cursor-pointer transition-colors ${
              selectedOption === option.id
                ? "border-orange-500 bg-orange-50"
                : "border-gray-200 hover:border-orange-300"
            } ${isReview && option.isCorrect ? "border-green-500 bg-green-50" : ""} ${
              isReview && selectedOption === option.id && !option.isCorrect
                ? "border-red-500 bg-red-50"
                : ""
            }`}
            onClick={() => handleOptionSelect(option.id)}
          >
            {option.text}
            {isReview && option.isCorrect && (
              <span className="ml-2 text-green-600">✓</span>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

export default MultipleChoiceQuestion
