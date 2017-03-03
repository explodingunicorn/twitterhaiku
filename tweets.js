var Twitter = require('twitter');

var client = new Twitter({
  consumer_key: 'bSBzWkiTGVpK4fsCPdc4rJgGY',
  consumer_secret: 'THXnbUfKSWqNRrOCFnBDbb5MYhsoTLksf98WBbokAesnwY2kvA',
  access_token_key: '403000276-KNQp8tCf2MKc8Hgoz0QMbd2eH75fYeGLwPMS3ECQ',
  access_token_secret: 'GzanOJn1i4ehryEncdA4Dn8BEUP6ILUPmvTMEmTRDOTNR'
});

var stream = function() {
    client.stream('statuses/filter', {track: 'javascript'}, function(stream) {
      stream.on('data', function(event) {
        console.log(event && event.text);
      });

      stream.on('error', function(error) {
        throw error;
      });
    });
};

var tweetArray = [];

var getSearchTweets = function(params, callback, count) {
    client.get('search/tweets', params, function(error, tweets, response) {
        if (!error) {
            tweets = tweets.statuses;
            if (tweets.length > 0 && count > 0) {
                params.max_id = tweets[tweets.length-1].id;
                count--;
                getSearchTweets(params, callback, count);
                console.log('reading more tweets');
            }
            else {
                var doCallback = true
            }

            tweetArray = tweetArray.concat(tweets);

            if (doCallback) {
                callback(tweetArray);
                console.log('done');
            }
        } else {
            console.log(error);
        }
    });
}

var getUserTweets = function(params, callback) {
    client.get('statuses/user_timeline', params, function(error, tweets, response) {
        if (!error) {
            if (tweets.length > 1) {
                params.max_id = tweets[tweets.length-1].id;
                getUserTweets(params, callback);
                console.log('reading more tweets');
            }
            else {
                var doCallback = true
            }

            tweetArray = tweetArray.concat(tweets);

            if (doCallback) {
                callback(tweetArray);
                console.log('done');
            }
        } else {
            console.log(error);
        }
    });
}

var clearTweetArray = function() {
    tweetArray = [];
}

module.exports = {
    getUserTweets: getUserTweets,
    getSearchTweets: getSearchTweets,
    clearTweetArray: clearTweetArray,
    stream: stream
}
