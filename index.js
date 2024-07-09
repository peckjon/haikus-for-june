let express = require('express');
let app = express();
let ejs = require('ejs');
const haikus = require('./haikus.json');
const port = process.env.PORT || 3000;

const passport = require('passport');
const GitHubStrategy = require('passport-github').Strategy;
const session = require('express-session');

app.use(express.static('public'))
app.set('view engine', 'ejs');

app.use(session({ secret: 'your-secret-key', resave: false, saveUninitialized: false }));
app.use(passport.initialize());
app.use(passport.session());

passport.use(new GitHubStrategy({
  clientID: process.env.GITHUB_CLIENT_ID,
  clientSecret: process.env.GITHUB_CLIENT_SECRET,
  callbackURL: "http://localhost:3000/auth/github/callback"
},
function(accessToken, refreshToken, profile, cb) {
  return cb(null, profile);
}));

passport.serializeUser(function(user, cb) {
  cb(null, user);
});

passport.deserializeUser(function(obj, cb) {
  cb(null, obj);
});

function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect('/');
}

app.get('/', (req, res) => {
  res.render('index', {haikus: haikus, user: req.user});
});

app.get('/random', (req, res) => {
  const randomHaiku = haikus[Math.floor(Math.random() * haikus.length)];
  res.render('index', {haikus: [randomHaiku], user: req.user});
});

app.get('/auth/github',
  passport.authenticate('github'));

app.get('/auth/github/callback', 
  passport.authenticate('github', { failureRedirect: '/' }),
  function(req, res) {
    res.redirect('/');
  });

app.get('/logout', (req, res) => {
  req.logout();
  res.redirect('/');
});

app.listen(port, () => {
  console.log(haikus);
});

app.get('/:id', (req, res) => {
  res.render('index', {haikus: [haikus[req.params.id]], user: req.user});
});

app.post('/', (req, res) => {
  res.render('index', {haikus: [haikus[req.body.id]], user: req.user});
});

app.post('/redirect', (req, res) => {
  res.redirect('/' + req.body.id);
});
