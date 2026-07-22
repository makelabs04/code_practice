// backend/models/SnippetModel.js
const { pool } = require('../config/database');
const { v4: uuidv4 } = require('uuid');

class SnippetModel {
  static async create(data) {
    const id = uuidv4().substring(0, 8);
    const sql = `
      INSERT INTO snippets (id, user_id, title, language, source_code, is_public, created_at)
      VALUES (?, ?, ?, ?, ?, ?, NOW())
    `;
    const [result] = await pool.execute(sql, [
      id,
      data.user_id,
      data.title || 'Untitled Snippet',
      data.language,
      data.source_code,
      data.is_public !== false ? 1 : 0,
    ]);
    return id;
  }

  static async findById(id, userId) {
    const [rows] = await pool.execute(
      'SELECT * FROM snippets WHERE id = ? AND (user_id = ? OR is_public = 1)',
      [id, userId]
    );
    return rows[0] || null;
  }

  static async getPublic(userId, limit = 20) {
    const [rows] = await pool.execute(
      `SELECT id, title, language, LEFT(source_code, 150) as preview, created_at 
       FROM snippets WHERE user_id = ? ORDER BY created_at DESC LIMIT ?`,
      [userId, limit]
    );
    return rows;
  }
}

module.exports = SnippetModel;
