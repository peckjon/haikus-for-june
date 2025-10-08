// index.test.js
const request = require('supertest');
const express = require('express');
const app = require('./index');
const { getAllHaikus } = require('./db');

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
    const haikus = getAllHaikus();
    const haikuId = haikus[0].id; // Use the first haiku's ID from database
    const response = await request(app).get(`/${haikuId}`);
    expect(response.status).toBe(200);
    expect(response.headers['content-type']).toMatch(/html/);
    expect(response.text).toContain(haikus[0].text);
    expect(response.text).toContain(haikus[0].image);
  });

  it('should return 404 for non-existent haiku', async () => {
    const response = await request(app).get('/999999'); // Use a non-existent ID
    expect(response.status).toBe(404);
  });
});