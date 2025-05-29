"use client";

import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { testService } from "../services/api";
import Layout from "../components/layout/Layout";

const TestDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [test, setTest] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isStarting, setIsStarting] = useState(false);

  useEffect(() => {
    const fetchTest = async () => {
      if (!id) return;
      console.log("IdId:", id); // Debugging line
      try {
        const data = await testService.getTest(id);
        setTest(data);
      } catch (err) {
        console.error("Failed to fetch test:", err);
        setError("Failed to load test. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchTest();
  }, [id]);

  const handleStartTest = async () => {
    if (!id) return;
    setIsStarting(true);

    try {
      const result = await testService.startTest(id);
      navigate(`/tests/${id}/take`, { state: { resultId: result.id } });
    } catch (err) {
      console.error("Failed to start test:", err);
      alert("Failed to start test. Please try again.");
      setIsStarting(false);
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading test...</p>
        </div>
      </Layout>
    );
  }

  if (error || !test) {
    return (
      <Layout>
        <div className="text-center py-8 text-red-500">{error || "Test not found"}</div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="gradient-bg p-6">
          <h1 className="text-3xl font-bold text-white mb-2">{test.title}</h1>
          {test.description && <p className="text-white opacity-90">{test.description}</p>}
        </div>

        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <div className="bg-gray-50 p-4 rounded-md">
              <h3 className="font-medium mb-2">Questions</h3>
              <p className="text-2xl font-bold">{test.questions.length}</p>
            </div>

            <div className="bg-gray-50 p-4 rounded-md">
              <h3 className="font-medium mb-2">Time Limit</h3>
              <p className="text-2xl font-bold">{test.timeLimit ? `${test.timeLimit} minutes` : "No limit"}</p>
            </div>

            <div className="bg-gray-50 p-4 rounded-md">
              <h3 className="font-medium mb-2">Total Points</h3>
              <p className="text-2xl font-bold">
                {test.questions.reduce((sum, q) => sum + (+q.points || 0), 10)}
              </p>
            </div>
          </div>

          <div className="mb-6">
            <h2 className="text-xl font-bold mb-3">Question Types</h2>
            <div className="flex flex-wrap gap-2">
              {Array.from(new Set(test.questions.map((q) => q.type))).map((type) => (
                <span key={type} className="px-3 py-1 bg-orange-100 text-orange-800 rounded-full text-sm">
                  {type === "multiple-choice"
                    ? "Multiple Choice"
                    : type === "essay"
                      ? "Essay"
                      : type === "fill-blank"
                        ? "Fill-in-the-Blank"
                        : "Drag & Drop"}
                </span>
              ))}
            </div>
          </div>

          <div className="mb-6">
            <h2 className="text-xl font-bold mb-3">Instructions</h2>
            <ul className="list-disc pl-5 space-y-2 text-gray-700">
              <li>Read each question carefully before answering.</li>
              <li>You can navigate between questions using the navigation buttons.</li>
              {test.timeLimit && <li>You have {test.timeLimit} minutes to complete this test.</li>}
              <li>Your answers are automatically saved as you progress.</li>
              <li>Click "Submit Test" when you're finished.</li>
            </ul>
          </div>

          <div className="flex justify-center">
            <button
              className="px-8 py-3 gradient-bg text-white rounded-md hover:opacity-90 disabled:opacity-50"
              onClick={handleStartTest}
              disabled={isStarting}
            >
              {isStarting ? "Starting Test..." : "Start Test"}
            </button>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default TestDetailPage;
