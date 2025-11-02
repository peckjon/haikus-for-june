// index.test.js
const request = require('supertest');
const express = require('express');
const app = require('./index');
const haikus = require('./haikus.json');

describe('GET /', () => {
  it('should return HTML with all haikus', async () => {
    const response = await request(app).get('/');
    expect(response.status).toBe(200);
    expect(response.headers['content-type']).toMatch(/html/);
    haikus.forEach(haiku => {
      expect(response.text).toContain(haiku.text);
      expect(response.text).toContain(haiku.image);
    });
  });

  it('should include GitHub login button', async () => {
    const response = await request(app).get('/');
    expect(response.status).toBe(200);
    expect(response.text).toContain('Login with GitHub');
    expect(response.text).toContain('github.com/login/oauth/authorize');
  });

  it('should include Random Haiku button', async () => {
    const response = await request(app).get('/');
    expect(response.status).toBe(200);
    expect(response.text).toContain('Random Haiku');
    expect(response.text).toContain('href="/random"');
  });
});

describe('GET /:id', () => {
  it('should return HTML with the specific haiku', async () => {
    const haikuId = 0; // Assuming we have at least one haiku
    const response = await request(app).get(`/${haikuId}`);
    expect(response.status).toBe(200);
    expect(response.headers['content-type']).toMatch(/html/);
    expect(response.text).toContain(haikus[haikuId].text);
    expect(response.text).toContain(haikus[haikuId].image);
  });

  it('should return 404 for non-existent haiku', async () => {
    const nonExistentId = haikus.length; // Out of bounds index
    const response = await request(app).get(`/${nonExistentId}`);
    expect(response.status).toBe(404);
  });
});

describe('GET /random', () => {
  it('should return HTML with a single random haiku', async () => {
    const response = await request(app).get('/random');
    expect(response.status).toBe(200);
    expect(response.headers['content-type']).toMatch(/html/);
    
    // Check that the response contains one of the haikus
    let foundHaiku = false;
    haikus.forEach(haiku => {
      if (response.text.includes(haiku.text) && response.text.includes(haiku.image)) {
        foundHaiku = true;
      }
    });
    expect(foundHaiku).toBe(true);
  });
});