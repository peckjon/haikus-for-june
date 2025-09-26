// database.test.js
const Database = require('./database/Database');
const fs = require('fs');

describe('Database', () => {
  let db;
  const testDbPath = './database/test_db_unit.db';

  beforeEach(async () => {
    // Clean up before each test
    if (fs.existsSync(testDbPath)) {
      fs.unlinkSync(testDbPath);
    }
    
    db = new Database(testDbPath);
    await db.init();
  });

  afterEach(async () => {
    if (db) {
      await db.close();
    }
    
    // Clean up test database file
    if (fs.existsSync(testDbPath)) {
      fs.unlinkSync(testDbPath);
    }
  });

  describe('Database initialization', () => {
    it('should create database and tables successfully', async () => {
      expect(db).toBeDefined();
      expect(fs.existsSync(testDbPath)).toBe(true);
    });
  });

  describe('insertHaiku', () => {
    it('should insert a haiku successfully', async () => {
      const result = await db.insertHaiku('Test haiku text\nSecond line\nThird line', 'test.jpg');
      
      expect(result).toBeDefined();
      expect(result.id).toBe(1);
      expect(result.text).toBe('Test haiku text\nSecond line\nThird line');
      expect(result.image).toBe('test.jpg');
    });

    it('should auto-increment IDs correctly', async () => {
      const haiku1 = await db.insertHaiku('First haiku', 'image1.jpg');
      const haiku2 = await db.insertHaiku('Second haiku', 'image2.jpg');
      
      expect(haiku1.id).toBe(1);
      expect(haiku2.id).toBe(2);
    });
  });

  describe('getAllHaikus', () => {
    it('should return empty array when no haikus exist', async () => {
      const haikus = await db.getAllHaikus();
      expect(haikus).toEqual([]);
    });

    it('should return all haikus ordered by id', async () => {
      await db.insertHaiku('First haiku', 'image1.jpg');
      await db.insertHaiku('Second haiku', 'image2.jpg');
      await db.insertHaiku('Third haiku', 'image3.jpg');
      
      const haikus = await db.getAllHaikus();
      
      expect(haikus).toHaveLength(3);
      expect(haikus[0].text).toBe('First haiku');
      expect(haikus[1].text).toBe('Second haiku');
      expect(haikus[2].text).toBe('Third haiku');
    });
  });

  describe('getHaikuById', () => {
    it('should return null for non-existent haiku', async () => {
      const haiku = await db.getHaikuById(999);
      expect(haiku).toBeUndefined();
    });

    it('should return specific haiku by id', async () => {
      const inserted = await db.insertHaiku('Test haiku', 'test.jpg');
      const retrieved = await db.getHaikuById(inserted.id);
      
      expect(retrieved).toBeDefined();
      expect(retrieved.text).toBe('Test haiku');
      expect(retrieved.image).toBe('test.jpg');
      expect(retrieved.id).toBe(inserted.id);
    });
  });

  describe('getRandomHaiku', () => {
    it('should return null when no haikus exist', async () => {
      const haiku = await db.getRandomHaiku();
      expect(haiku).toBeUndefined();
    });

    it('should return a random haiku when haikus exist', async () => {
      await db.insertHaiku('Haiku one', 'image1.jpg');
      await db.insertHaiku('Haiku two', 'image2.jpg');
      
      const randomHaiku = await db.getRandomHaiku();
      
      expect(randomHaiku).toBeDefined();
      expect(['Haiku one', 'Haiku two']).toContain(randomHaiku.text);
      expect(['image1.jpg', 'image2.jpg']).toContain(randomHaiku.image);
    });
  });
});