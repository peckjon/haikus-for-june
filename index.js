let express = require('express');
let app = express();
let ejs = require('ejs');
const db = require('./db/database');
const port = process.env.PORT || 3000;

app.use(express.static('public'))
app.set('view engine', 'ejs');

app.get('/', async (req, res) => {
  try {
    const haikus = await db.getAllHaikus();
    res.render('index', {haikus: haikus});
  } catch (err) {
    console.error('Error retrieving haikus:', err);
    res.status(500).send('Error retrieving haikus');
  }
});

//get haiku by id
app.get('/:id', async (req, res) => {
  try {
    const haiku = await db.getHaikuById(req.params.id);
    if (haiku) {
      res.render('index', {haikus: [haiku]});
    } else {
      res.status(404).send('Haiku not found');
    }
  } catch (err) {
    console.error('Error retrieving haiku by id:', err);
    res.status(500).send('Error retrieving haiku');
  }
});

//get a random haiku by POST request
app.post('/random', async (req, res) => {
  try {
    const randomHaiku = await db.getRandomHaiku();
    res.render('index', {haikus: [randomHaiku]});
  } catch (err) {
    console.error('Error retrieving random haiku:', err);
    res.status(500).send('Error retrieving random haiku');
  }
});

//get a random haiku by GET request
app.get('/random', async (req, res) => {
  try {
    const randomHaiku = await db.getRandomHaiku();
    res.render('index', {haikus: [randomHaiku]});
  } catch (err) {
    console.error('Error retrieving random haiku:', err);
    res.status(500).send('Error retrieving random haiku');
  }
});

// Export the app
module.exports = app;

// Start the server only if this file is run directly
if (require.main === module) {
  // Initialize the database first, then start the server
  const seedDatabase = require('./db/seed');
  
  // Wrap in an async IIFE for better async/await handling
  (async () => {
    try {
      console.log('Initializing database...');
      await seedDatabase();
      
      app.listen(port, () => {
        console.log(`Server is running on port ${port}`);
        console.log('Use Ctrl+C to stop the server');
      });
    } catch (err) {
      console.error('Failed to initialize database or start server:', err);
      process.exit(1);
    }
  })();
}