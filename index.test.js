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
  it('should return HTML with a random subset of haikus', async () => {
    const response = await request(app).get('/random');
    expect(response.status).toBe(200);
    expect(response.headers['content-type']).toMatch(/html/);
    
    // Should contain at least one haiku but not all haikus
    const haikuTexts = haikus.map(h => h.text);
    const matchingHaikus = haikuTexts.filter(text => response.text.includes(text));
    expect(matchingHaikus.length).toBeGreaterThan(0);
    expect(matchingHaikus.length).toBeLessThan(haikus.length);
  });

  it('should return a consistent subset size', async () => {
    const response = await request(app).get('/random');
    expect(response.status).toBe(200);
    
    // Count how many haiku images are in the response by looking for the img tags with class="june-images"
    const imgTags = response.text.match(/class="june-images"[^>]*src="images\/([^"]+)"/g) || [];
    const imageCount = imgTags.length;
    
    // Should be roughly half the total haikus (3 out of 6)
    const expectedSize = Math.max(1, Math.floor(haikus.length / 2));
    expect(imageCount).toBe(expectedSize);
  });
});