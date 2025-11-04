let express = require('express');
let app = express();
let ejs = require('ejs');
const db = require('./db');
const { migrate } = require('./migrate');
const port = process.env.PORT || 3000;

// Run migration on startup if database is empty
migrate();

app.use(express.static('public'))
app.set('view engine', 'ejs');

app.get('/', (req, res) => {
  const haikus = db.getAllHaikus();
  res.render('index', {haikus: haikus});
});

//get haiku by id
app.get('/:id', (req, res) => {
  // Maintain 0-based indexing for backward compatibility with original JSON array
  const requestedId = parseInt(req.params.id);
  const dbId = requestedId + 1; // Convert 0-based index to 1-based database ID
  const haiku = db.getHaikuById(dbId);
  
  if (haiku) {
    res.render('index', {haikus: [haiku]});
  } else {
    res.status(404).send('Haiku not found');
  }
});

//get a random haiku by POST request
app.post('/random', (req, res) => {
  const randomHaiku = db.getRandomHaiku();
  res.render('index', {haikus: [randomHaiku]});
});

// Export the app
module.exports = app;

// Start the server only if this file is run directly
if (require.main === module) {
  app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
  });
}