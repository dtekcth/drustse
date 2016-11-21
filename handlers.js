'use strict';

const marked = require('marked');

const NewsArticle = require('./db/newsArticleModel.js');
const Tool        = require('./db/toolModel');


// Handler for root that displays news articles
function homeHandler(req, res) {
  NewsArticle.find({}, null, {sort: {posted: 'desc'}}, function (err, articles) {
    if (err) {
      console.error(err);

      res.render('hem', {title: 'Hem', articles: {success: false}});
    } else {
      for (let i = 0; i < articles.length; i++) {
        // article.body is some king of buffer and must be cast to String
        // before `marked` can parse it
        let body = String(articles[i].body);

        articles[i].body = marked(body);
      }

      res.render('hem', {title: 'Hem', articles: {success: true, payload: articles}});
    }
  });
}

// Handler for form requests regarding tools
function toolSubmitHandler(req, res) {
  const name = req.body.name;
  const email = req.body.email;
  const startDate = req.body.startDate;
  const endDate = req.body.endDate;
  const toolList = JSON.parse(req.body.toolList);
  //TODO: Add mailer
  res.redirect('/verktyg');
}

// Handler for the tools page
function toolHandler(req, res) {
  Tool.find(function (err, tools) {
    if (err) {
      console.error(err);
    }

    res.render('verktyg', {title: 'Verktyg', tools: tools});
  });
}


module.exports = {
  homeHandler : homeHandler,
  toolSubmitHandler : toolSubmitHandler,
  toolHandler : toolHandler
};