const express = require('express');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const app = require('express')();
const http = require('http').createServer(app);
const path = require('path');
const port = process.env.PORT || 5000;
const api = require('./server/api');
const mongoose = require('mongoose');
const config = require('config');
const db = config.get('mongoURI');

//  Database
mongoose.connect(db, { useUnifiedTopology: true, useNewUrlParser: true });

//  Middleware
app.use(express.static(path.join(__dirname, 'client/build')));
app.use(morgan('dev'));
app.use(bodyParser.json());

//  Routes
app.use('/auth', require('./server/routes/auth'));

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

http.listen(port, () => {
  console.log(`Listening on port ${port}`);
});
