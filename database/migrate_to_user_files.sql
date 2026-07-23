-- Run this once on the existing database.
-- It creates user_files, migrates existing snippets, links future executions to files,
-- and removes the old snippets table.

START TRANSACTION;

CREATE TABLE IF NOT EXISTS user_files (
  id VARCHAR(36) PRIMARY KEY,
  user_id BIGINT UNSIGNED NOT NULL,
  file_name VARCHAR(255) NOT NULL,
  language VARCHAR(20) NOT NULL,
  source_code MEDIUMTEXT NOT NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  UNIQUE KEY unique_user_file_name (user_id, file_name),
  INDEX idx_user_files_user (user_id),
  INDEX idx_user_files_updated (updated_at),
  CONSTRAINT fk_user_files_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Migrate one latest snippet per user/title into user_files.
-- Duplicate old snippets with the same title are collapsed into one file.
INSERT INTO user_files (id, user_id, file_name, language, source_code, created_at, updated_at)
SELECT UUID(), s.user_id,
       CONCAT(
         COALESCE(NULLIF(s.title, ''), 'untitled'),
         CASE s.language
           WHEN 'python' THEN '.py' WHEN 'javascript' THEN '.js'
           WHEN 'typescript' THEN '.ts' WHEN 'java' THEN '.java'
           WHEN 'cpp' THEN '.cpp' WHEN 'c' THEN '.c'
           WHEN 'csharp' THEN '.cs' WHEN 'php' THEN '.php'
           WHEN 'ruby' THEN '.rb' WHEN 'go' THEN '.go'
           WHEN 'rust' THEN '.rs' WHEN 'kotlin' THEN '.kt'
           ELSE '.txt' END
       ) AS file_name,
       s.language, s.source_code, s.created_at, COALESCE(s.updated_at, s.created_at)
FROM snippets s
INNER JOIN (
  SELECT user_id, title, MAX(COALESCE(updated_at, created_at)) AS latest_time
  FROM snippets
  WHERE user_id IS NOT NULL
  GROUP BY user_id, title
) latest
  ON latest.user_id = s.user_id
 AND latest.title = s.title
 AND latest.latest_time = COALESCE(s.updated_at, s.created_at)
ON DUPLICATE KEY UPDATE
  language = VALUES(language),
  source_code = VALUES(source_code),
  updated_at = VALUES(updated_at);

ALTER TABLE code_executions
  ADD COLUMN file_id VARCHAR(36) NULL AFTER user_id,
  ADD INDEX idx_execution_file (file_id),
  ADD CONSTRAINT fk_execution_file FOREIGN KEY (file_id) REFERENCES user_files(id) ON DELETE SET NULL;

DROP TABLE snippets;

COMMIT;
