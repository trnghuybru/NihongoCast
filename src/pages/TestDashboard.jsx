"use client"

import React, { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import { testService } from "../services/api"
import Layout from "../components/layout/Layout"

const TestDashboard = () => {
  const [tests, setTests] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchTests = async () => {
      try {
        const data = await testService.getAllTests()
        console.log("Fetched tests data:", data);
        setTests(data)
      } catch (err) {
        console.error("Failed to fetch tests:", err)
        setError("Failed to load tests. Please try again later.")
      } finally {
        setLoading(false)
      }
    }

    fetchTests()
  }, [])

  return (
    <Layout>
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Welcome to Test Study</h1>
        <p className="text-gray-600">Create and take tests to enhance your learning experience.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <Link to="/tests/create/manual" className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
          <h2 className="text-xl font-bold mb-2">Create Manual Test</h2>
          <p className="text-gray-600 mb-4">Create a test by manually adding questions and answers.</p>
          <div className="gradient-bg text-white py-2 px-4 rounded-md inline-block">Get Started</div>
        </Link>

        <Link to="/tests/create/ai" className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
          <h2 className="text-xl font-bold mb-2">Create AI-Generated Test</h2>
          <p className="text-gray-600 mb-4">Let AI generate questions from your learning materials.</p>
          <div className="gradient-bg text-white py-2 px-4 rounded-md inline-block">Get Started</div>
        </Link>
      </div>

      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-4">Available Tests</h2>

        {loading ? (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading tests...</p>
          </div>
        ) : error ? (
          <div className="text-center py-8 text-red-500">{error}</div>
        ) : tests.length === 0 ? (
          <div className="text-center py-8 bg-gray-50 rounded-lg">
            <p className="text-gray-600">No tests available yet. Create your first test!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {tests.map((test) => {
              console.log('Test ơ Dashboard:'+test._id); // In ra test.id để kiểm tra
              return (
                <div key={test._id} className="bg-white rounded-lg shadow-md overflow-hidden">
                  <div className="gradient-bg p-4">
                    <h3 className="text-xl font-bold text-white">{test.title}</h3>
                  </div>
                  <div className="p-4">
                    <p className="text-gray-600 mb-4 line-clamp-2">{test.description}</p>
                    <div className="flex justify-between items-center text-sm text-gray-500 mb-4">
                      <span>{test.questions.length} questions</span>
                      {test.timeLimit && <span>{test.timeLimit} min</span>}
                    </div>
                    <Link
                      to={`/tests/${test._id}`}
                      className="block text-center bg-orange-500 text-white py-2 px-4 rounded-md hover:bg-orange-600 transition-colors"
                    >
                      View Test
                    </Link>
                  </div>
                </div>
              );
            })}

          </div>
        )}
      </div>
    </Layout>
  )
}


export default TestDashboard