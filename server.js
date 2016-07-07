'use strict';

const express = require('express');
const sassMiddleware = require('node-sass-middleware');


const app = express();
const debugMode = true;
const port = 5000;


app.use(sassMiddleware({
  src: __dirname + "/public",
  dest:__dirname + "/public",
  debug: debugMode
}));

app.use(express.static('public'));


app.set('view engine', 'pug');

app.get('/', (req, res) => { res.render('base', {title:'test'}); });

app.listen(port);