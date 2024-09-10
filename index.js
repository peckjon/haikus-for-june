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

//get haiku by id
app.get('/:id', (req, res) => {
  const haiku = haikus[req.params.id];
  if (haiku) {
    res.render('index', {haikus: [haiku]});
  } else {
    res.status(404).send('Haiku not found');
  }
});

//get random subset of haikus
app.get('/random', (req, res) => {
  const subsetSize = Math.floor(Math.random() * haikus.length) + 1;
  const randomSubset = [];
  const usedIndices = new Set();

  while (randomSubset.length < subsetSize) {
    const randomIndex = Math.floor(Math.random() * haikus.length);
    if (!usedIndices.has(randomIndex)) {
      randomSubset.push(haikus[randomIndex]);
      usedIndices.add(randomIndex);
    }
  }

  res.render('index', {haikus: randomSubset});
});

// Export the app
module.exports = app;

// Start the server only if this file is run directly
if (require.main === module) {
  app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
  });
}
