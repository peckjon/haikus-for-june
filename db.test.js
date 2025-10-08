// db.test.js
const { getAllHaikus, getHaikuById, getRandomHaiku, getHaikusCount } = require('./db');

describe('Database layer', () => {
  describe('getAllHaikus', () => {
    it('should return an array of haikus', () => {
      const haikus = getAllHaikus();
      expect(Array.isArray(haikus)).toBe(true);
      expect(haikus.length).toBeGreaterThan(0);
    });

    it('should return haikus with correct structure', () => {
      const haikus = getAllHaikus();
      haikus.forEach(haiku => {
        expect(haiku).toHaveProperty('id');
        expect(haiku).toHaveProperty('text');
        expect(haiku).toHaveProperty('image');
        expect(typeof haiku.id).toBe('number');
        expect(typeof haiku.text).toBe('string');
        expect(typeof haiku.image).toBe('string');
      });
    });

    it('should return all 6 haikus from the original JSON', () => {
      const haikus = getAllHaikus();
      expect(haikus.length).toBe(6);
    });
  });

  describe('getHaikuById', () => {
    it('should return a haiku when valid id is provided', () => {
      const haiku = getHaikuById(1);
      expect(haiku).toBeDefined();
      expect(haiku).toHaveProperty('id');
      expect(haiku).toHaveProperty('text');
      expect(haiku).toHaveProperty('image');
      expect(haiku.id).toBe(1);
    });

    it('should return undefined for non-existent id', () => {
      const haiku = getHaikuById(9999);
      expect(haiku).toBeUndefined();
    });

    it('should return undefined for invalid id (non-numeric)', () => {
      const haiku = getHaikuById('invalid');
      expect(haiku).toBeUndefined();
    });

    it('should return correct haiku text for id 1', () => {
      const haiku = getHaikuById(1);
      expect(haiku.text).toContain('Pulling on my leash');
    });
  });

  describe('getRandomHaiku', () => {
    it('should return a single haiku', () => {
      const haiku = getRandomHaiku();
      expect(haiku).toBeDefined();
      expect(haiku).toHaveProperty('id');
      expect(haiku).toHaveProperty('text');
      expect(haiku).toHaveProperty('image');
    });

    it('should return different haikus over multiple calls (probabilistic test)', () => {
      const ids = new Set();
      // Run 20 times to increase probability of getting different haikus
      for (let i = 0; i < 20; i++) {
        const haiku = getRandomHaiku();
        ids.add(haiku.id);
      }
      // With 6 haikus and 20 calls, we should get at least 2 different ones
      expect(ids.size).toBeGreaterThan(1);
    });
  });

  describe('getHaikusCount', () => {
    it('should return the correct count of haikus', () => {
      const count = getHaikusCount();
      expect(count).toBe(6);
    });

    it('should return a number', () => {
      const count = getHaikusCount();
      expect(typeof count).toBe('number');
    });
  });
});
