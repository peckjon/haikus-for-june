// index.sqlite.test.js
const request = require('supertest');
const app = require('./index');
const db = require('./db/database');
const fs = require('fs');
const path = require('path');

// Load the original haikus for reference in tests
const originalHaikus = JSON.parse(
  fs.readFileSync(path.join(__dirname, 'haikus.json'), 'utf8')
);

// Setup and teardown for tests
beforeAll(async () => {
  // Make sure database is initialized with test data
  const seedDatabase = require('./db/seed');
  await seedDatabase();
});

afterAll(async () => {
  // Close database connection after tests
  await db.closeDb();
});

describe('SQLite-backed API Tests', () => {
  describe('GET /', () => {
    it('should return HTML with all haikus', async () => {
      const response = await request(app).get('/');
      expect(response.status).toBe(200);
      expect(response.headers['content-type']).toMatch(/html/);
      
      // Check that all original haikus are present in the response
      for (const haiku of originalHaikus) {
        expect(response.text).toContain(haiku.text);
        expect(response.text).toContain(haiku.image);
      }
    });
  });

  describe('GET /:id', () => {
    it('should return HTML with the specific haiku', async () => {
      // Get the first haiku's ID from the database
      const haikus = await db.getAllHaikus();
      expect(haikus.length).toBeGreaterThan(0);
      
      const firstHaiku = haikus[0];
      const response = await request(app).get(`/${firstHaiku.id}`);
      
      expect(response.status).toBe(200);
      expect(response.headers['content-type']).toMatch(/html/);
      expect(response.text).toContain(firstHaiku.text);
      expect(response.text).toContain(firstHaiku.image);
    });

    it('should return 404 for non-existent haiku', async () => {
      // Use a very large ID that shouldn't exist
      const nonExistentId = 9999;
      const response = await request(app).get(`/${nonExistentId}`);
      expect(response.status).toBe(404);
    });
  });

  describe('GET /random', () => {
    it('should return a random haiku', async () => {
      const response = await request(app).get('/random');
      expect(response.status).toBe(200);
      expect(response.headers['content-type']).toMatch(/html/);
      
      // Verify that the response contains a haiku (text and image)
      const haikus = await db.getAllHaikus();
      let foundMatch = false;
      
      for (const haiku of haikus) {
        if (response.text.includes(haiku.text) && response.text.includes(haiku.image)) {
          foundMatch = true;
          break;
        }
      }
      
      expect(foundMatch).toBe(true);
    });
  });

  describe('POST /random', () => {
    it('should return a random haiku', async () => {
      const response = await request(app).post('/random');
      expect(response.status).toBe(200);
      expect(response.headers['content-type']).toMatch(/html/);
      
      // Verify that the response contains a haiku (text and image)
      const haikus = await db.getAllHaikus();
      let foundMatch = false;
      
      for (const haiku of haikus) {
        if (response.text.includes(haiku.text) && response.text.includes(haiku.image)) {
          foundMatch = true;
          break;
        }
      }
      
      expect(foundMatch).toBe(true);
    });
  });
});
