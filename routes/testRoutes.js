const express = require('express');
const router = express.Router();

const TestController = require('../controllers/testController');
const TestResultController = require('../controllers/testResultController');

// Routes cho quản lý bài test
router.get('/tests', TestController.getAllTests);
router.get('/tests/:id', TestController.getTestById);
router.post('/tests/manual', TestController.createManualTest);
router.post('/tests/ai', TestController.createAiTest);
router.put('/tests/:id', TestController.updateTest);
router.post('/tests/:id/publish', TestController.publishTest);
router.delete('/tests/:id', TestController.deleteTest);

// Routes cho việc làm bài test
router.get('/tests/:id/start', TestResultController.startTest);
router.post('/test-results/:resultId/answers', TestResultController.saveAnswer);
router.post('/test-results/:resultId/submit', TestResultController.submitTest);

// Routes cho xem kết quả bài test
router.get('/users/:userId/test-results', TestResultController.getUserTestResults);
router.get('/test-results/:resultId', TestResultController.getTestResultDetail);

module.exports = router; 