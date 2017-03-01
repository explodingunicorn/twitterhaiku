function is17Syl(text) {
    text = RiTa.trimPunctuation(text);
    var syllables = RiTa.getSyllables(text);
    syllables = syllables.replace(new RegExp('/', 'g'), ' ').split(' ');
    var amountOfSyllables = syllables.length;

    if (amountOfSyllables === 17) {
        for (var i = 0; i < amountOfSyllables; i++) {
            var syl = syllables[i];
            if(syl === "." || syl === "!" || syl === ",") {
                return false;
                break;
            }
        }
        return RiTa.tokenize(text);
    }
    else
        return false;
}

function isHaiku(text) {
    if (!text) {
        return false;
    }

    console.log('checking haiku');
    var sylCount = 0;
    var check5 = false;
    var check7 = false;
    for (var i = 0; i < text.length; i++) {
        var syls = RiTa.getSyllables(text[i]);
        syls = syls.replace(new RegExp('/', 'g'), ' ').split(' ');
        sylCount += syls.length;

        if(sylCount === 5) {
            check5 = true;
            sylCount = 0;
            break;
        }
    }

    if (check5) {
        for (i; i < text.length; i++) {
            var syls = RiTa.getSyllables(text[i]);
            syls = syls.replace(new RegExp('/', 'g'), ' ').split(' ');
            sylCount += syls.length;

            if(sylCount === 7) {
                check7 = true;
                break;
            }
        }
    }
    else {
        return "Not a haiku";
    }

    if (check7) {
        console.log('This is a haiku:');
        return RiTa.untokenize(text);
    }
    else {
        return "Not a haiku";
    }
}

var createHaikuTweets = function(data) {
    var tweets = data.tweets;
    var tweetText;
    var rm = new RiMarkov(3);
    for (var i = 0; i < tweets.length; i++) {
        var tweet = tweets[i].text;
        tweetArray = tweet.split(" ");
        for (var j = 0; j < tweetArray.length; j++) {
            if(tweetArray[j][0] == '@' || tweetArray[j][0] == '#' || tweetArray[j].substring(0,4) === 'http') {
                tweetArray.splice(j, 1);
                j--;
            }
        }
        untokenizedText = RiTa.untokenize(tweetArray)
        tweetText += untokenizedText + ' ';
        console.log (isHaiku(is17Syl(untokenizedText)));
    }
}

$('#submit').click(function() {
    $.ajax({
        url: '/',
        type: 'POST',
        contentType: "application/json",
        data: JSON.stringify({twitterHandle: "DestinyHarrigan"}),
        complete: function() {
            console.log('process done');
        },
        success: function(data) {
            createHaikuTweets(data);
        },
        error: function() {
            console.log('There was an error');
        }
    })
})
