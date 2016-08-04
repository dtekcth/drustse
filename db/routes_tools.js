'use strict';

const mongoose = require('mongoose');
const async = require('async');
const Tool = require('./toolModel');
const router = require('express').Router();
const admin = require('../admin');

router.get('/', function(req, res) {
  Tool.find(function(err, tools){
    if (err) { console.error(err); }

    res.render('db_tools', { tools:tools });
  });
});

// If request to create new item in db
router.post('/new', function(req, res) {
  function newTool(session) {
    // Info from form
    const name = req.body.name;
    let amount = req.body.amount;
    if (amount == null){ // If an amount is not specified in the form
      amount = 0;
    }

    const tool = new Tool({name: name, amount:amount});

    if (!name) {
      res.json({ success: false, error: "Missing name" });
    } else {
      tool.save((err, v) => {
        if (err) {
          console.error(err);

          let msg = "Database error";
          if (err.name == 'MongoError') {
            msg = "Tool already exists";
          }

          res.json({ success: false, error: msg});
        } else {
          res.json({ success: true })
        }
      });
    }
  }

  admin.validateSession(req, res, newTool, admin.resUnauthorized(res));
});

// If request to update item in db
router.post('/update', function(req, res){
  function updateTool(session) {
    const id = req.body.id;
    const amount = req.body.amount;

    Tool.findById(id, function(err, tool) {
      if (err) {
        console.error(err);
        res.json({ success: false, error: "Inexistant tool " + id });
      } else {
        // Change to requested amount
        tool.amount = amount;

        // Save in db
        tool.save((err, v) => {
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

  admin.validateSession(req, res, updateTool, admin.resUnauthorized(res))
});

router.post('/remove', function(req, res){
  function removeTool() {
    const id = req.body.id;

    Tool.findById(id, function(err, tool){
      if (!tool || err) {
        console.error(err);
        res.json({ success: false, error: "Inexistant tool " + id });
      } else {
        tool.remove(function(err){
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

  admin.validateSession(req, res, removeTool, admin.resUnauthorized(res))
});

module.exports = router;
