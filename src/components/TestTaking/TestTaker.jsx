"use client";

import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { testService } from "../../services/api";
import QuestionRenderer from "../Questions/QuestionRenderer";
import TestTimer from "./TestTimer";

const TestTaker = ({ test, resultId }) => {
  const navigate = useNavigate();
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(test.timeLimit ? test.timeLimit * 60 : null);

  const currentQuestion = test.questions[currentQuestionIndex];
  const totalQuestions = test.questions.length;

  useEffect(() => {
    const initialAnswers = {};
    test.questions.forEach((question) => {
      initialAnswers[question.id] = question.type === "drag-drop" ? [] : "";
    });
    setAnswers(initialAnswers);
  }, [test.questions]);

  const handleAnswer = (questionId, answer) => {
    setAnswers({
      ...answers,
      [questionId]: answer,
    });
  };

  const handleNext = () => {
    if (currentQuestionIndex < totalQuestions - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const handleJumpToQuestion = (index) => {
    setCurrentQuestionIndex(index);
  };

  const handleSubmit = async () => {
    const unansweredQuestions = test.questions.filter((question) => {
      const answer = answers[question.id];
      if (Array.isArray(answer)) {
        return answer.length === 0;
      }
      return !answer;
    });

    if (unansweredQuestions.length > 0) {
      const confirmSubmit = window.confirm(
        `You have ${unansweredQuestions.length} unanswered questions. Are you sure you want to submit?`
      );
      if (!confirmSubmit) {
        return;
      }
    }

    setIsSubmitting(true);

    try {
      const formattedAnswers = Object.entries(answers).map(([questionId, answer]) => ({
        questionId,
        answer,
      }));

      await testService.submitTestResult(resultId, formattedAnswers);
      navigate(`/test-results/${resultId}`);
    } catch (error) {
      console.error("Failed to submit test:", error);
      alert("Failed to submit test. Please try again.");
      setIsSubmitting(false);
    }
  };

  const handleTimeUp = () => {
    alert("Time is up! Your test will be submitted automatically.");
    handleSubmit();
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">{test.title}</h2>
        {timeRemaining !== null && <TestTimer initialTime={timeRemaining} onTimeUp={handleTimeUp} />}
      </div>

      <div className="mb-4 flex justify-between items-center">
        <div className="text-gray-600">
          Question {currentQuestionIndex + 1} of {totalQuestions}
        </div>
        <div className="flex space-x-2">
          {Array.from({ length: totalQuestions }).map((_, index) => (
            <button
              key={index}
              className={`w-8 h-8 rounded-full flex items-center justify-center ${
                index === currentQuestionIndex
                  ? "bg-orange-500 text-white"
                  : answers[test.questions[index].id]
                  ? "bg-green-100 text-green-800 border border-green-500"
                  : "bg-gray-100 text-gray-800 border border-gray-300"
              }`}
              onClick={() => handleJumpToQuestion(index)}
            >
              {index + 1}
            </button>
          ))}
        </div>
      </div>

      <div className="mb-6">
        <QuestionRenderer question={currentQuestion} onAnswer={handleAnswer} userAnswer={answers[currentQuestion.id]} />
      </div>

      <div className="flex justify-between">
        <button
          className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 disabled:opacity-50"
          onClick={handlePrevious}
          disabled={currentQuestionIndex === 0}
        >
          Previous
        </button>

        {currentQuestionIndex < totalQuestions - 1 ? (
          <button className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600" onClick={handleNext}>
            Next
          </button>
        ) : (
          <button
            className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 disabled:opacity-50"
            onClick={handleSubmit}
            disabled={isSubmitting}
          >
            {isSubmitting ? "Submitting..." : "Submit Test"}
          </button>
        )}
      </div>
    </div>
  );
};

export default TestTaker;
