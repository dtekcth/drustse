
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = Schema.Types.ObjectId;

const NewsArticleSchema = Schema({
  id:     { type: ObjectId },
  posted: { type: String },
  title:  { type: String },
  body:   { type: String }
});

const NewsArticle = mongoose.model('NewsArticle', NewsArticleSchema);

module.exports = NewsArticle;
