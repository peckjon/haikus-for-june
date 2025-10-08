// db.test.js
const db = require('./db');
const fs = require('fs');
const path = require('path');

// Use a separate test database
const TEST_DB_PATH = path.join(__dirname, 'test-haikus.db');

describe('Database Module', () => {
  beforeAll(() => {
    // Clean up any existing test database
    if (fs.existsSync(TEST_DB_PATH)) {
      fs.unlinkSync(TEST_DB_PATH);
    }
  });

  afterAll(() => {
    db.closeDb();
    // Clean up test database
    if (fs.existsSync(TEST_DB_PATH)) {
      fs.unlinkSync(TEST_DB_PATH);
    }
  });

  describe('getAllHaikus', () => {
    it('should return all haikus from the database', () => {
      const haikus = db.getAllHaikus();
      expect(Array.isArray(haikus)).toBe(true);
      expect(haikus.length).toBeGreaterThan(0);
      haikus.forEach(haiku => {
        expect(haiku).toHaveProperty('id');
        expect(haiku).toHaveProperty('text');
        expect(haiku).toHaveProperty('image');
      });
    });
  });

  describe('getHaikuById', () => {
    it('should return a specific haiku by id', () => {
      const haiku = db.getHaikuById(1);
      expect(haiku).toBeTruthy();
      expect(haiku).toHaveProperty('id', 1);
      expect(haiku).toHaveProperty('text');
      expect(haiku).toHaveProperty('image');
    });

    it('should return undefined for non-existent id', () => {
      const haiku = db.getHaikuById(9999);
      expect(haiku).toBeUndefined();
    });
  });

  describe('getRandomHaiku', () => {
    it('should return a random haiku', () => {
      const haiku = db.getRandomHaiku();
      expect(haiku).toBeTruthy();
      expect(haiku).toHaveProperty('id');
      expect(haiku).toHaveProperty('text');
      expect(haiku).toHaveProperty('image');
    });

    it('should return different haikus on multiple calls (probabilistic)', () => {
      // This test may occasionally fail due to randomness, but it's unlikely with 6 haikus
      const haikus = new Set();
      for (let i = 0; i < 20; i++) {
        const haiku = db.getRandomHaiku();
        haikus.add(haiku.id);
      }
      // With 6 haikus and 20 attempts, we should get at least 2 different haikus
      expect(haikus.size).toBeGreaterThanOrEqual(2);
    });
  });

  describe('getHaikusCount', () => {
    it('should return the correct count of haikus', () => {
      const count = db.getHaikusCount();
      expect(count).toBeGreaterThan(0);
      expect(typeof count).toBe('number');
      
      // Verify count matches actual haikus
      const allHaikus = db.getAllHaikus();
      expect(count).toBe(allHaikus.length);
    });
  });
});
