require('./db')
require('dotenv').config();

const express = require('express');
const morgan = require('morgan');
const app = require('express')();
const cors = require('cors');
const path = require('path');
const api = require('./server/api');
const bodyParser = require('body-parser');




//  Middleware
app.use(cors({ origin: '*' }));
app.use(express.static(path.join(__dirname, 'client/build')));
app.use(morgan('dev'));
app.use(bodyParser.json());

//  Routes
app.use('/auth', require('./server/routes/auth'));
app.use('/recipe', require('./server/routes/recipe'))
app.use('/user', require('./server/routes/user'))
app.use('/index', require('./server/routes/index'))

app.use(express.static(path.join(__dirname, 'client/build')));

app.get('/api/:method', async function (req, res) {
  const apiMethod = req.params.method;
  try {
    const isValid = api.hasOwnProperty(apiMethod);
    if (!isValid) {
      res.status(404).send({ errors: [`No such method ${apiMethod}!`] });
    } else {
      const data = await api[apiMethod]();
      res.send(data);
    }
  } catch (e) {
    res
      .status(500)
      .send({ errors: ['Sorry something went wrong!', e.message] });
  }
});

app.get('/api/', function (req, res) {
  res.status(404).send({
    errors: [
      `No method given! Avalible endpoints: ${Object.keys(api).map(
        (method) => `/api/${method}, `
      )}`,
    ],
  });
});


app.get('/welcome', function(req, res){
	res.status(200).send('Welcome to feedme API')
})

if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, 'client/build')));
  app.get('*', (req, res) => {
    res.sendFile(path.join((__dirname = 'client/build/index.html')));
  });
} else {
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname + '/client/public/index.html'));
  });
}


module.exports = app