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

describe('GET /alpha', () => {
  it('should return HTML with all haikus sorted alphabetically', async () => {
    const response = await request(app).get('/alpha');
    expect(response.status).toBe(200);
    expect(response.headers['content-type']).toMatch(/html/);
    
    // Verify all haikus are present
    haikus.forEach(haiku => {
      expect(response.text).toContain(haiku.text);
      expect(response.text).toContain(haiku.image);
    });
    
    // Verify alphabetical order by checking the first haiku appears before the last
    const sortedHaikus = [...haikus].sort((a, b) => a.text.localeCompare(b.text));
    const firstHaikuIndex = response.text.indexOf(sortedHaikus[0].text);
    const lastHaikuIndex = response.text.indexOf(sortedHaikus[sortedHaikus.length - 1].text);
    expect(firstHaikuIndex).toBeLessThan(lastHaikuIndex);
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