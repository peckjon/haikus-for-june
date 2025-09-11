const sqlite3 = require('sqlite3').verbose();
const path = require('path');

// Database file path
const dbPath = path.join(__dirname, 'haikus.db');

// Initialize database connection
let db;

function initializeDatabase() {
  return new Promise((resolve, reject) => {
    db = new sqlite3.Database(dbPath, (err) => {
      if (err) {
        reject(err);
        return;
      }
      
      // Create haikus table if it doesn't exist
      db.run(`
        CREATE TABLE IF NOT EXISTS haikus (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          text TEXT NOT NULL,
          image TEXT NOT NULL
        )
      `, (err) => {
        if (err) {
          reject(err);
          return;
        }
        resolve();
      });
    });
  });
}

function getAllHaikus() {
  return new Promise((resolve, reject) => {
    db.all('SELECT * FROM haikus ORDER BY id', (err, rows) => {
      if (err) {
        reject(err);
        return;
      }
      resolve(rows);
    });
  });
}

function getHaikuById(id) {
  return new Promise((resolve, reject) => {
    db.get('SELECT * FROM haikus WHERE id = ?', [id], (err, row) => {
      if (err) {
        reject(err);
        return;
      }
      resolve(row);
    });
  });
}

function getHaikuCount() {
  return new Promise((resolve, reject) => {
    db.get('SELECT COUNT(*) as count FROM haikus', (err, row) => {
      if (err) {
        reject(err);
        return;
      }
      resolve(row.count);
    });
  });
}

function insertHaiku(text, image) {
  return new Promise((resolve, reject) => {
    db.run('INSERT INTO haikus (text, image) VALUES (?, ?)', [text, image], function(err) {
      if (err) {
        reject(err);
        return;
      }
      resolve(this.lastID);
    });
  });
}

function seedDatabase() {
  return new Promise((resolve, reject) => {
    // First check if we already have data
    getHaikuCount().then(count => {
      if (count > 0) {
        resolve(); // Already seeded
        return;
      }
      
      // Load original haikus.json data
      const haikus = require('./haikus.json');
      
      // Insert all haikus
      const insertPromises = haikus.map(haiku => insertHaiku(haiku.text, haiku.image));
      
      Promise.all(insertPromises)
        .then(() => resolve())
        .catch(reject);
    }).catch(reject);
  });
}

function closeDatabase() {
  if (db) {
    db.close();
  }
}

module.exports = {
  initializeDatabase,
  getAllHaikus,
  getHaikuById,
  getHaikuCount,
  insertHaiku,
  seedDatabase,
  closeDatabase
};