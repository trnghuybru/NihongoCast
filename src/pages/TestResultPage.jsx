"use client";

import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { testService } from "../services/api";
import Layout from "../components/Layout/Layout";
import ResultSummary from "../components/TestResults/ResultSummary";
import QuestionRenderer from "../components/Questions/QuestionRenderer";

const TestResultPage = () => {
  const { resultId } = useParams();
  const [result, setResult] = useState(null);
  const [test, setTest] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchResult = async () => {
      if (!resultId) return;

      try {
        // This is a mock implementation since we don't have the actual API
        // In a real app, you would fetch the result from the API
        const resultResponse = await fetch(`/api/test-results/${resultId}`);
        const resultData = await resultResponse.json();
        setResult(resultData);

        // Fetch the test associated with this result
        const testResponse = await testService.getTest(resultData.testId);
        setTest(testResponse);
      } catch (err) {
        console.error("Failed to fetch test result:", err);
        setError("Failed to load test result. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchResult();
  }, [resultId]);

  if (loading) {
    return (
      <Layout>
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading test result...</p>
        </div>
      </Layout>
    );
  }

  if (error || !result || !test) {
    return (
      <Layout>
        <div className="text-center py-8 text-red-500">{error || "Test result not found"}</div>
      </Layout>
    );
  }

  // Create a map of user answers for easy lookup
  const userAnswers = result.answers.reduce(
    (map, answer) => {
      map[answer.questionId] = answer.answer;
      return map;
    },
    {}
  );

  return (
    <Layout>
      <ResultSummary result={result} test={test} />

      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-bold mb-6">Question Review</h2>

        <div className="space-y-8">
          {test.questions.map((question, index) => (
            <div key={question.id}>
              <h3 className="text-lg font-medium mb-2">Question {index + 1}</h3>
              <QuestionRenderer
                question={question}
                onAnswer={() => {}} // No-op since we're in review mode
                userAnswer={userAnswers[question.id]}
                isReview={true}
              />
            </div>
          ))}
        </div>
      </div>
    </Layout>
  );
};

export default TestResultPage;
