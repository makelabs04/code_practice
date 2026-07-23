// backend/routes/codeRoutes.js
const express = require('express');
const router = express.Router();
const requireAuth = require('../middleware/auth');
const optionalAuth = require('../middleware/optionalAuth');
const CodeController = require('../controllers/codeController');

// Public routes: guests can inspect languages and run temporary code.
router.get('/health', CodeController.health);
router.get('/languages', CodeController.getLanguages);
router.get('/languages/:id/default', CodeController.getDefaultCode);
router.post('/run', optionalAuth, CodeController.runCode);

// Personal statistics remain private.
router.get('/stats', requireAuth, CodeController.getStats);

module.exports = router;
