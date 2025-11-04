const Database = require('better-sqlite3');
const path = require('path');
const fs = require('fs');

// Database file path
const dbPath = path.join(__dirname, 'haikus.db');

// Initialize database connection
let db;
try {
  db = new Database(dbPath);
} catch (error) {
  console.error('Failed to initialize database:', error);
  throw error;
}

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
    // Check if haikus.json exists
    const haikusPath = path.join(__dirname, 'haikus.json');
    if (!fs.existsSync(haikusPath)) {
      console.error('haikus.json file not found. Cannot initialize database.');
      return;
    }
    
    // Load haikus from JSON file
    let haikus;
    try {
      haikus = require('./haikus.json');
    } catch (error) {
      console.error('Failed to load haikus.json:', error);
      return;
    }
    
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
  // Validate that id is a valid integer
  const numericId = parseInt(id, 10);
  if (isNaN(numericId)) {
    return undefined;
  }
  const stmt = db.prepare('SELECT * FROM haikus WHERE id = ?');
  return stmt.get(numericId);
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
  closeDatabase
};
