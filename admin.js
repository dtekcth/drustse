'use strict';

const path = require('path');
const router = require('express').Router();
const userManagement = require('./userManagement.js');
const Session = require('./db/sessionModel.js');
const Tool = require('./db/toolModel.js');
const NewsArticle = require('./db/newsArticleModel.js');

// If admin session cookies are valid, invocate `callbackSuccess`.
// Else if `callbackFail` is defined, invocate it.
// Else, present login prompt
function validateSession(req, res, callbackSuccess, callbackFail) {
  let session_id = req.cookies.session_id;

  if (session_id) {
    Session.findOne({ session_id: session_id }, (err, session) => {
      if (err) {
        console.error(err);

        if (callbackFail) {
          callbackFail();
        } else {
          res.render('login', { title: 'Login',
                                tried: true,
                                success: false,
                                err: 'Invalid session id' });
        }
      } else if (!session) {
        if (callbackFail) {
          callbackFail();
        } else {
          res.render('login', { title: 'Login',
                                tried: false,
                                redirect: '/admin' });
        }
      } else {
        if (session.token === req.cookies.session_token) {
          callbackSuccess(session);
        } else {
          Session.remove({ session_id: session_id }).exec();

          if (callbackFail) {
            callbackFail();
          } else {
            res.render('login', {
              title: 'Login',
              tried: true,
              success: false,
              err: 'Token in DB differs from token in cookie. You may have been hacked!'
            });
          }
        }
      }
    });
  } else {
    // No login cookie. Present login prompt

    if (callbackFail) {
      callbackFail();
    } else {
      res.render('login', { title: 'Login',
                            tried: false,
                            redirect: '/admin' });
    }
  }
}

// Responds that action is unauthorized
function resUnauthorized(res) {
  return () => res.json({ success: false, error: "Unauthorized action" });
}

// Handler for admin page. Verify login-cookie if present, else present login-prompt.
function adminHandler(req, res) {
  validateSession(req, res, (session) => {
    NewsArticle.find({}, null, { sort: { posted: 'desc' }}, function(err_a, articles){
      Tool.find(function(err_t, tools){
        if (err_a || err_t) {
          console.error(err_a + err_t);
          res.status(500).send("Database error");
        } else {
          res.render('admin', { title: 'Admin', articles: articles, tools: tools });
        }
      });
    });
  });
}

router.get('/', adminHandler);

// Handle writing a new article
router.get('/editor', function(req, res) {
  validateSession(req, res, (session) => {
    // Not modifying an existing article, but rather writing a new one

    res.render('db_articles_editor', { modify: false });
  });
});

// Handle editing an existing article;
router.get('/editor/*', function(req, res) {
  validateSession(req, res, (session) => {
    let id = path.basename(req.path);

    NewsArticle.findById(id, function(err, article){
      if (err) {
        console.error(err);
        res.status(500).send("Database error");
      } else {
        // Modifying an existing article
        res.render('db_articles_editor', { modify: true, article: article });
      }
    });
  });
});

router.get('/login',  userManagement.loginGetHandler);
router.post('/login', userManagement.loginPostHandler);

module.exports = { router: router,
                   validateSession: validateSession,
                   resUnauthorized: resUnauthorized };
