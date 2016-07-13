'use strict';

const sassMiddleware = require('node-sass-middleware');
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

// Database models
const Tool = require('./toolModel');

const app = express();

// For ES6 js in pug files
const pug = require('pug');
const babel = require('jade-babel');
pug.filters.babel = babel({});

// Constants
const debugMode = true;
const port = process.env.PORT || 5000;

// Settings for static files
app.use(sassMiddleware({
  src: __dirname + "/public",
  dest:__dirname + "/public",
  debug: debugMode
}));

app.use(express.static('public'));

//Parses incoming body to req.body
app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());

// For templates
app.set('view engine', 'pug');

// Database stuff
const db = mongoose.connect('mongodb://localhost/verktyg').connection;

db.on('error', (err) => { console.log(err.message); });
db.once('open', () => { console.log('Database connection open'); });

// Lookup table for name - id
let lookupTools = {};

// Fill lookup table with info from database
Tool.find(function(err, tools){
  if (err) { console.error(err); }

  for(const tool of tools){
    lookupTools[tool.name] = tool._id;
  }
});

// Routes
app.get('/',          (req, res) => { res.render('drust'); }); // Placeholder template
app.get('/drust',     (req, res) => { res.render('drust', {title:'DRust'}); });
app.get('/basen',     (req, res) => { res.render('basen', {title:'Basen'}); });
app.get('/verktyg',   (req, res) => { res.render('verktyg', {title:'Verktyg'}); });
app.get('/automaten', (req, res) => { res.render('automaten', {title:'Automaten'}); });
app.get('/flipper',   (req, res) => { res.render('flipper', {title:'Flipper'}); });

// For testing
app.get('/db', function(req, res) {
  Tool.find(function(err, tools){
    if (err) { console.error(err); }
    
    res.render('db', {tools:tools});
  });
});

// If request to create new item in db
app.post('/db/new', function(req, res) {
  // Info from form
  const name = req.body.name;
  const amount = req.body.amount;
  const tool = new Tool({name: name, amount:amount});

  lookupTools[name] = tool._id;
  // Save in db
  tool.save((err, v) => { if (err) return console.error(err); });

  // Show db page again
  res.redirect('/db');
});

// If request to update item in db
app.post('/db/update', function(req, res){
  const name = req.body.name;
  const amount = req.body.amount;
  const id = lookupTools[name];
  
  Tool.findById(id, function(err, tool){
    if (err) return console.error(err);

    // Change to requested amount
    tool.amount = amount;

    // Save in db
    tool.save((err, v) => { if (err) return console.error(err); });
  
    // Show db page again
    res.redirect('/db');
  })
});

// Hidden routes
app.get('/mat',       (req, res) => { res.render('mat', {title:'Mat'}); });
app.get('/topsecret', (req, res) => { res.render('topsecret', {title:'Top Secret'}); });


app.listen(port);

console.log('\nListening on port ' + port);