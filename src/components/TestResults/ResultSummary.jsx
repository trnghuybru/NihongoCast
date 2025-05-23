import React from "react";

const ResultSummary = ({ result, test }) => {
  const percentage = Math.round((result.score / result.maxScore) * 100);

  const getGradeColor = () => {
    if (percentage >= 90) return "text-green-600";
    if (percentage >= 70) return "text-blue-600";
    if (percentage >= 60) return "text-yellow-600";
    return "text-red-600";
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString();
  };

  const calculateDuration = () => {
    if (!result.submittedAt) return "Not completed";

    const startTime = new Date(result.startedAt).getTime();
    const endTime = new Date(result.submittedAt).getTime();
    const durationMs = endTime - startTime;

    const minutes = Math.floor(durationMs / 60000);
    const seconds = Math.floor((durationMs % 60000) / 1000);

    return `${minutes} min ${seconds} sec`;
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
      <h2 className="text-2xl font-bold mb-4">Test Result Summary</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <h3 className="text-lg font-medium mb-3">Test Information</h3>
          <div className="space-y-2">
            <p>
              <span className="font-medium">Test:</span> {test.title}
            </p>
            <p>
              <span className="font-medium">Description:</span> {test.description}
            </p>
            <p>
              <span className="font-medium">Started:</span> {formatDate(result.startedAt)}
            </p>
            <p>
              <span className="font-medium">Submitted:</span>{" "}
              {result.submittedAt ? formatDate(result.submittedAt) : "Not submitted"}
            </p>
            <p>
              <span className="font-medium">Duration:</span> {calculateDuration()}
            </p>
          </div>
        </div>

        <div>
          <h3 className="text-lg font-medium mb-3">Score</h3>
          <div className="flex items-center mb-4">
            <div className={`text-5xl font-bold ${getGradeColor()}`}>{percentage}%</div>
            <div className="ml-4 text-gray-600">
              {result.score} / {result.maxScore} points
            </div>
          </div>

          <div className="w-full bg-gray-200 rounded-full h-4 mb-4">
            <div
              className={`h-4 rounded-full ${
                percentage >= 90
                  ? "bg-green-500"
                  : percentage >= 70
                  ? "bg-blue-500"
                  : percentage >= 60
                  ? "bg-yellow-500"
                  : "bg-red-500"
              }`}
              style={{ width: `${percentage}%` }}
            ></div>
          </div>

          <div className="text-gray-600">
            {percentage >= 90
              ? "Excellent! Great job!"
              : percentage >= 70
              ? "Good work!"
              : percentage >= 60
              ? "Passed. Keep practicing!"
              : "You need more practice. Try again!"}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResultSummary;
