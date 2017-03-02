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

var getTweets = function(user, callback) {
    var params = {screen_name: user, count: 200};
    client.get('statuses/user_timeline', params, function(error, tweets, response) {
      if (!error) {
        callback(tweets);
    } else {
        console.log(error);
    }
    });
}

module.exports = {
    getTweets: getTweets,
    stream: stream
}
