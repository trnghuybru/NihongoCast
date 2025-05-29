import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { testService } from "../../services/api"
import { deckApi } from '../../services/api';

const AITestForm = () => {
  const navigate = useNavigate()
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [source, setSource] = useState("flashcard")
  const [sourceId, setSourceId] = useState("")
  const [questionCount, setQuestionCount] = useState(5)
  const [questionTypes, setQuestionTypes] = useState(["multiple-choice"])
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [decks, setDecks] = useState([])

  useEffect(() => {
    const fetchDecks = async () => {
      try {
        const decks = await deckApi.getAllDecks()
        console.log(decks)
        setDecks(decks)
      } catch (error) {
        console.error('Không thể tải danh sách bộ flashcard:', error)
      }
    }
    fetchDecks()
  }, [])

  const handleQuestionTypeToggle = (type) => {
    if (questionTypes.includes(type)) {
      setQuestionTypes(questionTypes.filter((t) => t !== type))
    } else {
      setQuestionTypes([...questionTypes, type])
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!title.trim()) {
      alert("Please enter a title for the test")
      return
    }

    if (!sourceId.trim()) {
      alert("Please enter a source ID")
      return
    }

    if (questionTypes.length === 0) {
      alert("Please select at least one question type")
      return
    }

    setIsSubmitting(true)

    try {
      // Chuẩn bị dữ liệu gửi lên, đảm bảo sourceId đúng kiểu (string id)
      const testData = {
        title,
        description,
        sourceType: source,
        sourceId,  // ở đây sourceId là id của deck khi source=flashcard
        questionCount,
        questionTypes,
      }

      const createdTest = await testService.createAITest(testData)
      alert("Test created successfully!")
      navigate(`/tests/${createdTest._id}`)
    } catch (error) {
      console.error("Failed to create AI test:", error)
      alert("Failed to create test. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-bold mb-6">Create an AI-Generated Test</h2>

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
          <label className="block text-gray-700 font-medium mb-2">Source Type</label>
          <div className="flex space-x-4">
            {["flashcard", "video", "podcast"].map((type) => (
              <label key={type} className="inline-flex items-center">
                <input
                  type="radio"
                  className="form-radio h-5 w-5 text-orange-500"
                  checked={source === type}
                  onChange={() => {
                    setSource(type)
                    setSourceId("") // reset sourceId khi đổi source
                  }}
                />
                <span className="ml-2 capitalize">{type}</span>
              </label>
            ))}
          </div>
        </div>

        <div className="mb-6">
          <label className="block text-gray-700 font-medium mb-2" htmlFor="sourceId">
            {source === "flashcard" ? "Choose a Flashcard Deck" : "Source ID"}
          </label>

          {source === "flashcard" ? (
            <select
              id="sourceId"
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
              value={sourceId}
              onChange={(e) => setSourceId(e.target.value)}
              required
            >
              <option value="">-- Select a deck --</option>
              {decks.map((deck) => (
                <option key={deck._id} value={deck._id}>
                  {deck.name}
                </option>
              ))}
            </select>
          ) : (
            <>
              <input
                type="text"
                id="sourceId"
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                value={sourceId}
                onChange={(e) => setSourceId(e.target.value)}
                required
                placeholder={`Enter the ${source} ID`}
              />
              <p className="mt-1 text-sm text-gray-500">
                {source === "video" && "Enter the video ID"}
                {source === "podcast" && "Enter the podcast episode ID"}
              </p>
            </>
          )}
        </div>

        <div className="mb-6">
          <label className="block text-gray-700 font-medium mb-2" htmlFor="questionCount">
            Number of Questions
          </label>
          <input
            type="number"
            id="questionCount"
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
            value={questionCount}
            onChange={(e) => setQuestionCount(Number.parseInt(e.target.value) || 5)}
            min="1"
            max="20"
          />
        </div>

        <div className="mb-6">
          <label className="block text-gray-700 font-medium mb-2">Question Types</label>
          <div className="space-y-2">
            {["multiple-choice", "essay", "fill-blank", "drag-drop"].map((type) => (
              <label key={type} className="inline-flex items-center">
                <input
                  type="checkbox"
                  className="form-checkbox h-5 w-5 text-orange-500"
                  checked={questionTypes.includes(type)}
                  onChange={() => handleQuestionTypeToggle(type)}
                />
                <span className="ml-2 capitalize">
                  {{
                    "multiple-choice": "Multiple Choice",
                    essay: "Essay",
                    "fill-blank": "Fill-in-the-Blank",
                    "drag-drop": "Drag & Drop",
                  }[type]}
                </span>
              </label>
            ))}
          </div>
        </div>

        <div className="mt-8 flex justify-end">
          <button
            type="submit"
            className="px-6 py-3 bg-orange-500 text-white rounded-md hover:bg-orange-600 disabled:opacity-50"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Generating Test..." : "Generate Test"}
          </button>
        </div>
      </form>
    </div>
  )
}

export default AITestForm
