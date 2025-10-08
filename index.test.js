// index.test.js
const request = require('supertest');
const express = require('express');
const app = require('./index');
const db = require('./db');

describe('GET /', () => {
  it('should return HTML with all haikus', async () => {
    const haikus = db.getAllHaikus();
    const response = await request(app).get('/');
    expect(response.status).toBe(200);
    expect(response.headers['content-type']).toMatch(/html/);
    haikus.forEach(haiku => {
      expect(response.text).toContain(haiku.text);
      expect(response.text).toContain(haiku.image);
    });
  });
});

describe('GET /:id', () => {
  it('should return HTML with the specific haiku', async () => {
    const haikuId = 0; // Assuming we have at least one haiku (0-based for backward compatibility)
    const haiku = db.getHaikuById(haikuId + 1); // Convert to 1-based database ID
    const response = await request(app).get(`/${haikuId}`);
    expect(response.status).toBe(200);
    expect(response.headers['content-type']).toMatch(/html/);
    expect(response.text).toContain(haiku.text);
    expect(response.text).toContain(haiku.image);
  });

  it('should return 404 for non-existent haiku', async () => {
    const nonExistentId = 9999; // ID that definitely doesn't exist
    const response = await request(app).get(`/${nonExistentId}`);
    expect(response.status).toBe(404);
  });
});

// Clean up database connection after tests
afterAll(() => {
  db.closeDb();
});