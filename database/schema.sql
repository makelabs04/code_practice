-- ================================================================
-- CodeCraft Online Coding Platform - Database Schema
-- Import this file using phpMyAdmin or MySQL CLI:
--   mysql -u root -p < schema.sql
-- ================================================================

CREATE DATABASE IF NOT EXISTS codecraft_db
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE codecraft_db;

-- ── Code Executions Log ──────────────────────────────────────────
CREATE TABLE IF NOT EXISTS code_executions (
  id              VARCHAR(36)   PRIMARY KEY,
  language        VARCHAR(20)   NOT NULL,
  source_code     MEDIUMTEXT    NOT NULL,
  stdin           TEXT          DEFAULT '',
  stdout          MEDIUMTEXT    DEFAULT '',
  stderr          MEDIUMTEXT    DEFAULT '',
  exit_code       INT           DEFAULT 0,
  execution_time  INT           DEFAULT 0 COMMENT 'milliseconds',
  memory_used     INT           DEFAULT 0 COMMENT 'bytes',
  status          ENUM('completed','error','timeout','pending') DEFAULT 'pending',
  ip_address      VARCHAR(45)   DEFAULT NULL,
  created_at      DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_language    (language),
  INDEX idx_status      (status),
  INDEX idx_created_at  (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ── Saved Snippets ───────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS snippets (
  id              VARCHAR(8)    PRIMARY KEY,
  title           VARCHAR(200)  DEFAULT 'Untitled Snippet',
  language        VARCHAR(20)   NOT NULL,
  source_code     MEDIUMTEXT    NOT NULL,
  is_public       TINYINT(1)    DEFAULT 1,
  view_count      INT           DEFAULT 0,
  created_at      DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at      DATETIME      ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_language    (language),
  INDEX idx_is_public   (is_public),
  INDEX idx_created_at  (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
-- ── Language Stats View ──────────────────────────────────────────
CREATE OR REPLACE VIEW language_stats AS
SELECT
  language,
  COUNT(*)                                              AS total_runs,
  SUM(CASE WHEN status = 'completed' THEN 1 ELSE 0 END) AS successful_runs,
  SUM(CASE WHEN status = 'error'     THEN 1 ELSE 0 END) AS error_runs,
  ROUND(AVG(execution_time), 2)                          AS avg_execution_ms,
  MAX(created_at)                                        AS last_run_at
FROM code_executions
GROUP BY language;

-- ── Seed Sample Snippets ─────────────────────────────────────────
INSERT IGNORE INTO snippets (id, title, language, source_code, is_public) VALUES
('py_hello', 'Python Hello World', 'python',
'print("Hello, World!")\n\nfor i in range(1, 6):\n    print(f"Count: {i}")', 1),
('java_fb',  'Java FizzBuzz',      'java',
'public class Main {\n    public static void main(String[] args) {\n        for (int i = 1; i <= 20; i++) {\n            if (i % 15 == 0) System.out.println("FizzBuzz");\n            else if (i % 3 == 0) System.out.println("Fizz");\n            else if (i % 5 == 0) System.out.println("Buzz");\n            else System.out.println(i);\n        }\n    }\n}', 1),
('js_arr',  'JS Array Methods',    'javascript',
'const nums = [1,2,3,4,5];\nconst evens = nums.filter(n => n % 2 === 0);\nconst doubled = evens.map(n => n * 2);\nconsole.log(doubled);', 1);