// backend/routes/codeRoutes.js
const express = require('express');
const router = express.Router();
const CodeController = require('../controllers/codeController');

// @route   POST /api/code/run
// @desc    Execute code
router.get('/health', CodeController.health);
router.post('/run', CodeController.runCode);

// @route   GET /api/code/languages
// @desc    Get all supported languages
router.get('/languages', CodeController.getLanguages);

// @route   GET /api/code/languages/:id/default
// @desc    Get default starter code for a language
router.get('/languages/:id/default', CodeController.getDefaultCode);

// @route   GET /api/code/stats
// @desc    Get execution statistics
router.get('/stats', CodeController.getStats);

module.exports = router;