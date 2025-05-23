"use client"

import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { testService } from "../../services/api"
import {Question, QuestionType} from "../../types/index"
import QuestionForm from "./QuestionForm"

const TestCreationForm = () => {
  const navigate = useNavigate()
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [timeLimit, setTimeLimit] = useState(undefined)
  const [questions, setQuestions] = useState([])
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleAddQuestion = (type) => {
    const newQuestion = {
      id: `temp-${Date.now()}`,
      type,
      text: "",
      points: 1,
      options: type === "multiple-choice" || type === "drag-drop" ? [] : undefined,
    }

    setQuestions([...questions, newQuestion])
  }

  const handleUpdateQuestion = (updatedQuestion) => {
    setQuestions(questions.map((q) => (q.id === updatedQuestion.id ? updatedQuestion : q)))
  }

  const handleRemoveQuestion = (questionId) => {
    setQuestions(questions.filter((q) => q.id !== questionId))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!title.trim()) {
      alert("Please enter a title for the test")
      return
    }

    if (questions.length === 0) {
      alert("Please add at least one question to the test")
      return
    }

    // Validate all questions
    for (const question of questions) {
      if (!question.text.trim()) {
        alert("All questions must have text")
        return
      }

      if (question.type === "multiple-choice" && (!question.options || question.options.length < 2)) {
        alert("Multiple choice questions must have at least 2 options")
        return
      }

      if (question.type === "multiple-choice" && !question.options.some((opt) => opt.isCorrect)) {
        alert("Multiple choice questions must have at least one correct option")
        return
      }

      if (question.type === "drag-drop" && (!question.options || question.options.length < 2)) {
        alert("Drag and drop questions must have at least 2 items")
        return
      }
    }

    setIsSubmitting(true)

    try {
      const testData = {
        title,
        description,
        timeLimit,
        questions,
        isPublished: false,
      }

      const createdTest = await testService.createManualTest(testData)
      alert("Test created successfully!")
      navigate(`/tests/${createdTest.id}`)
    } catch (error) {
      console.error("Failed to create test:", error)
      alert("Failed to create test. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-bold mb-6">Create a New Test</h2>

      <form onSubmit={handleSubmit}>
        <div className="mb-6">
          <label className="block text-gray-700 font-medium mb-2" htmlFor="title">
            Test Title
          </label>
          <input
            type="text"
            id="title"
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>

        <div className="mb-6">
          <label className="block text-gray-700 font-medium mb-2" htmlFor="description">
            Description
          </label>
          <textarea
            id="description"
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
            rows={3}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>

        <div className="mb-6">
          <label className="block text-gray-700 font-medium mb-2" htmlFor="timeLimit">
            Time Limit (minutes, optional)
          </label>
          <input
            type="number"
            id="timeLimit"
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
            value={timeLimit || ""}
            onChange={(e) => setTimeLimit(e.target.value ? parseInt(e.target.value) : undefined)}
            min="1"
          />
        </div>

        <div className="mb-6">
          <h3 className="text-xl font-medium mb-4">Questions</h3>

          {questions.length === 0 ? (
            <div className="text-center py-8 bg-gray-50 rounded-md">
              <p className="text-gray-500">No questions added yet. Add your first question below.</p>
            </div>
          ) : (
            <div className="space-y-6">
              {questions.map((question, index) => (
                <div key={question.id} className="border border-gray-200 rounded-md p-4">
                  <div className="flex justify-between items-center mb-4">
                    <h4 className="text-lg font-medium">Question {index + 1}</h4>
                    <button
                      type="button"
                      className="text-red-500 hover:text-red-700"
                      onClick={() => handleRemoveQuestion(question.id)}
                    >
                      Remove
                    </button>
                  </div>
                  <QuestionForm question={question} onChange={handleUpdateQuestion} />
                </div>
              ))}
            </div>
          )}

          <div className="mt-6 flex flex-wrap gap-2">
            <button
              type="button"
              className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
              onClick={() => handleAddQuestion("multiple-choice")}
            >
              Add Multiple Choice
            </button>
            <button
              type="button"
              className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600"
              onClick={() => handleAddQuestion("essay")}
            >
              Add Essay
            </button>
            <button
              type="button"
              className="px-4 py-2 bg-purple-500 text-white rounded-md hover:bg-purple-600"
              onClick={() => handleAddQuestion("fill-blank")}
            >
              Add Fill-in-the-Blank
            </button>
            <button
              type="button"
              className="px-4 py-2 bg-yellow-500 text-white rounded-md hover:bg-yellow-600"
              onClick={() => handleAddQuestion("drag-drop")}
            >
              Add Drag & Drop
            </button>
          </div>
        </div>

        <div className="mt-8 flex justify-end">
          <button
            type="submit"
            className="px-6 py-3 bg-orange-500 text-white rounded-md hover:bg-orange-600 disabled:opacity-50"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Creating Test..." : "Create Test"}
          </button>
        </div>
      </form>
    </div>
  )
}

export default TestCreationForm
