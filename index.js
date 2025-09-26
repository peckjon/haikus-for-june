let express = require('express');
let app = express();
let ejs = require('ejs');
const Database = require('./database/Database');
const port = process.env.PORT || 3000;

// Initialize database connection with environment-based path
const dbPath = process.env.NODE_ENV === 'test' 
  ? './database/test_haikus.db' 
  : './database/haikus.db';
const db = new Database(dbPath);

// Initialize database once
let initPromise = db.init();

app.use(express.static('public'))
app.set('view engine', 'ejs');

app.get('/', async (req, res) => {
  try {
    await initPromise; // Ensure database is initialized
    const haikus = await db.getAllHaikus();
    res.render('index', {haikus: haikus});
  } catch (error) {
    console.error('Error fetching haikus:', error);
    res.status(500).send('Internal server error');
  }
});

//get haiku by id
app.get('/:id', async (req, res) => {
  try {
    await initPromise; // Ensure database is initialized
    const haiku = await db.getHaikuById(parseInt(req.params.id, 10));
    if (haiku) {
      res.render('index', {haikus: [haiku]});
    } else {
      res.status(404).send('Haiku not found');
    }
  } catch (error) {
    console.error('Error fetching haiku by id:', error);
    res.status(500).send('Internal server error');
  }
});

//get a random haiku by POST request
app.post('/random', async (req, res) => {
  try {
    await initPromise; // Ensure database is initialized
    const randomHaiku = await db.getRandomHaiku();
    if (randomHaiku) {
      res.render('index', {haikus: [randomHaiku]});
    } else {
      res.status(404).send('No haikus found');
    }
  } catch (error) {
    console.error('Error fetching random haiku:', error);
    res.status(500).send('Internal server error');
  }
});

// Export the app
module.exports = app;

// Graceful shutdown handler
process.on('SIGINT', async () => {
  console.log('Shutting down gracefully...');
  await db.close();
  process.exit(0);
});

process.on('SIGTERM', async () => {
  console.log('Shutting down gracefully...');
  await db.close();
  process.exit(0);
});

// Start the server only if this file is run directly
if (require.main === module) {
  app.listen(port, async () => {
    await initPromise;
    console.log(`Server is running on port ${port}`);
  });
}