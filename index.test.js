// index.test.js
const request = require('supertest');
const express = require('express');
const Database = require('./database/Database');

// Set test environment
process.env.NODE_ENV = 'test';

const app = require('./index');

let db;

beforeAll(async () => {
  // Use a test database
  db = new Database('./database/test_haikus.db');
  await db.init();
  
  // Insert test data
  await db.insertHaiku('Test haiku one\nSecond line here\nThird line complete', 'test1.jpg');
  await db.insertHaiku('Another test poem\nWith beautiful imagery\nNature speaks to us', 'test2.jpg');
});

afterAll(async () => {
  if (db) {
    await db.close();
  }
  
  // Clean up test database file
  const fs = require('fs');
  const testDbPath = './database/test_haikus.db';
  if (fs.existsSync(testDbPath)) {
    fs.unlinkSync(testDbPath);
  }
});

describe('GET /', () => {
  it('should return HTML with all haikus', async () => {
    const response = await request(app).get('/');
    expect(response.status).toBe(200);
    expect(response.headers['content-type']).toMatch(/html/);
    
    // Check that we get haiku content in the response
    expect(response.text).toContain('Test haiku one');
    expect(response.text).toContain('Another test poem');
    expect(response.text).toContain('test1.jpg');
    expect(response.text).toContain('test2.jpg');
  });
});

describe('GET /:id', () => {
  it('should return HTML with the specific haiku', async () => {
    const haikuId = 1; // SQLite uses 1-based auto-increment IDs
    const response = await request(app).get(`/${haikuId}`);
    expect(response.status).toBe(200);
    expect(response.headers['content-type']).toMatch(/html/);
    expect(response.text).toContain('Test haiku one');
    expect(response.text).toContain('test1.jpg');
  });

  it('should return 404 for non-existent haiku', async () => {
    const nonExistentId = 999; // A very high ID that shouldn't exist
    const response = await request(app).get(`/${nonExistentId}`);
    expect(response.status).toBe(404);
  });
});