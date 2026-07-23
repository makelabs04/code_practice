CREATE DATABASE IF NOT EXISTS codecraft_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE codecraft_db;

CREATE TABLE users (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(120) NOT NULL,
  email VARCHAR(190) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE user_files (
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

CREATE TABLE code_executions (
  id VARCHAR(36) PRIMARY KEY,
  user_id BIGINT UNSIGNED NOT NULL,
  file_id VARCHAR(36) DEFAULT NULL,
  language VARCHAR(20) NOT NULL,
  source_code MEDIUMTEXT NOT NULL,
  stdin TEXT DEFAULT '', stdout MEDIUMTEXT DEFAULT '', stderr MEDIUMTEXT DEFAULT '',
  exit_code INT DEFAULT 0, execution_time INT DEFAULT 0, memory_used INT DEFAULT 0,
  status ENUM('completed','error','timeout','pending') DEFAULT 'pending',
  ip_address VARCHAR(45) DEFAULT NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_execution_user (user_id),
  INDEX idx_execution_file (file_id),
  INDEX idx_execution_created (created_at),
  CONSTRAINT fk_execution_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  CONSTRAINT fk_execution_file FOREIGN KEY (file_id) REFERENCES user_files(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
