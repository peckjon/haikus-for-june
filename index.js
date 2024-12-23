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
    res.status(401).send('Haiku not found');
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
