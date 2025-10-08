const Database = require('better-sqlite3');
const path = require('path');

// Database file path
const dbPath = path.join(__dirname, 'haikus.db');

// Initialize database connection
const db = new Database(dbPath);

// Create haikus table if it doesn't exist
const createTable = () => {
  const createTableSQL = `
    CREATE TABLE IF NOT EXISTS haikus (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      text TEXT NOT NULL,
      image TEXT NOT NULL
    )
  `;
  db.prepare(createTableSQL).run();
};

// Initialize database with data from haikus.json
const initializeDatabase = () => {
  createTable();
  
  // Check if table is already populated
  const count = db.prepare('SELECT COUNT(*) as count FROM haikus').get();
  if (count.count === 0) {
    // Load haikus from JSON file
    const haikus = require('./haikus.json');
    const insertStmt = db.prepare('INSERT INTO haikus (text, image) VALUES (?, ?)');
    
    // Insert all haikus
    const insertMany = db.transaction((haikus) => {
      for (const haiku of haikus) {
        insertStmt.run(haiku.text, haiku.image);
      }
    });
    
    insertMany(haikus);
  }
};

// Get all haikus
const getAllHaikus = () => {
  const stmt = db.prepare('SELECT * FROM haikus ORDER BY id');
  return stmt.all();
};

// Get haiku by ID
const getHaikuById = (id) => {
  const stmt = db.prepare('SELECT * FROM haikus WHERE id = ?');
  return stmt.get(id);
};

// Get random haiku
const getRandomHaiku = () => {
  const stmt = db.prepare('SELECT * FROM haikus ORDER BY RANDOM() LIMIT 1');
  return stmt.get();
};

// Get count of haikus
const getHaikusCount = () => {
  const stmt = db.prepare('SELECT COUNT(*) as count FROM haikus');
  return stmt.get().count;
};

// Close database connection
const closeDatabase = () => {
  db.close();
};

// Initialize database on module load
initializeDatabase();

module.exports = {
  getAllHaikus,
  getHaikuById,
  getRandomHaiku,
  getHaikusCount,
  closeDatabase,
  db // Export for testing purposes
};
