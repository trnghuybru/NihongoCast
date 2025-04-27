const express = require('express');
const testRoutes = require('./testRoutes');

const router = express.Router();

// Gắn các routes con vào router chính
router.use('/tests', testRoutes);

module.exports = router; 