const Database = require('better-sqlite3');
const path = require('path');

// Database file path
const dbPath = path.join(__dirname, 'haikus.db');

// Initialize database connection
const db = new Database(dbPath);

// Create haikus table if it doesn't exist
db.exec(`
  CREATE TABLE IF NOT EXISTS haikus (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    text TEXT NOT NULL,
    image TEXT NOT NULL
  )
`);

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
  getHaikuCount,
  db
};
