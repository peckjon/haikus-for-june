const sqlite3 = require('sqlite3').verbose();
const fs = require('fs');
const path = require('path');

class Database {
  constructor(dbPath = './database/haikus.db') {
    this.dbPath = dbPath;
    this.db = null;
  }

  async init() {
    return new Promise((resolve, reject) => {
      // Ensure database directory exists
      const dbDir = path.dirname(this.dbPath);
      if (!fs.existsSync(dbDir)) {
        fs.mkdirSync(dbDir, { recursive: true });
      }

      this.db = new sqlite3.Database(this.dbPath, (err) => {
        if (err) {
          reject(err);
        } else {
          this.createTables().then(resolve).catch(reject);
        }
      });
    });
  }

  async createTables() {
    return new Promise((resolve, reject) => {
      const schemaPath = path.join(__dirname, 'schema.sql');
      const schema = fs.readFileSync(schemaPath, 'utf8');
      
      this.db.exec(schema, (err) => {
        if (err) {
          reject(err);
        } else {
          resolve();
        }
      });
    });
  }

  async getAllHaikus() {
    return new Promise((resolve, reject) => {
      this.db.all('SELECT * FROM haikus ORDER BY id', (err, rows) => {
        if (err) {
          reject(err);
        } else {
          resolve(rows);
        }
      });
    });
  }

  async getHaikuById(id) {
    return new Promise((resolve, reject) => {
      this.db.get('SELECT * FROM haikus WHERE id = ?', [id], (err, row) => {
        if (err) {
          reject(err);
        } else {
          resolve(row);
        }
      });
    });
  }

  async getRandomHaiku() {
    return new Promise((resolve, reject) => {
      this.db.get('SELECT * FROM haikus ORDER BY RANDOM() LIMIT 1', (err, row) => {
        if (err) {
          reject(err);
        } else {
          resolve(row);
        }
      });
    });
  }

  async insertHaiku(text, image) {
    return new Promise((resolve, reject) => {
      this.db.run('INSERT INTO haikus (text, image) VALUES (?, ?)', [text, image], function(err) {
        if (err) {
          reject(err);
        } else {
          resolve({ id: this.lastID, text, image });
        }
      });
    });
  }

  async close() {
    return new Promise((resolve, reject) => {
      if (this.db) {
        this.db.close((err) => {
          if (err) {
            reject(err);
          } else {
            resolve();
          }
        });
      } else {
        resolve();
      }
    });
  }
}

module.exports = Database;