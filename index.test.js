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

describe('GET /random-subset', () => {
  it('should return HTML with a random subset of haikus', async () => {
    const response = await request(app).get('/random-subset');
    expect(response.status).toBe(200);
    expect(response.headers['content-type']).toMatch(/html/);
    const haikuCount = (response.text.match(/<div class="haiku-containers">/g) || []).length;
    expect(haikuCount).toBeGreaterThan(0);
    expect(haikuCount).toBeLessThanOrEqual(3);
  });

  it('should return HTML with the specified number of haikus', async () => {
    const count = 2;
    const response = await request(app).get(`/random-subset?count=${count}`);
    expect(response.status).toBe(200);
    expect(response.headers['content-type']).toMatch(/html/);
    const haikuCount = (response.text.match(/<div class="haiku-containers">/g) || []).length;
    expect(haikuCount).toBe(count);
  });

  it('should use the default value of 3 when count is not specified', async () => {
    const response = await request(app).get('/random-subset');
    expect(response.status).toBe(200);
    expect(response.headers['content-type']).toMatch(/html/);
    const haikuCount = (response.text.match(/<div class="haiku-containers">/g) || []).length;
    expect(haikuCount).toBe(3);
  });
});
