"use client"

import React, { useState, useEffect } from "react"

const EssayQuestion = ({ question, onAnswer, userAnswer = "", isReview = false }) => {
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

  return (
    <div className="mb-6 p-4 bg-white rounded-lg shadow-md">
      <h3 className="text-lg font-medium mb-3">{question.text}</h3>
      <textarea
        className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
        rows={6}
        placeholder="Type your answer here..."
        value={answer}
        onChange={handleChange}
        disabled={isReview}
      />
      {isReview && question.answer && (
        <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-md">
          <h4 className="font-medium text-green-800 mb-1">Sample Answer:</h4>
          <p>{question.answer}</p>
        </div>
      )}
    </div>
  )
}

export default EssayQuestion
