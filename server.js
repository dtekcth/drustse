'use strict';

const sassMiddleware = require('node-sass-middleware');
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const async = require('async');

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
const db = mongoose.connect('mongodb://localhost/db').connection;

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
app.get('/',          (req, res) => { res.render('hem'); {title:'Hem'}});
app.get('/drust',     (req, res) => { res.render('drust', {title:'DRust'}); });
app.get('/basen',     (req, res) => { res.render('basen', {title:'Basen'}); });
app.get('/verktyg',   (req, res) => { res.render('verktyg', {title:'Verktyg'}); });
app.get('/automaten', (req, res) => { res.render('automaten', {title:'Automaten'}); });
app.get('/flipper',   (req, res) => { res.render('flipper', {title:'Flipper'}); });

// For testing
//TODO: Make admin page (/db -> /admin) and link to all subdirectories (ex /admin/tools) for db work
app.get('/db/tools/', function(req, res) {
  Tool.find(function(err, tools){
    if (err) { console.error(err); }
    
    // Read unique from query
    let isUnique;
    if (req.query.unique !== undefined) {
      isUnique = req.query.unique === 'true';
    } else {
      isUnique = true;
    }

    res.render('db_tools', {tools:tools,isUnique:isUnique});
  });
});

// If request to create new item in db
app.post('/db/tools/new', function(req, res) {
  // Info from form
  const name = req.body.name;
  const amount = req.body.amount;
  const tool = new Tool({name: name, amount:amount});

  lookupTools[name] = tool._id;

  // Is the tool not in db?
  let isUnique = true;

  // Run save first to update isUnique before it is used in the redirect
  async.series([
    function(callback){
      // Save in db
      tool.save((err, v) => {
        if (err) {
          isUnique = false;
          callback(null);
          return console.error(err);
        } else {
          callback(null);
        }
      });
    },
    function (callback) {
      // Show db page again
      res.redirect('/db/tools?unique=' + encodeURIComponent(isUnique));
      callback(null);
    }
  ], function(err){
    if (err) return console.error(err);
  });
});

// If request to update item in db
app.post('/db/tools/update', function(req, res){
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
    res.redirect('/db/tools');
  })
});

app.post('/db/tools/remove', function(req, res){
  const name = req.body.name;
  const id = lookupTools[name];

  Tool.findById(id, function(err, tool){
    if (err) return console.error(err);

    tool.remove(function(err){
      if (err) return console.error(err);

      console.log('Deleted Tool: ' + tool.name);
    });

    // Remove tool from lookup table
    delete lookupTools[name];
    
    // Show db page again
    res.redirect('/db/tools');

  });

  delete lookupTools[name];

} );

// Hidden routes
app.get('/mat',       (req, res) => { res.render('mat', {title:'Mat'}); });
app.get('/topsecret', (req, res) => { res.render('topsecret', {title:'Top Secret'}); });


app.listen(port);

console.log('\nListening on port ' + port);