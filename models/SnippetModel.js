// backend/models/SnippetModel.js
const { pool } = require('../config/database');
const { v4: uuidv4 } = require('uuid');

class SnippetModel {
  static async create(data) {
    const id = uuidv4().substring(0, 8);
    const sql = `
      INSERT INTO codecraft_db.snippets (id, title, language, source_code, is_public, created_at)
      VALUES (?, ?, ?, ?, ?, NOW())
    `;
    const [result] = await pool.execute(sql, [
      id,
      data.title || 'Untitled Snippet',
      data.language,
      data.source_code,
      data.is_public !== false ? 1 : 0,
    ]);
    return id;
  }

  static async findById(id) {
    const [rows] = await pool.execute(
      'SELECT * FROM snippets WHERE id = ?',
      [id]
    );
    return rows[0] || null;
  }

  static async getPublic(limit = 20) {
    const [rows] = await pool.execute(
      `SELECT id, title, language, LEFT(source_code, 150) as preview, created_at 
       FROM snippets WHERE is_public = 1 ORDER BY created_at DESC LIMIT ?`,
      [limit]
    );
    return rows;
  }
}

module.exports = SnippetModel;