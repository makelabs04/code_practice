USE codecraft_db;
CREATE TABLE IF NOT EXISTS users (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(120) NOT NULL,
  email VARCHAR(190) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
ALTER TABLE snippets ADD COLUMN user_id BIGINT UNSIGNED NULL AFTER id;
ALTER TABLE code_executions ADD COLUMN user_id BIGINT UNSIGNED NULL AFTER id;
ALTER TABLE snippets ADD INDEX idx_snippet_user (user_id);
ALTER TABLE code_executions ADD INDEX idx_execution_user (user_id);
ALTER TABLE snippets ADD CONSTRAINT fk_snippet_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE;
ALTER TABLE code_executions ADD CONSTRAINT fk_execution_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE;
-- Existing rows remain NULL. After assigning ownership, make these columns NOT NULL if required.
