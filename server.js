'use strict';

const sassMiddleware = require('node-sass-middleware');
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const async = require('async');
const path = require('path');
const marked = require('marked');
const dateFormat = require('dateformat');

// Database models
const Tool = require('./toolModel');
const NewsArticle = require('./newsArticleModel');

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

function drustHandler(req, res) {
  NewsArticle.find({}, null, { sort: { posted: 'desc' }}, function(err, articles){
    if (err) {
      console.error(err);

      res.render('hem', { title: 'Hem', articles: { success: false }});
    } else {
      for (let i = 0; i < articles.length; i++) {
        console.log(articles[i]);

        // article.body is some king of buffer and must be cast to String
        // before `marked` can parse it
        let body = String(articles[i].body);

        articles[i].body = marked(body);
      }

      res.render('hem', { title: 'Hem', articles: { success: true, payload: articles }});
    }
  });
}

// Routes
app.get('/',          drustHandler);
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

// Handlers for managing news articles in the db

// Handle listing the existing articles
app.get('/db/articles', function(req, res) {
  NewsArticle.find({}, null, { sort: { posted: 'desc' }}, function(err, articles){
    if (err) {
      console.error(err);
      res.render('db_articles', { success: false });
    } else {
      res.render('db_articles', { success: true, payload: articles });
    }
  });
});

// Handle request to create new article
app.post('/db/articles/new', function(req, res) {
  // Info from form
  const title = req.body.title;
  const body = req.body.body;
  const time = dateFormat(new Date(), "yyyy-mm-dd HH:MM");
  const article = new NewsArticle({ posted: time, title: title, body: body });

  article.save((err, v) => {
    if (err) {
      console.error(err);

      res.json({ success: false });
    } else {
      res.json({ success: true });
    }
  });
});

// Handle request to update article
app.post('/db/articles/update', function(req, res) {
  const id = req.body.id;
  const title = req.body.title;
  const body = req.body.body;

  NewsArticle.findById(id, function(err, article) {
    if (err) {
      console.error(err);
      res.json({ success: false });
    } else {
      article.title = title;
      article.body = body;

      article.save((err, v) => {
        if (err) {
          console.error(err);
          res.json({ success: false });
        } else {
          res.json({ success: true });
        }})
    }
  })
});

// Handle request to remove article
app.post('/db/articles/remove', function(req, res) {
  const id = req.body.id;

  NewsArticle.findById(id, function(err, article) {
    if (err) {
      console.error(err);
      res.json({ success: false })
    } else {
      article.remove(function(err) {
        if (err) {
          console.error(err);
          res.json({ success: false });
        } else {
          res.json({ success: true });
        }
      });
    }
  });
});

// Handle writing a new article
app.get('/db/articles/edit', function(req, res) {
  // Not modifying an existing article, but rather writing a new one
  let data = { success: true, payload: { modify: false }};

  res.render('db_articles_editor', data);
});

// Handle editing an existing article;
app.get('/db/articles/edit/*', function(req, res) {
  let id = path.basename(req.path);

  NewsArticle.findById(id, function(err, article){
    if (err) {
      console.error(err);
      res.render('db_articles_editor', { success: false });
    } else {
      // Modifying an existing article
      let data = { success: true, payload: { modify: true, article: article }};
      console.log("data: " + data);

      res.render('db_articles_editor', data);
    }
  });
});

// Hidden routes
app.get('/mat',       (req, res) => { res.render('mat', {title:'Mat'}); });
app.get('/topsecret', (req, res) => { res.render('topsecret', {title:'Top Secret'}); });


app.listen(port);

console.log('\nListening on port ' + port);
