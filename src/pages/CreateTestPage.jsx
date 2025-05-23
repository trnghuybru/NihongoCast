"use client";

import { useParams, Navigate } from "react-router-dom";
import Layout from "../components/layout/Layout";
import TestCreationForm from "../components/TestCreation/TestCreationForm";
import AITestForm from "../components/TestCreation/AITestForm";

const CreateTestPage = () => {
  const { type } = useParams();

  // Validate the type parameter
  if (type !== "manual" && type !== "ai") {
    return <Navigate to="/tests/create/manual" replace />;
  }

  return (
    <Layout>
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">
          {type === "manual" ? "Create Manual Test" : "Create AI-Generated Test"}
        </h1>
        <p className="text-gray-600">
          {type === "manual"
            ? "Create a test by manually adding questions and answers."
            : "Let AI generate questions from your learning materials."}
        </p>
      </div>

      <div className="mb-6">
        <div className="flex border-b">
          <a
            href="/tests/create/manual"
            className={`py-2 px-4 ${type === "manual"
              ? "border-b-2 border-orange-500 text-orange-500 font-medium"
              : "text-gray-500 hover:text-gray-700"}`}
          >
            Manual Test
          </a>
          <a
            href="/tests/create/ai"
            className={`py-2 px-4 ${type === "ai"
              ? "border-b-2 border-orange-500 text-orange-500 font-medium"
              : "text-gray-500 hover:text-gray-700"}`}
          >
            AI-Generated Test
          </a>
        </div>
      </div>

      {type === "manual" ? <TestCreationForm /> : <AITestForm />}
    </Layout>
  );
};

export default CreateTestPage;
