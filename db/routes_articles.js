const path = require('path');
const dateFormat = require('dateformat');
const router = require('express').Router();
const admin = require('../admin');

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

// Helper function for article management. Responds that action is unauthorized
function unauthorized(res) {
  return () => res.json({ success: false, error: "Unauthorized action" });
}

// Handle request to create new article
router.post('/new', function(req, res) {
  function newArticle(session) {
    // Info from form
    const title = req.body.title;
    const body = req.body.body;
    const time = dateFormat(new Date(), "yyyy-mm-dd HH:MM");
    const article = new NewsArticle({ posted: time, title: title, body: body });

    if (!title) {
      res.json({ success: false, error: "Missing title" })
    } else {
      article.save((err, v) => {
        if (err) {
          console.error(err);

          res.json({ success: false, error: "Database error" });
        } else {
          res.json({ success: true, articleId: v._id });
        }
      });
    }
  }

  admin.validateSession(req, res, newArticle, unauthorized(res));
});

// Handle request to update article
router.post('/update', function(req, res) {
  function updateArticle(session) {
    const id = req.body.id;
    const title = req.body.title;
    const body = req.body.body;

    if (!title) {
      res.json({ success: false, error: "Missing title" })
    } else {
      NewsArticle.findById(id, function(err, article) {
        if (err) {
          console.error(err);
          res.json({ success: false, error: "Inexistant article " + id });
        } else {
          article.title = title;
          article.body = body;

          article.save((err, v) => {
            if (err) {
              console.error(err);
              res.json({ success: false, error: "Database error" });
            } else {
              res.json({ success: true, articleId: v._id });
            }})
        }
      });
    }
  }

  admin.validateSession(req, res, updateArticle, unauthorized(res));
});

// Handle request to remove article
router.post('/remove', function(req, res) {
  function removeArticle(session) {
    const id = req.body.id;

    NewsArticle.findById(id, function(err, article) {
      if (!article || err) {
        console.error(err);
        res.json({ success: false, error: "Inexistant article " + id })
      } else {
        article.remove(function(err) {
          if (err) {
            console.error(err);
            res.json({ success: false, error: "Database error" });
          } else {
            res.json({ success: true });
          }
        });
      }
    });
  }

  admin.validateSession(req, res, removeArticle, unauthorized(res));
});

module.exports = router;
