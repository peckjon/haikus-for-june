// integration.test.js
const { spawn } = require('child_process');

describe('Integration Tests', () => {
  it('should start server when index.js is run directly', (done) => {
    // Spawn a child process to run index.js directly
    const child = spawn('node', ['index.js'], {
      env: { ...process.env, PORT: '3003' },
      stdio: 'pipe'
    });

    let output = '';
    
    child.stdout.on('data', (data) => {
      output += data.toString();
    });

    child.stderr.on('data', (data) => {
      output += data.toString();
    });

    // Give the server a moment to start up
    setTimeout(() => {
      // Check that the server startup message was logged
      expect(output).toContain('Server is running on port 3003');
      
      // Kill the child process
      child.kill('SIGTERM');
      done();
    }, 1000);

  }, 5000); // 5 second timeout
});