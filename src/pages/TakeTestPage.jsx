"use client";

import { useState, useEffect } from "react";
import { useParams, useLocation, Navigate } from "react-router-dom";
import { testService } from "../services/api";
import Layout from "../components/layout/Layout";
import TestTaker from "../components/TestTaking/TestTaker";

const TakeTestPage = () => {
  const { id } = useParams();
  const location = useLocation();
  const state = location.state;
  const [test, setTest] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [shouldRedirect, setShouldRedirect] = useState(false);

  useEffect(() => {
    if (!state?.resultId) {
      setShouldRedirect(true);
      return;
    }

    const fetchTest = async () => {
      if (!id) return;

      try {
        const data = await testService.getTest(id);
        console.log("IdId:", id); // Debugging line
        setTest(data);
      } catch (err) {
        console.error("Failed to fetch test:", err);
        setError("Failed to load test. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchTest();
  }, [id, state?.resultId]);

  // If no resultId is provided in the state, redirect to the test detail page
  if (shouldRedirect) {
    return <Navigate to={`/tests/${id}`} replace />;
  }

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
      <TestTaker test={test} resultId={state.resultId} />
    </Layout>
  );
};

export default TakeTestPage;
