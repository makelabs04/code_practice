// backend/models/ExecutionModel.js
const { pool } = require('../config/database');
const { v4: uuidv4 } = require('uuid');

class ExecutionModel {
  static async saveExecution(data) {
    try {
      const id = uuidv4();
      const sql = `
        INSERT INTO code_executions 
        (id, language, source_code, stdin, stdout, stderr, exit_code, execution_time, memory_used, status, created_at)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW())
      `;
      const values = [
        id,
        data.language,
        data.source_code,
        data.stdin || '',
        data.stdout || '',
        data.stderr || '',
        data.exit_code || 0,
        data.execution_time || 0,
        data.memory_used || 0,
        data.status || 'completed',
      ];
      await pool.execute(sql, values);
      return id;
    } catch (error) {
      console.error('Error saving execution:', error.message);
      return null;
    }
  }

  static async getRecentExecutions(limit = 10) {
    try {
      const [rows] = await pool.execute(
        `SELECT id, language, LEFT(source_code, 100) as code_preview, status, execution_time, created_at 
         FROM code_executions ORDER BY created_at DESC LIMIT ?`,
        [limit]
      );
      return rows;
    } catch (error) {
      console.error('Error fetching executions:', error.message);
      return [];
    }
  }

  static async getStats() {
    try {
      const [rows] = await pool.execute(`
        SELECT 
          language,
          COUNT(*) as total_runs,
          AVG(execution_time) as avg_time,
          SUM(CASE WHEN status = 'completed' THEN 1 ELSE 0 END) as successful
        FROM code_executions
        GROUP BY language
      `);
      return rows;
    } catch (error) {
      console.error('Error fetching stats:', error.message);
      return [];
    }
  }
}

module.exports = ExecutionModel;