let express = require('express');
let app = express();
let ejs = require('ejs');
const haikus = require('./haikus.json');
const port = process.env.PORT || 3000;

const { PublicClientApplication } = require('@azure/msal-node');
const { msalExpress } = require('@azure/msal-express-middleware');

const msalConfig = {
  auth: {
    clientId: process.env.AZURE_CLIENT_ID,
    authority: process.env.AZURE_AUTHORITY,
    clientSecret: process.env.AZURE_CLIENT_SECRET
  },
  system: {
    loggerOptions: {
      loggerCallback(loglevel, message, containsPii) {
        console.log(message);
      },
      piiLoggingEnabled: false,
      logLevel: 'info',
    }
  }
};

const pca = new PublicClientApplication(msalConfig);

app.use(msalExpress({
  pca,
  authRoutes: {
    redirect: '/redirect',
    error: '/error',
    login: {
      path: '/login',
      handler: (req, res, next) => {
        res.redirect('/redirect');
      }
    }
  }
}));

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
