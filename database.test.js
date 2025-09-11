// database.test.js
const sqlite3 = require('sqlite3').verbose();
const fs = require('fs');
const path = require('path');

// Create a separate database module for testing
class TestDatabase {
  constructor() {
    this.dbPath = path.join(__dirname, 'test-haikus.db');
    this.db = null;
  }

  initializeDatabase() {
    return new Promise((resolve, reject) => {
      this.db = new sqlite3.Database(this.dbPath, (err) => {
        if (err) {
          reject(err);
          return;
        }
        
        // Create haikus table if it doesn't exist
        this.db.run(`
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

  getAllHaikus() {
    return new Promise((resolve, reject) => {
      this.db.all('SELECT * FROM haikus ORDER BY id', (err, rows) => {
        if (err) {
          reject(err);
          return;
        }
        resolve(rows);
      });
    });
  }

  getHaikuById(id) {
    return new Promise((resolve, reject) => {
      this.db.get('SELECT * FROM haikus WHERE id = ?', [id], (err, row) => {
        if (err) {
          reject(err);
          return;
        }
        resolve(row);
      });
    });
  }

  getHaikuCount() {
    return new Promise((resolve, reject) => {
      this.db.get('SELECT COUNT(*) as count FROM haikus', (err, row) => {
        if (err) {
          reject(err);
          return;
        }
        resolve(row.count);
      });
    });
  }

  insertHaiku(text, image) {
    return new Promise((resolve, reject) => {
      this.db.run('INSERT INTO haikus (text, image) VALUES (?, ?)', [text, image], function(err) {
        if (err) {
          reject(err);
          return;
        }
        resolve(this.lastID);
      });
    });
  }

  seedDatabase() {
    return new Promise((resolve, reject) => {
      // First check if we already have data
      this.getHaikuCount().then(count => {
        if (count > 0) {
          resolve(); // Already seeded
          return;
        }
        
        // Load original haikus.json data
        const haikus = require('./haikus.json');
        
        // Insert all haikus
        const insertPromises = haikus.map(haiku => this.insertHaiku(haiku.text, haiku.image));
        
        Promise.all(insertPromises)
          .then(() => resolve())
          .catch(reject);
      }).catch(reject);
    });
  }

  closeDatabase() {
    if (this.db) {
      this.db.close();
    }
  }

  cleanup() {
    this.closeDatabase();
    if (fs.existsSync(this.dbPath)) {
      fs.unlinkSync(this.dbPath);
    }
  }
}

describe('Database Operations', () => {
  let testDb;

  beforeEach(async () => {
    testDb = new TestDatabase();
    await testDb.initializeDatabase();
  });

  afterEach(() => {
    testDb.cleanup();
  });

  describe('initializeDatabase', () => {
    it('should initialize database successfully', async () => {
      // Database is already initialized in beforeEach
      // Test that we can perform operations without error
      const count = await testDb.getHaikuCount();
      expect(typeof count).toBe('number');
    });
  });

  describe('seedDatabase', () => {
    it('should seed database with haikus from JSON file', async () => {
      await testDb.seedDatabase();
      const count = await testDb.getHaikuCount();
      expect(count).toBeGreaterThan(0);
      
      const haikus = await testDb.getAllHaikus();
      expect(haikus).toHaveProperty('length', count);
    });

    it('should not seed database twice', async () => {
      await testDb.seedDatabase();
      const countAfterFirstSeed = await testDb.getHaikuCount();
      
      await testDb.seedDatabase(); // Try to seed again
      const countAfterSecondSeed = await testDb.getHaikuCount();
      
      expect(countAfterFirstSeed).toBe(countAfterSecondSeed);
    });
  });

  describe('getAllHaikus', () => {
    it('should return empty array when no haikus exist', async () => {
      const haikus = await testDb.getAllHaikus();
      expect(haikus).toEqual([]);
    });

    it('should return all haikus when they exist', async () => {
      await testDb.seedDatabase();
      const haikus = await testDb.getAllHaikus();
      expect(haikus.length).toBeGreaterThan(0);
      haikus.forEach(haiku => {
        expect(haiku).toHaveProperty('id');
        expect(haiku).toHaveProperty('text');
        expect(haiku).toHaveProperty('image');
      });
    });
  });

  describe('getHaikuById', () => {
    it('should return undefined for non-existent haiku', async () => {
      const haiku = await testDb.getHaikuById(9999);
      expect(haiku).toBeUndefined();
    });

    it('should return haiku for existing ID', async () => {
      await testDb.seedDatabase();
      const allHaikus = await testDb.getAllHaikus();
      const firstHaiku = allHaikus[0];
      
      const retrievedHaiku = await testDb.getHaikuById(firstHaiku.id);
      expect(retrievedHaiku).toEqual(firstHaiku);
    });
  });

  describe('insertHaiku', () => {
    it('should insert a new haiku and return the ID', async () => {
      const text = 'Test haiku text\nSecond line here\nThird line complete';
      const image = 'test.jpg';
      
      const id = await testDb.insertHaiku(text, image);
      expect(typeof id).toBe('number');
      expect(id).toBeGreaterThan(0);
      
      const insertedHaiku = await testDb.getHaikuById(id);
      expect(insertedHaiku.text).toBe(text);
      expect(insertedHaiku.image).toBe(image);
    });
  });

  describe('getHaikuCount', () => {
    it('should return 0 when no haikus exist', async () => {
      const count = await testDb.getHaikuCount();
      expect(count).toBe(0);
    });

    it('should return correct count after seeding', async () => {
      await testDb.seedDatabase();
      const count = await testDb.getHaikuCount();
      expect(count).toBeGreaterThan(0);
      
      // Add one more haiku
      await testDb.insertHaiku('New haiku\nWith three lines\nFor testing', 'new.jpg');
      const newCount = await testDb.getHaikuCount();
      expect(newCount).toBe(count + 1);
    });
  });
});