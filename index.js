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

app.listen(port, () => {

  //print hikus to console
  console.log(haikus);

});

//get haiku by id
app.get('/:id', (req, res) => {
  res.render('index', {haikus: [haikus[req.params.id]]});
});

//get haiku by POST request
app.post('/', (req, res) => {
  res.render('index', {haikus: [haikus[req.body.id]]});
});

//redirect to haiku by POST request (vulnerable)
app.post('/redirect', (req, res) => {
  //redirect to haiku
  res.redirect('/' + req.body.id);
});

// Add a new GET route `/random` to serve a random haiku
app.get('/random', (req, res) => {
  // Use `Math.random()` to select a random haiku from `haikus.json`
  const randomIndex = Math.floor(Math.random() * haikus.length);
  const randomHaiku = haikus[randomIndex];
  // Render the selected haiku using `views/random.ejs`
  res.render('random', {haikus: [randomHaiku]});
});
