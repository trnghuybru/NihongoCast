import axios from "axios";

const API_BASE_URL = "/module2-api";

// Test management APIs
export const fetchTests = async () => {
  const response = await axios.get(`${API_BASE_URL}/tests`);
  return response.data;
};

export const createManualTest = async (testData) => {
  const response = await axios.post(`${API_BASE_URL}/tests/manual`, testData);
  return response.data;
};

export const createAITest = async (testData) => {
  const response = await axios.post(`${API_BASE_URL}/tests/ai`, testData);
  return response.data;
};

export const updateTest = async (testId, testData) => {
  const response = await axios.put(`${API_BASE_URL}/tests/${testId}`, testData);
  return response.data;
};

export const deleteTest = async (testId) => {
  const response = await axios.delete(`${API_BASE_URL}/tests/${testId}`);
  return response.data;
};

export const publishTest = async (testId) => {
  const response = await axios.post(`${API_BASE_URL}/tests/${testId}/publish`);
  return response.data;
};

// Test taking APIs
export const startTest = async (testId) => {
  const response = await axios.post(`${API_BASE_URL}/tests/${testId}/start`);
  return response.data;
};

export const submitTestResult = async (resultId, answers) => {
  const response = await axios.post(`${API_BASE_URL}/test-results/${resultId}/submit`, { answers });
  return response.data;
};

// Test results APIs
export const fetchTestResult = async (resultId) => {
  const response = await axios.get(`${API_BASE_URL}/test-results/${resultId}`);
  return response.data;
};

export const fetchUserTestResults = async (userId) => {
  const response = await axios.get(`${API_BASE_URL}/users/${userId}/test-results`);
  return response.data;
};
