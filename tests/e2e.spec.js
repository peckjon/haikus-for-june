// tests/e2e.spec.js
const { spawn } = require('child_process');
const http = require('http');

describe('Frontend E2E Tests', () => {
  let server;
  const port = 3004;
  
  beforeAll(async () => {
    // Start the server for testing
    server = spawn('node', ['index.js'], {
      env: { ...process.env, PORT: port },
      stdio: 'pipe'
    });
    
    // Wait for server to start
    await new Promise((resolve) => {
      server.stdout.on('data', (data) => {
        if (data.toString().includes('Server is running')) {
          resolve();
        }
      });
    });
    
    // Give it an extra moment
    await new Promise(resolve => setTimeout(resolve, 1000));
  });

  afterAll(() => {
    if (server) {
      server.kill();
    }
  });

  test('homepage should return HTML with all haikus', async () => {
    const response = await makeRequest(`http://localhost:${port}/`);
    
    expect(response.statusCode).toBe(200);
    expect(response.headers['content-type']).toMatch(/html/);
    
    // Check for title and heading
    expect(response.data).toContain('<title>Haikus for June</title>');
    expect(response.data).toContain('<h1>Haikus for June</h1>');
    
    // Check for CSS link
    expect(response.data).toContain('<link href="/css/main.css"');
    
    // Check for haiku elements
    expect(response.data).toContain('class="june-images"');
    expect(response.data).toContain('class="haiku-containers"');
    expect(response.data).toContain('class="haikus"');
    
    // Check for at least some haiku content
    expect(response.data).toContain('Pulling on my leash');
  });

  test('individual haiku page should work', async () => {
    const response = await makeRequest(`http://localhost:${port}/0`);
    
    expect(response.statusCode).toBe(200);
    expect(response.headers['content-type']).toMatch(/html/);
    expect(response.data).toContain('Pulling on my leash');
  });

  test('non-existent haiku should return 404', async () => {
    const response = await makeRequest(`http://localhost:${port}/999`);
    expect(response.statusCode).toBe(404);
  });

  test('CSS file should be served', async () => {
    const response = await makeRequest(`http://localhost:${port}/css/main.css`);
    
    expect(response.statusCode).toBe(200);
    expect(response.headers['content-type']).toMatch(/css/);
    expect(response.data).toContain('background-color');
    expect(response.data).toContain('.june-images');
  });
});

function makeRequest(url) {
  return new Promise((resolve, reject) => {
    http.get(url, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => resolve({
        statusCode: res.statusCode,
        headers: res.headers,
        data: data
      }));
    }).on('error', reject);
  });
}