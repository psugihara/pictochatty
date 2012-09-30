var Request = require('request');

var tumblr = 'http://api.tumblr.com/v2/tagged?api_key=qbNY5cK4GHZxPElqaVR63ZU9LlIpBhHm2BCpGjPACA1TtaNFjM&limit=20&tag=';

function GetGifs(tag) {
  Request({url: tumblr + tag, json:true}, function (error, res, body) {
    if (!error && res.statusCode == 200) {
        console.log(tumblr + tag);
    var urls = new Array();
    var i = 0;
        console.log(body.response.length);
    for (var i = 0; i < body.response.length; i++)
    {
            var entry = body.response[i];
            console.log(entry);
    if (typeof entry.photos !== 'undefined')
    {
                urls[i] = entry.photos[0].original_size.url;
       }
    }

        console.log(urls)
return urls;
    }
    console.log('Response code: ' + res.statusCode + ' for ' + tumblr + tag);
  });  
}

module.exports = GetGifs;
