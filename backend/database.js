const path = require('path');
const Database = require('better-sqlite3');

const dbPath = '/app/data/local.db';
const db = new Database(dbPath);

db.exec(`
  CREATE TABLE IF NOT EXISTS plans (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id TEXT NOT NULL,
    committed INTEGER DEFAULT 0,
    committed_days TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  );
`);

module.exports = db;