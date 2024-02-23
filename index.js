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

// get a random haiku by POST request
app.post('/random', (req, res) => {
  //get random haiku
  let randomHaiku = haikus[Math.floor(Math.random() * haikus.length)];
  //render random haiku
  res.render('index', {haikus: [randomHaiku]});
});
