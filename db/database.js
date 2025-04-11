const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const fs = require('fs');

// Ensure the db directory exists
const dbDir = path.join(__dirname);
if (!fs.existsSync(dbDir)) {
  fs.mkdirSync(dbDir, { recursive: true });
}

// Database path
const dbPath = path.join(dbDir, 'haikus.sqlite');
console.log(`SQLite database path: ${dbPath}`);

// Create and initialize database connection
let db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Error opening database', err.message);
    throw err;
  } else {
    console.log('Connected to the SQLite database.');
    // Initialize database schema
    db.serialize(() => {
      db.run(`CREATE TABLE IF NOT EXISTS haikus (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        text TEXT NOT NULL,
        image TEXT NOT NULL
      )`, (err) => {
        if (err) {
          console.error('Error creating table:', err.message);
        } else {
          console.log('Haikus table created or already exists.');
        }
      });
    });
  }
});

// Methods to interact with the database
const dbMethods = {
  // Get all haikus
  getAllHaikus: () => {
    return new Promise((resolve, reject) => {
      db.all('SELECT * FROM haikus', [], (err, rows) => {
        if (err) {
          console.error('Error getting all haikus:', err);
          reject(err);
        } else {
          resolve(rows);
        }
      });
    });
  },

  // Get haiku by id
  getHaikuById: (id) => {
    return new Promise((resolve, reject) => {
      db.get('SELECT * FROM haikus WHERE id = ?', [id], (err, row) => {
        if (err) {
          console.error(`Error getting haiku by id ${id}:`, err);
          reject(err);
        } else {
          resolve(row);
        }
      });
    });
  },

  // Get random haiku
  getRandomHaiku: () => {
    return new Promise((resolve, reject) => {
      db.get('SELECT * FROM haikus ORDER BY RANDOM() LIMIT 1', [], (err, row) => {
        if (err) {
          console.error('Error getting random haiku:', err);
          reject(err);
        } else {
          resolve(row);
        }
      });
    });
  },

  // Add a haiku
  addHaiku: (text, image) => {
    return new Promise((resolve, reject) => {
      db.run('INSERT INTO haikus (text, image) VALUES (?, ?)', [text, image], function(err) {
        if (err) {
          console.error('Error adding haiku:', err);
          reject(err);
        } else {
          resolve({ id: this.lastID, text, image });
        }
      });
    });
  },

  // Count haikus in database
  countHaikus: () => {
    return new Promise((resolve, reject) => {
      db.get('SELECT COUNT(*) as count FROM haikus', [], (err, row) => {
        if (err) {
          console.error('Error counting haikus:', err);
          reject(err);
        } else {
          resolve(row.count);
        }
      });
    });
  },

  // Close database connection
  closeDb: () => {
    return new Promise((resolve, reject) => {
      db.close((err) => {
        if (err) {
          console.error('Error closing database', err.message);
          reject(err);
        } else {
          console.log('Database connection closed.');
          resolve();
        }
      });
    });
  }
};

// Remove the initializeDb function as we now do this inline
module.exports = dbMethods;
