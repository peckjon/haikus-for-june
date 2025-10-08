// index.test.js
const request = require('supertest');
const express = require('express');
const app = require('./index');
const { getAllHaikus, getHaikuById, getHaikusCount } = require('./db');

describe('GET /', () => {
  it('should return HTML with all haikus', async () => {
    const haikus = getAllHaikus();
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
    const haikuId = 1; // SQLite auto-increment starts at 1
    const haiku = getHaikuById(haikuId);
    const response = await request(app).get(`/${haikuId}`);
    expect(response.status).toBe(200);
    expect(response.headers['content-type']).toMatch(/html/);
    expect(response.text).toContain(haiku.text);
    expect(response.text).toContain(haiku.image);
  });

  it('should return 404 for non-existent haiku', async () => {
    const nonExistentId = 9999; // ID that doesn't exist
    const response = await request(app).get(`/${nonExistentId}`);
    expect(response.status).toBe(404);
  });
});