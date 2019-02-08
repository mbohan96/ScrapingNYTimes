
var mongoose = require("mongoose");
var Note = require("./Note");

var Schema = mongoose.Schema;

var ArticleSchema = new Schema({
  title: {
    type: String,
    required: true
  },
  summary: {
    type: String,
    required: true
  },
  link: {
    type: String,
    required: true
  },
  saved: {
    type: Boolean,
    default: true
  },

});

var Article = mongoose.model("Article", ArticleSchema);

module.exports = Article;

