const UserFileModel = require('../models/UserFileModel');

class UserFileController {
  static async list(req, res) {
    try {
      const files = await UserFileModel.listByUser(req.user.id);
      return res.json({ success: true, files });
    } catch (error) {
      return res.status(500).json({ success: false, message: error.message });
    }
  }

  static async create(req, res) {
    try {
      const { file_name, language, source_code = '' } = req.body;
      if (!file_name || !language) {
        return res.status(400).json({ success: false, message: 'file_name and language are required' });
      }
      const file = await UserFileModel.upsertByName(req.user.id, { file_name, language, source_code });
      return res.status(201).json({ success: true, message: 'File saved successfully', file });
    } catch (error) {
      if (error.code === 'ER_DUP_ENTRY') {
        return res.status(409).json({ success: false, message: 'A file with this name already exists' });
      }
      return res.status(500).json({ success: false, message: error.message });
    }
  }

  static async update(req, res) {
    try {
      const { file_name, language, source_code = '' } = req.body;
      if (!file_name || !language) {
        return res.status(400).json({ success: false, message: 'file_name and language are required' });
      }
      const file = await UserFileModel.update(req.params.id, req.user.id, { file_name, language, source_code });
      if (!file) return res.status(404).json({ success: false, message: 'File not found' });
      return res.json({ success: true, message: 'File updated successfully', file });
    } catch (error) {
      if (error.code === 'ER_DUP_ENTRY') {
        return res.status(409).json({ success: false, message: 'A file with this name already exists' });
      }
      return res.status(500).json({ success: false, message: error.message });
    }
  }

  static async remove(req, res) {
    try {
      const removed = await UserFileModel.remove(req.params.id, req.user.id);
      if (!removed) return res.status(404).json({ success: false, message: 'File not found' });
      return res.json({ success: true, message: 'File deleted successfully' });
    } catch (error) {
      return res.status(500).json({ success: false, message: error.message });
    }
  }
}

module.exports = UserFileController;
