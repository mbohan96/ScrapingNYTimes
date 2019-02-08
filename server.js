var express = require("express");
var bodyParser = require("body-parser");
var logger = require("morgan");
var mongoose = require("mongoose");
var path = require("path");


var Note = require("./models/Note.js");
var Article = require("./models/Article.js");

var request = require("request");
var cheerio = require("cheerio");




var port = process.env.PORT || 3000

var app = express();


app.use(logger("dev"));
app.use(bodyParser.urlencoded({
  extended: false
}));


var exphbs = require("express-handlebars");

app.engine("handlebars", exphbs({
    defaultLayout: "main",
    partialsDir: path.join(__dirname, "/views/layouts/partials")
}));
app.set("view engine", "handlebars");


mongoose.connect("mongodb");

var db = mongoose.connection;

db.on("error", function(error) {
  console.log("Mongoose Error: ", error);
});


db.once("open", function() {
  console.log("Mongoose connection successful.");
});


app.get("/", function(req, res) {
  Article.find({"saved": false}, function(error, data) {
    var hbsObject = {
      article: data
    };
    console.log(hbsObject);
    res.render("home", hbsObject);
  });
});

app.get("/saved", function(req, res) {
  Article.find({"saved": true}).populate("notes").exec(function(error, articles) {
    var hbsObject = {
      article: articles
    };
    res.render("saved", hbsObject);
  });
});


app.get("/scrape", function(req, res) {
 
  request("https://www.nytimes.com/", function(error, response, html) {
   
    var $ = cheerio.load(html);
  
    $("article").each(function(i, element) {


      var result = {};



 
      var entry = new Article(result);

   
      entry.save(function(err, doc) {
        
        if (err) {
          console.log(err);
        }
      
        else {
          console.log(doc);
        }
      });

    });

  });
 
});


app.get("/articles", function(req, res) {
 
  Article.find({}, function(error, doc) {
    
    if (error) {
      console.log(error);
    }
    else {
      res.json(doc);
    }
  });
});




app.post("/articles/save/:id", function(req, res) {
     
      Article.findOneAndUpdate({ "_id": req.params.id }, { "saved": true})
      
      .exec(function(err, doc) {
      
        if (err) {
          console.log(err);
        }
        else {
       
          res.send(doc);
        }
      });
});






app.listen(port, function() {
  console.log("App running on port " + port);
});

