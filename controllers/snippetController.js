// backend/controllers/snippetController.js
const SnippetModel = require('../models/SnippetModel');

class SnippetController {
  // POST /api/snippets
  static async create(req, res) {
    try {
      const { title, language, source_code, is_public } = req.body;
      if (!language || !source_code) {
        return res.status(400).json({ success: false, message: 'language and source_code required' });
      }
      const id = await SnippetModel.create({ title, language, source_code, is_public });
      return res.status(201).json({
        success: true,
        message: 'Snippet saved!',
        id,
        share_url: `/snippet/${id}`,
      });
    } catch (error) {
      return res.status(500).json({ success: false, message: error.message });
    }
  }

  // GET /api/snippets/:id
  static async getById(req, res) {
    try {
      const snippet = await SnippetModel.findById(req.params.id);
      if (!snippet) return res.status(404).json({ success: false, message: 'Snippet not found' });
      return res.json({ success: true, snippet });
    } catch (error) {
      return res.status(500).json({ success: false, message: error.message });
    }
  }

  // GET /api/snippets
  static async getPublic(req, res) {
    try {
      const snippets = await SnippetModel.getPublic(20);
      return res.json({ success: true, snippets });
    } catch (error) {
      return res.status(500).json({ success: false, message: error.message });
    }
  }
}

module.exports = SnippetController;