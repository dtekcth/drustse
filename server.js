'use strict';

const sassMiddleware = require('node-sass-middleware');
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const marked = require('marked');
const tools = require('./db/routes_tools');
const articles = require('./db/routes_articles');
const admin = require('./admin');
const NewsArticle = require('./db/newsArticleModel.js');

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

app.use(cookieParser());

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

app.use('/db/tools', tools);
app.use('/db/articles', articles);
app.use('/admin', admin.router);

// Handler for root that displays news articles
function homeHandler(req, res) {
  NewsArticle.find({}, null, { sort: { posted: 'desc' }}, function(err, articles){
    if (err) {
      console.error(err);

      res.render('hem', { title: 'Hem', articles: { success: false }});
    } else {
      for (let i = 0; i < articles.length; i++) {
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
app.get('/',          homeHandler);
app.get('/drust',     (req, res) => { res.render('drust', {title:'DRust'}); });
app.get('/basen',     (req, res) => { res.render('basen', {title:'Basen'}); });
app.get('/verktyg',   (req, res) => { res.render('verktyg', {title:'Verktyg'}); });
app.get('/automaten', (req, res) => { res.render('automaten', {title:'Automaten'}); });
app.get('/flipper',   (req, res) => { res.render('flipper', {title:'Flipper'}); });

// Hidden routes
app.get('/mat',       (req, res) => { res.render('mat', {title:'Mat'}); });
app.get('/topsecret', (req, res) => { res.render('topsecret', {title:'Top Secret'}); });


app.listen(port);

console.log('\nListening on port ' + port);
