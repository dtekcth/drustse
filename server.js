'use strict';

var express = require('express');
var sassMiddleware = require('node-sass-middleware');

var app = express();
var debugMode = true;


app.use(sassMiddleware({
  src: __dirname + "/public",
  dest:__dirname + "/public",
  debug: debugMode
}));

app.use(express.static('public'));


app.set('view engine', 'pug');

app.get('/', (req, res) => { res.render('base', {title:'test'}); });

app.listen(5000);