var Haiku = function(haiku, user, img) {
    this.haiku = haiku;
    this.userName = user;
    this.userImg = img;
}

function correctSymbols(sylArray) {
    for (var i = 0; i < sylArray.length; i++) {
        if (sylArray[i] === '@') {
            sylArray[i+1] = '@' + sylArray[i+1]
            sylArray.splice(i, 1);
            i--;
        }
        else if (sylArray[i] === '#') {
            sylArray[i+1] = '#' + sylArray[i+1]
            sylArray.splice(i, 1);
            i--;
        }
    }

    return sylArray;
}

function checkSpecialChar(syl) {
    if(syl === "." || syl === "!" || syl === "," || syl === '?' || syl === ':' || syl === '-') {
        return true;
    }
    else {
        return false
    }
}

function isHaiku(text) {
    trimmedText = RiTa.stripPunctuation(text);
    var readable = true;

    try {
        var syllables = RiTa.getSyllables(trimmedText);
    }
    catch(e) {
        readable = false;
    }

    if(readable) {
        syllables = syllables.replace(new RegExp('/', 'g'), ' ').split(' ');
        syllables = correctSymbols(syllables);
        var amountOfSyllables = syllables.length;

        if (amountOfSyllables === 17) {
            for (var i = 0; i < amountOfSyllables; i++) {
                var syl = syllables[i];
                if(checkSpecialChar(syl)) {
                    return false;
                    break;
                }
            }
            return checkSyllables(trimmedText.split(' '), text);
        }
        else {
            return false;
        }
    }
}

function checkSyllables(trimmedText, originalText) {
    console.log('checking haiku');
    console.log(trimmedText);
    var text = trimmedText;
    var sylCount = 0;
    var check5 = false;
    var check7 = false;
    var i = 0;
    var haikuFormation = {
        firstLine: 0,
        secondLine: 0,
    }

    for (i; i < text.length; i++) {
        var syls = RiTa.getSyllables(text[i]);
        syls = syls.replace(new RegExp('/', 'g'), ' ').split(' ');
        syls = correctSymbols(syls);
        sylCount += syls.length;

        if(sylCount === 5) {
            check5 = true;
            sylCount = 0;
            haikuFormation.firstLine = i;
            i++;
            break;
        }
    }

    sylCount = 0;
    if (check5) {
        for (i; i < text.length; i++) {
            var syls = RiTa.getSyllables(text[i]);
            syls = syls.replace(new RegExp('/', 'g'), ' ').split(' ');
            syls = correctSymbols(syls);
            sylCount += syls.length;

            if(sylCount === 7) {
                check7 = true;
                haikuFormation.secondLine = i;
                break;
            }
        }
    }
    else {
        return false;
    }

    if (check7) {
        console.log('This is a haiku:');
        return (haikuFormation);
    }
    else {
        return false;
    }
}

var formatHaiku = function(text, form) {
    var textArr = text.split(' ');
    console.log(form);
    for (var i = 0; i < textArr.length; i++) {
        if(i === form.firstLine) {
            textArr[i] = textArr[i] + '<br>';
            console.log('newline');
        }
        else if(i === form.secondLine) {
            textArr[i] = textArr[i] + '<br>';
            console.log('newline');
        }
    }

    return '<p>' + textArr.join(' ') + '</p>';
}

var createHaikuTweets = function(data) {
    var tweets = data;

    var tweetText;
    var haikuArray = [];
    var containsLink = false;
    for (var i = 0; i < tweets.length; i++) {
        var tweet = tweets[i].text;
        containsLink = false;
        tweetArray = tweet.split(" ");
        for (var j = 0; j < tweetArray.length; j++) {
            if(tweetArray[j][0] === '@' || tweetArray[j][0] === '#') {
                tweetArray[j][0] = '';
            }
            else if (tweetArray[j].substring(0,4) === 'http')  {
                containsLink = true;
            }
        }
        if(!containsLink) {
            untokenizedText = RiTa.untokenize(tweetArray)
            tweetText += untokenizedText + ' ';
            var haikuForm = isHaiku(untokenizedText);

            if (haikuForm) {
                formattedHaiku = formatHaiku(tweet, haikuForm);
                haikuArray.push(new Haiku(formattedHaiku, tweets[i].user.screen_name, tweets[i].user.profile_image_url_https));
            }
        }
    }
    for (var j = 0; j < haikuArray.length; j++) {
        console.log(haikuArray[j].haiku);
    }

    app.haikus = haikuArray;
};

var app = new Vue({
    el: '.app',
    data: {
        title: 'Twitter Haiku',
        search: true,
        loading: false,
        retrieving: false,
        haikus: [],
        index: 0
    },
    methods: {
        searchTweets: function(event) {
            this.search = false;
            this.loading = true;
            this.retrieving = true;

            var value = $('.twitterSearch').val();
            var tweetType;
            if (value[0] === '@') {
                value[0] = '';
                tweetType = 'user';
            }
            else {
                tweetType = 'search';
            }

            $.ajax({
                url: '/',
                type: 'POST',
                contentType: "application/json",
                data: JSON.stringify({type: tweetType, twitterHandle: value}),
                complete: function() {

                },
                success: function(data) {
                    app.hideRetrieving();
                    createHaikuTweets(data.tweets);
                    app.hideLoading();
                    console.log(data.tweets);
                },
                error: function() {
                    console.log('There was an error');
                }
            })
        },
        reSearchTweets: function() {
            this.searchTweets();
            this.index = 0;
        },
        hideLoading: function() {
            this.loading = false;
        },
        hideRetrieving: function() {
            console.log('hello');
            this.retrieving = false;
        },
        twitterLink: function() {
            return "https://twitter.com/" + haikus[index].userName;
        }
    }
});

$("#twitterSearch").on('keyup', function (e) {
    if (e.keyCode == 13) {
        app.loading = true;
        app.searchTweets();
        console.log('hi');
    }
});

$("#fixedTwitterSearch").on('keyup', function (e) {
    if (e.keyCode == 13) {
        app.loading = true;
        app.searchTweets();
        console.log('hi');
    }
});
