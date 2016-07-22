
const mongoose = require('mongoose');
const async = require('async');
const Tool = require('./toolModel');
const router = require('express').Router();

// Lookup table for name - id
let lookupTools = {};

// Fill lookup table with info from database
Tool.find(function(err, tools){
    if (err) { console.error(err); }

    for(const tool of tools){
        lookupTools[tool.name] = tool._id;
    }
});

// Is the tool not in db?
let isUnique = true;

// Did the user forget to type a name?
let noName = false;


router.get('/', function(req, res) {
    Tool.find(function(err, tools){
        if (err) { console.error(err); }

        res.render('db_tools', {tools:tools, isUnique:isUnique, noName:noName});
    });
});

// If request to create new item in db
router.post('/new', function(req, res) {
    // Info from form
    const name = req.body.name;
    const amount = req.body.amount;
    const tool = new Tool({name: name, amount:amount});

    lookupTools[name] = tool._id;

    // Run save first to update isUnique before it is used in the redirect
    async.series([
        function(callback){
            // Save in db
            tool.save((err, v) => {
                if (err) {
                    if (err.name === 'MongoError') {
                        isUnique = false;
                    } else if (err.name === 'ValidationError'){
                        noName = true;
                    }
                    callback(null);
                    return console.error(err);
                } else {
                    callback(null);
                }
            });
        },
        function (callback) {
            // Show db page again
            res.redirect('/db/tools');
            callback(null);
        }
    ], function(err){
        if (err) return console.error(err);
    });
});

// If request to update item in db
router.post('/update', function(req, res){
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

router.post('/remove', function(req, res){
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

});

module.exports = router;