'use strict';

const express = require('express');
const sassMiddleware = require('node-sass-middleware');

// For ES6 js in pug files
const pug = require('pug');
const babel = require('jade-babel');
pug.filters.babel = babel({});


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

app.get('/',      (req, res) => { res.render('base'); });
app.get('/drust', (req, res) => { res.render('drust', {title:'DRust'}); });
app.get('/basen', (req, res) => { res.render('basen', {title:'Basen'}); });
app.get('/verktyg', (req, res) => { res.render('verktyg', {title:'Verktyg'}); });
app.get('/automaten', (req, res) => { res.render('automaten', {title:'Automaten'}); });
app.get('/flipper', (req, res) => { res.render('flipper', {title:'Flipper'}); });

app.listen(port);