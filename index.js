let express = require('express');
let app = express();
let ejs = require('ejs');
const db = require('./database');
const port = process.env.PORT || 3000;

app.use(express.static('public'))
app.set('view engine', 'ejs');

app.get('/', async (req, res) => {
  try {
    const haikus = await db.getAllHaikus();
    res.render('index', {haikus: haikus});
  } catch (error) {
    console.error('Error fetching haikus:', error);
    res.status(500).send('Internal Server Error');
  }
});

//get haiku by id
app.get('/:id', async (req, res) => {
  try {
    const haikuId = parseInt(req.params.id);
    if (isNaN(haikuId)) {
      return res.status(400).send('Invalid haiku ID');
    }
    
    const haiku = await db.getHaikuById(haikuId);
    if (haiku) {
      res.render('index', {haikus: [haiku]});
    } else {
      res.status(404).send('Haiku not found');
    }
  } catch (error) {
    console.error('Error fetching haiku by ID:', error);
    res.status(500).send('Internal Server Error');
  }
});

//get a random haiku by POST request
app.post('/random', async (req, res) => {
  try {
    const haikus = await db.getAllHaikus();
    if (haikus.length === 0) {
      return res.status(404).send('No haikus found');
    }
    
    const randomHaiku = haikus[Math.floor(Math.random() * haikus.length)];
    res.render('index', {haikus: [randomHaiku]});
  } catch (error) {
    console.error('Error fetching random haiku:', error);
    res.status(500).send('Internal Server Error');
  }
});

// Export the app
module.exports = app;

// Start the server only if this file is run directly
if (require.main === module) {
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
}