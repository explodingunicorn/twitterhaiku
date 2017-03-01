var tweet = require('./tweets.js');
var express = require('express');
var bodyParser = require('body-parser');
var app = express();

app.use(express.static('assets'));

app.get('/', function(req, res) {
    res.sendfile('index.html');
})

app.use(bodyParser.json());
app.use(bodyParser.urlencoded());
app.post('/', function(req, res) {
    console.log(req.body.twitterHandle);
    tweet.getTweets(req.body.twitterHandle, function(data) {
        res.send({tweets: data});
        //Nah
    });
})

app.listen(3000, function() {
    console.log('Running on port 3000!');
});

//tweet.stream();
