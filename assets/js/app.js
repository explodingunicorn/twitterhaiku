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
    var syllables = RiTa.getSyllables(trimmedText);
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

function checkSyllables(trimmedText, originalText) {
    console.log('checking haiku');
    console.log(trimmedText);
    var text = trimmedText;
    var sylCount = 0;
    var check5 = false;
    var check7 = false;
    var i = 0;
    for (i; i < text.length; i++) {
        var syls = RiTa.getSyllables(text[i]);
        syls = syls.replace(new RegExp('/', 'g'), ' ').split(' ');
        syls = correctSymbols(syls);
        sylCount += syls.length;

        console.log(syls);
        if(sylCount === 5) {
            console.log('5');
            check5 = true;
            sylCount = 0;
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

            console.log(syls);
            if(sylCount === 7) {
                console.log('7');
                check7 = true;
                break;
            }
        }
    }
    else {
        return false;
    }

    if (check7) {
        console.log('This is a haiku:');
        return originalText;
    }
    else {
        return false;
    }
}

var createHaikuTweets = function(data) {
    var tweets = data;
    var tweetText;
    var haikuArray = [];
    for (var i = 0; i < tweets.length; i++) {
        var tweet = tweets[i].text;
        tweetArray = tweet.split(" ");
        for (var j = 0; j < tweetArray.length; j++) {
            if(tweetArray[j][0] === '@' || tweetArray[j][0] === '#') {
                tweetArray[j][0] = '';
            }
            else if (tweetArray[j].substring(0,4) === 'http')  {
                tweetArray.splice(j, 1);
                j--;
            }
        }
        untokenizedText = RiTa.untokenize(tweetArray)
        tweetText += untokenizedText + ' ';
        var haiku = isHaiku(untokenizedText);
        if (haiku) {
            haikuArray.push(tweet);
        }
    }
    for (var j = 0; j < haikuArray.length; j++) {
        console.log(haikuArray[j]);
    }
}

$('#submit').click(function() {
    $.ajax({
        url: '/',
        type: 'POST',
        contentType: "application/json",
        data: JSON.stringify({twitterHandle: "HalfBlackRanger"}),
        complete: function() {
            console.log('process done');
        },
        success: function(data) {
            createHaikuTweets(data.tweets);
        },
        error: function() {
            console.log('There was an error');
        }
    })
})
