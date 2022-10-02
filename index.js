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

//get a random haiku
function getRandomHaiku() {
  return haikus[Math.floor(Math.random() * haikus.length)];
}

//render a random haiku
app.get('/random', (req, res) => {
  res.render('random', {haiku: getRandomHaiku()});
});
