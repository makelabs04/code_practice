const { pool } = require('../config/database');
const { v4: uuidv4 } = require('uuid');

class UserFileModel {
  static async create(userId, data) {
    const id = uuidv4();
    await pool.execute(
      `INSERT INTO user_files
       (id, user_id, file_name, language, source_code, created_at, updated_at)
       VALUES (?, ?, ?, ?, ?, NOW(), NOW())`,
      [id, userId, data.file_name, data.language, data.source_code || '']
    );
    return this.findById(id, userId);
  }

  static async update(id, userId, data) {
    const [result] = await pool.execute(
      `UPDATE user_files
       SET file_name = ?, language = ?, source_code = ?, updated_at = NOW()
       WHERE id = ? AND user_id = ?`,
      [data.file_name, data.language, data.source_code || '', id, userId]
    );
    if (result.affectedRows === 0) return null;
    return this.findById(id, userId);
  }

  static async upsertByName(userId, data) {
    const [rows] = await pool.execute(
      'SELECT id FROM user_files WHERE user_id = ? AND file_name = ? LIMIT 1',
      [userId, data.file_name]
    );
    if (rows[0]) return this.update(rows[0].id, userId, data);
    return this.create(userId, data);
  }

  static async findById(id, userId) {
    const [rows] = await pool.execute(
      'SELECT * FROM user_files WHERE id = ? AND user_id = ? LIMIT 1',
      [id, userId]
    );
    return rows[0] || null;
  }

  static async listByUser(userId) {
    const [rows] = await pool.execute(
      `SELECT id, file_name, language, source_code, created_at, updated_at
       FROM user_files WHERE user_id = ? ORDER BY updated_at DESC, created_at DESC`,
      [userId]
    );
    return rows;
  }

  static async remove(id, userId) {
    const [result] = await pool.execute(
      'DELETE FROM user_files WHERE id = ? AND user_id = ?',
      [id, userId]
    );
    return result.affectedRows > 0;
  }
}

module.exports = UserFileModel;
