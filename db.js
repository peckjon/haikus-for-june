const Database = require('better-sqlite3');
const path = require('path');

// Database file path
const dbPath = path.join(__dirname, 'haikus.db');

// Initialize database connection with error handling
let db;
try {
  db = new Database(dbPath);
} catch (error) {
  console.error('Failed to initialize database:', error.message);
  throw error;
}

// Create haikus table if it doesn't exist
try {
  db.exec(`
    CREATE TABLE IF NOT EXISTS haikus (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      text TEXT NOT NULL,
      image TEXT NOT NULL
    )
  `);
} catch (error) {
  console.error('Failed to create haikus table:', error.message);
  throw error;
}

// Database operations
const getAllHaikus = () => {
  const stmt = db.prepare('SELECT * FROM haikus ORDER BY id');
  return stmt.all();
};

const getHaikuById = (id) => {
  const stmt = db.prepare('SELECT * FROM haikus WHERE id = ?');
  return stmt.get(id);
};

const getRandomHaiku = () => {
  const stmt = db.prepare('SELECT * FROM haikus ORDER BY RANDOM() LIMIT 1');
  return stmt.get();
};

const insertHaiku = (text, image) => {
  const stmt = db.prepare('INSERT INTO haikus (text, image) VALUES (?, ?)');
  return stmt.run(text, image);
};

const getHaikuCount = () => {
  const stmt = db.prepare('SELECT COUNT(*) as count FROM haikus');
  return stmt.get().count;
};

module.exports = {
  getAllHaikus,
  getHaikuById,
  getRandomHaiku,
  insertHaiku,
  getHaikuCount
};
