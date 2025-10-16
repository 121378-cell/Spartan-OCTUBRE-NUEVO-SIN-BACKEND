const path = require('path');
const Database = require('better-sqlite3');

const dbPath = path.resolve(__dirname, 'local.db');

// Initialize the database connection.
// For environments with file system restrictions, you can use an in-memory DB:
// const db = new Database(':memory:', { verbose: console.log });
const db = new Database(dbPath, { verbose: console.log });

/**
 * Sets up the database schema.
 * This function creates the 'plans' table if it doesn't already exist.
 * It's designed to be run once at application startup.
 */
function setupDatabase() {
  // Use a transaction for atomic operations.
  const setupStmt = db.prepare(`
    CREATE TABLE IF NOT EXISTS plans (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id TEXT NOT NULL,
      committed INTEGER DEFAULT 0,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `);

  try {
    setupStmt.run();
    console.log('Database schema is set up.');
  } catch (error) {
    console.error('Error setting up database schema:', error);
  }
}

// Run the setup function immediately when this module is loaded.
setupDatabase();

// Export the database connection instance for use in other modules.
module.exports = db;