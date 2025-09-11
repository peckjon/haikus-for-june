// e2e.test.js - End-to-end tests for the haiku application
const request = require('supertest');
const { JSDOM } = require('jsdom');
const app = require('./index');
const haikus = require('./haikus.json');

// Helper function to parse HTML and get DOM
const parseHTML = (html) => {
  const dom = new JSDOM(html);
  return dom.window.document;
};

describe('E2E Tests - Full Application Flow', () => {
  describe('Home Page User Experience', () => {
    it('should display the complete home page with all UI elements', async () => {
      const response = await request(app).get('/');
      expect(response.status).toBe(200);
      
      const document = parseHTML(response.text);
      
      // Check page structure
      expect(document.title).toBe('Haikus for June');
      expect(document.querySelector('h1').textContent).toBe('Haikus for June');
      
      // Check all haikus are displayed
      const haikuElements = document.querySelectorAll('.haiku-containers');
      expect(haikuElements.length).toBe(haikus.length);
      
      // Check images are present
      const imageElements = document.querySelectorAll('.june-images');
      expect(imageElements.length).toBe(haikus.length);
      
      // Verify each haiku content
      haikus.forEach((haiku, index) => {
        expect(response.text).toContain(haiku.text);
        expect(response.text).toContain(`images/${haiku.image}`);
      });
    });

    it('should have functional navigation buttons', async () => {
      const response = await request(app).get('/');
      const document = parseHTML(response.text);
      
      // Check GitHub login button
      const githubBtn = document.querySelector('.github-login-btn');
      expect(githubBtn).toBeTruthy();
      expect(githubBtn.textContent.trim()).toBe('Login with GitHub');
      expect(githubBtn.href).toContain('github.com/login/oauth/authorize');
      
      // Check Random Haiku button
      const randomBtn = document.querySelector('.random-haiku-btn');
      expect(randomBtn).toBeTruthy();
      expect(randomBtn.textContent.trim()).toBe('Random Haiku');
      expect(randomBtn.href).toBe('/random');
    });
  });

  describe('Random Haiku Flow', () => {
    it('should navigate to random haiku and display single haiku', async () => {
      // Test multiple random requests to ensure randomness works
      const responses = [];
      for (let i = 0; i < 5; i++) {
        const response = await request(app).get('/random');
        responses.push(response);
        expect(response.status).toBe(200);
      }
      
      // Each response should contain exactly one haiku
      responses.forEach(response => {
        const document = parseHTML(response.text);
        const haikuElements = document.querySelectorAll('.haiku-containers');
        const imageElements = document.querySelectorAll('.june-images');
        
        expect(haikuElements.length).toBe(1);
        expect(imageElements.length).toBe(1);
        
        // Verify it's a valid haiku from our collection
        let foundValidHaiku = false;
        haikus.forEach(haiku => {
          if (response.text.includes(haiku.text) && response.text.includes(haiku.image)) {
            foundValidHaiku = true;
          }
        });
        expect(foundValidHaiku).toBe(true);
      });
    });

    it('should maintain UI elements on random haiku page', async () => {
      const response = await request(app).get('/random');
      const document = parseHTML(response.text);
      
      // Check that navigation buttons are still present
      const githubBtn = document.querySelector('.github-login-btn');
      const randomBtn = document.querySelector('.random-haiku-btn');
      
      expect(githubBtn).toBeTruthy();
      expect(randomBtn).toBeTruthy();
      
      // Page should still have proper title and header
      expect(document.title).toBe('Haikus for June');
      expect(document.querySelector('h1').textContent).toBe('Haikus for June');
    });
  });

  describe('Individual Haiku Navigation', () => {
    it('should navigate to specific haiku by ID', async () => {
      for (let i = 0; i < Math.min(3, haikus.length); i++) {
        const response = await request(app).get(`/${i}`);
        expect(response.status).toBe(200);
        
        const document = parseHTML(response.text);
        const haikuElements = document.querySelectorAll('.haiku-containers');
        const imageElements = document.querySelectorAll('.june-images');
        
        // Should display exactly one haiku
        expect(haikuElements.length).toBe(1);
        expect(imageElements.length).toBe(1);
        
        // Should display the correct haiku
        expect(response.text).toContain(haikus[i].text);
        expect(response.text).toContain(haikus[i].image);
        
        // Should maintain UI structure
        expect(document.title).toBe('Haikus for June');
        expect(document.querySelector('h1').textContent).toBe('Haikus for June');
      }
    });

    it('should handle navigation to non-existent haiku gracefully', async () => {
      const invalidIds = [haikus.length, haikus.length + 1, 'invalid', -1];
      
      for (const id of invalidIds) {
        const response = await request(app).get(`/${id}`);
        expect(response.status).toBe(404);
        expect(response.text).toContain('Haiku not found');
      }
    });
  });

  describe('Cross-page Navigation Flow', () => {
    it('should support navigation flow: Home -> Random -> Specific ID', async () => {
      // Start at home page
      const homeResponse = await request(app).get('/');
      expect(homeResponse.status).toBe(200);
      
      let homeDocument = parseHTML(homeResponse.text);
      expect(homeDocument.querySelectorAll('.haiku-containers').length).toBe(haikus.length);
      
      // Navigate to random haiku
      const randomResponse = await request(app).get('/random');
      expect(randomResponse.status).toBe(200);
      
      let randomDocument = parseHTML(randomResponse.text);
      expect(randomDocument.querySelectorAll('.haiku-containers').length).toBe(1);
      
      // Navigate to specific haiku
      const specificResponse = await request(app).get('/0');
      expect(specificResponse.status).toBe(200);
      
      let specificDocument = parseHTML(specificResponse.text);
      expect(specificDocument.querySelectorAll('.haiku-containers').length).toBe(1);
      expect(specificResponse.text).toContain(haikus[0].text);
    });

    it('should maintain consistent UI elements across all pages', async () => {
      const urls = ['/', '/random', '/0'];
      
      for (const url of urls) {
        const response = await request(app).get(url);
        if (response.status === 200) {
          const document = parseHTML(response.text);
          
          // Check consistent UI elements
          expect(document.title).toBe('Haikus for June');
          expect(document.querySelector('h1').textContent).toBe('Haikus for June');
          expect(document.querySelector('.github-login-btn')).toBeTruthy();
          expect(document.querySelector('.random-haiku-btn')).toBeTruthy();
          
          // Check CSS is linked
          const cssLink = document.querySelector('link[href="/css/main.css"]');
          expect(cssLink).toBeTruthy();
          
          // Check meta tags are present
          expect(document.querySelector('meta[name="viewport"]')).toBeTruthy();
          expect(document.querySelector('meta[property="og:title"]')).toBeTruthy();
        }
      }
    });
  });

  describe('GitHub OAuth Integration', () => {
    it('should have properly configured GitHub login button', async () => {
      const response = await request(app).get('/');
      const document = parseHTML(response.text);
      
      const githubBtn = document.querySelector('.github-login-btn');
      expect(githubBtn).toBeTruthy();
      
      // Parse the OAuth URL
      const oauthUrl = new URL(githubBtn.href);
      expect(oauthUrl.hostname).toBe('github.com');
      expect(oauthUrl.pathname).toBe('/login/oauth/authorize');
      
      // Check required OAuth parameters
      const params = oauthUrl.searchParams;
      expect(params.has('client_id')).toBe(true);
      expect(params.has('redirect_uri')).toBe(true);
      expect(params.get('scope')).toBe('user:email');
    });
  });

  describe('Application Responsiveness and Performance', () => {
    it('should respond quickly to all routes', async () => {
      const startTime = Date.now();
      
      // Test multiple concurrent requests
      const requests = [
        request(app).get('/'),
        request(app).get('/random'),
        request(app).get('/0'),
        request(app).get('/1')
      ];
      
      const responses = await Promise.all(requests);
      const endTime = Date.now();
      
      // All requests should complete within reasonable time (2 seconds)
      expect(endTime - startTime).toBeLessThan(2000);
      
      // All should return successfully
      responses.forEach((response, index) => {
        if (index < 3 || haikus.length > 1) { // Account for haiku availability
          expect(response.status).toBe(200);
        }
      });
    });

    it('should handle multiple random requests without issues', async () => {
      // Test rapid random haiku requests
      const promises = Array.from({ length: 10 }, () => 
        request(app).get('/random')
      );
      
      const responses = await Promise.all(promises);
      
      responses.forEach(response => {
        expect(response.status).toBe(200);
        expect(response.text).toContain('Haikus for June');
      });
    });
  });
});