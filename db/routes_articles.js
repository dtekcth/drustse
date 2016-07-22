const path = require('path');
const dateFormat = require('dateformat');
const router = require('express').Router();

const NewsArticle = require('./newsArticleModel.js');

// Handle listing the existing articles
router.get('/', function(req, res) {
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
router.post('/new', function(req, res) {
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
router.post('/update', function(req, res) {
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
router.post('/remove', function(req, res) {
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
router.get('/edit', function(req, res) {
  // Not modifying an existing article, but rather writing a new one
  let data = { success: true, payload: { modify: false }};

  res.render('db_articles_editor', data);
});

// Handle editing an existing article;
router.get('/edit/*', function(req, res) {
  let id = path.basename(req.path);

  NewsArticle.findById(id, function(err, article){
    if (err) {
      console.error(err);
      res.render('db_articles_editor', { success: false });
    } else {
      // Modifying an existing article
      let data = { success: true, payload: { modify: true, article: article }};

      res.render('db_articles_editor', data);
    }
  });
});

module.exports = router;
