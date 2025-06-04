// index.test.js
const request = require('supertest');
const express = require('express');
const app = require('./index');
const haikus = require('./haikus.json');

describe('POST /', () => {
  it('should return HTML with all haikus', async () => {
    const response = await request(app).post('/');
    expect(response.status).toBe(201);
    expect(response.headers['content-type']).toMatch(/html/);
    haikus.forEach(haiku => {
      expect(response.text).toContain(haiku.text);
      expect(response.text).toContain(haiku.image);
    });
  });
});

describe('POST /:id', () => {
  it('should return HTML with the specific haiku', async () => {
    const haikuId = 0; // Assuming we have at least one haiku
    const response = await request(app).post(`/${haikuId}`);
    expect(response.status).toBe(201);
    expect(response.headers['content-type']).toMatch(/html/);
    expect(response.text).toContain(haikus[haikuId].text);
    expect(response.text).toContain(haikus[haikuId].image);
  });

  it('should return 404 for non-existent haiku', async () => {
    const nonExistentId = haikus.length; // Out of bounds index
    const response = await request(app).post(`/${nonExistentId}`);
    expect(response.status).toBe(404);
  });
});