'use strict';

const bcrypt = require('bcrypt');
const uuid = require('node-uuid');
const Session = require('./db/sessionModel.js');
const User = require('./db/userModel.js');

const salt = 'der bedste salten ind das heile eurobe';

User.count({ username: 'admin' }, (err, count) => {
  if (count == 0) {
    bcrypt.hash('abc123', salt, (err, hash) => {
      User.create({ username: 'admin', hash: hash });
    });
  }
});

// Handler for admin page. Verify login-cookie if present, else present login-prompt.
function adminHandler(req, res) {
  let session_id = req.cookies.session_id;

  if (session_id != null) {
    Session.findOne({ session_id: session_id }, (err, session) => {
      if (err) {
        console.error(err);

        res.render('login', { title: 'Login',
                              tried: true,
                              success: false,
                              err: 'Invalid session id' });
      } else if (session == null) {
        res.render('login', { title: 'Login',
                              tried: false,
                              redirect: '/admin' });
      } else {
        if (session.token === req.cookies.session_token) {
          res.render('admin', {
            title: 'Admin',
          });
        } else {
          Session.remove({ session_id: session_id }).exec();

          res.render('login', {
            title: 'Login',
            tried: true,
            success: false,
            err: 'Token in DB differs from token in cookie. You may have been hacked!'
          });
        }
      }
    });
  } else {
    // No login cookie. Present login prompt

    res.render('login', { title: 'Login',
                          tried: false,
                          redirect: '/admin' });
  }
}

// Handler for admin login. Verify login-data if present, otherwise present login-prompt
function loginGetHandler(req, res) {
  res.render('login', { title: 'Login', tried: false, redirect: '' })
}

function loginPostHandler(req, res) {
  User.findOne({ username: req.body.username }, (err, user) => {
    if (err || !user) {
      console.log(err);

      res.render('login', { title: 'Login',
                            tried: true,
                            success: false,
                            err: 'Unknown username' });
    } else {
      bcrypt.hash(req.body.password, salt, (err, hash) => {
        if (hash === user.hash) {
          let session_id = uuid.v4();
          let token = uuid.v4();

          Session.create({ session_id: session_id,
                           token: token,
                           user: req.body.username },
                         (err, s) => {
                           if (err) {
                             console.log(err);
                           }
                         });

          let expires = new Date() - 1;
          res.cookie('session_id', session_id);
          res.cookie('session_token', token);

          if (req.body.redirect != '') {
            res.redirect(req.body.redirect);
          } else {
            res.render('login', { title: 'Login', tried: true, success: true });
          }
        } else {
          res.render('login', { title: 'Login',
                                tried: true,
                                success: false,
                                err: 'Wrong password' });
        }
      });
    }
  });
}

module.exports = { adminHandler: adminHandler,
                   loginGetHandler: loginGetHandler,
                   loginPostHandler: loginPostHandler };
