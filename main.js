var tweet = require('./tweets.js');
var express = require('express');
var bodyParser = require('body-parser');
var app = express();

var port = process.env.PORT || 1337

app.use(express.static('assets'));

app.get('/', function(req, res) {
    res.sendfile('index.html');
})

app.use(bodyParser.json());
app.use(bodyParser.urlencoded());
app.post('/', function(req, res) {
    tweet.clearTweetArray();
    console.log('hey');
    if (req.body.type === 'user') {
        var params = {screen_name: req.body.twitterHandle, count: 200};
        tweet.getUserTweets(params, function(data) {
            res.send({tweets: data});
            //Nah
        });
    }
    else {
        var params = {q: req.body.twitterHandle, count: 100 };
        tweet.getSearchTweets(params, function(data) {
            res.send({tweets: data});
            //Nah
        }, 10);
    };
});

app.listen(port, function() {
    console.log('Running on port 3000!');
});

//tweet.stream();
