"use client"

import { useState, useEffect, useRef } from "react"

const QuestionForm = ({ question, onChange }) => {
  const [questionText, setQuestionText] = useState(question.text)
  const [options, setOptions] = useState(question.options || [])
  const [answer, setAnswer] = useState(question.answer || "")
  const [points, setPoints] = useState(question.points)

  const prev = useRef({ questionText, options, answer, points })

  useEffect(() => {
    if (
      prev.current.questionText !== questionText ||
      JSON.stringify(prev.current.options) !== JSON.stringify(options) ||
      prev.current.answer !== answer ||
      prev.current.points !== points
    ) {
      const updatedQuestion = {
        ...question,
        text: questionText,
        options: question.type === "multiple-choice" || question.type === "drag-drop" ? options : undefined,
        answer: question.type === "fill-blank" || question.type === "essay" ? answer : undefined,
        points,
      }
      onChange(updatedQuestion)
      prev.current = { questionText, options, answer, points }
    }
  }, [questionText, options, answer, points, question, onChange])

  const handleAddOption = () => {
    const newOption = {
      id: `option-${Date.now()}`,
      text: "",
      isCorrect: question.type === "multiple-choice" ? false : undefined,
    }
    setOptions([...options, newOption])
  }

  const handleUpdateOption = (index, field, value) => {
    const updatedOptions = [...options]
    updatedOptions[index] = {
      ...updatedOptions[index],
      [field]: value,
    }
    setOptions(updatedOptions)
  }

  const handleRemoveOption = (index) => {
    setOptions(options.filter((_, i) => i !== index))
  }

  return (
    <div>
      <div className="mb-4">
        <label className="block text-gray-700 font-medium mb-2">Question Text</label>
        <textarea
          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
          rows={3}
          value={questionText}
          onChange={(e) => setQuestionText(e.target.value)}
          placeholder={
            question.type === "fill-blank"
              ? 'Use ___ for the blank (e.g., "The capital of France is ___.")'
              : "Enter your question here"
          }
        />
      </div>

      {(question.type === "multiple-choice" || question.type === "drag-drop") && (
        <div className="mb-4">
          <div className="flex justify-between items-center mb-2">
            <label className="block text-gray-700 font-medium">
              {question.type === "multiple-choice" ? "Options" : "Items"}
            </label>
            <button type="button" className="text-sm text-blue-500 hover:text-blue-700" onClick={handleAddOption}>
              Add {question.type === "multiple-choice" ? "Option" : "Item"}
            </button>
          </div>

          {options.length === 0 ? (
            <div className="text-center py-4 bg-gray-50 rounded-md">
              <p className="text-gray-500">
                No {question.type === "multiple-choice" ? "options" : "items"} added yet. Click "Add{" "}
                {question.type === "multiple-choice" ? "Option" : "Item"}" to add one.
              </p>
            </div>
          ) : (
            <div className="space-y-2">
              {options.map((option, index) => (
                <div key={option.id} className="flex items-center gap-2">
                  {question.type === "multiple-choice" && (
                    <input
                      type="checkbox"
                      checked={option.isCorrect || false}
                      onChange={(e) => handleUpdateOption(index, "isCorrect", e.target.checked)}
                      className="h-5 w-5 text-orange-500 focus:ring-orange-500"
                    />
                  )}
                  <input
                    type="text"
                    value={option.text}
                    onChange={(e) => handleUpdateOption(index, "text", e.target.value)}
                    className="flex-grow px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                    placeholder={`${question.type === "multiple-choice" ? "Option" : "Item"} ${index + 1}`}
                  />
                  <button
                    type="button"
                    className="text-red-500 hover:text-red-700"
                    onClick={() => handleRemoveOption(index)}
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>
          )}

          {question.type === "multiple-choice" && (
            <p className="mt-2 text-sm text-gray-500">Check the box next to correct options.</p>
          )}

          {question.type === "drag-drop" && (
            <p className="mt-2 text-sm text-gray-500">
              Items will be presented in random order. The order you add them here is the correct order.
            </p>
          )}
        </div>
      )}

      {question.type === "fill-blank" && (
        <div className="mb-4">
          <label className="block text-gray-700 font-medium mb-2">Correct Answer</label>
          <input
            type="text"
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
            placeholder="Enter the word that goes in the blank"
          />
        </div>
      )}

      {question.type === "essay" && (
        <div className="mb-4">
          <label className="block text-gray-700 font-medium mb-2">Sample Answer (Optional)</label>
          <textarea
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
            rows={3}
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
            placeholder="Enter a sample answer for reference"
          />
        </div>
      )}

      <div className="mb-4">
        <label className="block text-gray-700 font-medium mb-2">Points</label>
        <input
          type="number"
          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
          value={points}
          onChange={(e) => setPoints(Number.parseInt(e.target.value) || 1)}
          min="1"
        />
      </div>
    </div>
  )
}

export default QuestionForm
