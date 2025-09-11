// index.test.js
const request = require('supertest');
const express = require('express');
const app = require('./index');
const db = require('./database');

// Setup and teardown for tests
beforeAll(async () => {
  await db.initializeDatabase();
  await db.seedDatabase();
});

afterAll(async () => {
  db.closeDatabase();
});

describe('GET /', () => {
  it('should return HTML with all haikus', async () => {
    const response = await request(app).get('/');
    expect(response.status).toBe(200);
    expect(response.headers['content-type']).toMatch(/html/);
    
    // Get haikus from database to verify content
    const haikus = await db.getAllHaikus();
    haikus.forEach(haiku => {
      expect(response.text).toContain(haiku.text);
      expect(response.text).toContain(haiku.image);
    });
  });
});

describe('GET /:id', () => {
  it('should return HTML with the specific haiku', async () => {
    const haikuId = 1; // Using ID 1 since SQLite auto-increment starts at 1
    const response = await request(app).get(`/${haikuId}`);
    expect(response.status).toBe(200);
    expect(response.headers['content-type']).toMatch(/html/);
    
    // Get the specific haiku from database to verify content
    const haiku = await db.getHaikuById(haikuId);
    expect(response.text).toContain(haiku.text);
    expect(response.text).toContain(haiku.image);
  });

  it('should return 404 for non-existent haiku', async () => {
    const nonExistentId = 9999; // Very high ID that shouldn't exist
    const response = await request(app).get(`/${nonExistentId}`);
    expect(response.status).toBe(404);
  });

  it('should return 400 for invalid haiku ID', async () => {
    const invalidId = 'abc'; // Non-numeric ID
    const response = await request(app).get(`/${invalidId}`);
    expect(response.status).toBe(400);
  });
});