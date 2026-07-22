// backend/routes/snippetRoutes.js
const express = require('express');
const router = express.Router();
const requireAuth = require('../middleware/auth');
router.use(requireAuth);
const SnippetController = require('../controllers/snippetController');

// @route   POST /api/snippets
router.post('/', SnippetController.create);

// @route   GET /api/snippets
router.get('/', SnippetController.getPublic);

// @route   GET /api/snippets/:id
router.get('/:id', SnippetController.getById);

module.exports = router;