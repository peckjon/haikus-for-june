const express = require('express')
const app = express()
const haikus = require('./haikus.json')
const port = process.env.PORT || 3000

app.use(express.static('public'))
app.set('view engine', 'ejs')

// Render the index page with all haikus
app.get('/', (req, res) => {
  res.render('index', { haikus })
})

// Start the server and print haikus to console
app.listen(port, () => {
  console.log(haikus)
})

// Get haiku by id
app.get('/:id', (req, res) => {
  res.render('index', { haikus: [haikus[req.params.id]] })
})

// Get haiku by POST request
app.post('/', (req, res) => {
  res.render('index', { haikus: [haikus[req.body.id]] })
})

// Redirect to haiku by POST request (vulnerable)
app.post('/redirect', (req, res) => {
  // Redirect to haiku
  res.redirect('/' + req.body.id)
})

// Add a new GET route `/random` to serve a random haiku
app.get('/random', (req, res) => {
  // Use `Math.random()` to select a random haiku from `haikus.json`
  const randomIndex = Math.floor(Math.random() * haikus.length)
  const randomHaiku = haikus[randomIndex]
  // Render the selected haiku using `views/random.ejs`
  res.render('random', { haikus: [randomHaiku] })
})