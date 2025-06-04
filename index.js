let express = require('express');
let app = express();
let ejs = require('ejs');
const haikus = require('./haikus.json');
const port = process.env.PORT || 3000;

app.use(express.static('public'))
app.set('view engine', 'ejs');

app.get('/', (req, res) => {
  res.render('index', {haikus: haikus});
});

//get a random subset of haikus by GET request
app.get('/random', (req, res) => {
  // Create a copy of haikus array and shuffle it using Fisher-Yates algorithm
  const shuffledHaikus = [...haikus];
  for (let i = shuffledHaikus.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffledHaikus[i], shuffledHaikus[j]] = [shuffledHaikus[j], shuffledHaikus[i]];
  }
  // Take a random subset (3 out of 6 haikus)
  const subsetSize = Math.max(1, Math.floor(haikus.length / 2));
  const randomSubset = shuffledHaikus.slice(0, subsetSize);
  res.render('index', {haikus: randomSubset});
});

//get haiku by id
app.get('/:id', (req, res) => {
  const haiku = haikus[req.params.id];
  if (haiku) {
    res.render('index', {haikus: [haiku]});
  } else {
    res.status(404).send('Haiku not found');
  }
});

//get a random haiku by POST request
app.post('/random', (req, res) => {
  const randomHaiku = haikus[Math.floor(Math.random() * haikus.length)];
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