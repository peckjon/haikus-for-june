const Database = require('better-sqlite3');
const path = require('path');

// Database path
const DB_PATH = path.join(__dirname, 'haikus.db');

// Initialize database connection
let db = null;

function getDb() {
  if (!db) {
    db = new Database(DB_PATH);
    initializeSchema();
  }
  return db;
}

// Initialize database schema
function initializeSchema() {
  const db = getDb();
  
  // Create haikus table if it doesn't exist
  db.exec(`
    CREATE TABLE IF NOT EXISTS haikus (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      text TEXT NOT NULL,
      image TEXT NOT NULL
    )
  `);
}

// Get all haikus
function getAllHaikus() {
  const db = getDb();
  const stmt = db.prepare('SELECT * FROM haikus ORDER BY id');
  return stmt.all();
}

// Get haiku by id
function getHaikuById(id) {
  const db = getDb();
  const stmt = db.prepare('SELECT * FROM haikus WHERE id = ?');
  return stmt.get(id);
}

// Get random haiku
function getRandomHaiku() {
  const db = getDb();
  const stmt = db.prepare('SELECT * FROM haikus ORDER BY RANDOM() LIMIT 1');
  return stmt.get();
}

// Add a haiku (for initial migration)
function addHaiku(text, image) {
  const db = getDb();
  const stmt = db.prepare('INSERT INTO haikus (text, image) VALUES (?, ?)');
  return stmt.run(text, image);
}

// Get count of haikus
function getHaikusCount() {
  const db = getDb();
  const stmt = db.prepare('SELECT COUNT(*) as count FROM haikus');
  return stmt.get().count;
}

// Close database connection
function closeDb() {
  if (db) {
    db.close();
    db = null;
  }
}

module.exports = {
  getDb,
  getAllHaikus,
  getHaikuById,
  getRandomHaiku,
  addHaiku,
  getHaikusCount,
  closeDb
};
