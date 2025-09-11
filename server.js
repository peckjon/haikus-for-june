const app = require('./index.js');
const db = require('./database');
const port = process.env.PORT || 3000;

// Initialize database and start server
db.initializeDatabase()
  .then(() => db.seedDatabase())
  .then(() => {
    app.listen(port, () => {
      console.log(`Server is running on port ${port}`);
    });
  })
  .catch(error => {
    console.error('Failed to initialize database:', error);
    process.exit(1);
  });