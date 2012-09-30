var Request = require('request');

var tumblr = 'http://api.tumblr.com/v2/tagged?api_key=qbNY5cK4GHZxPElqaVR63ZU9LlIpBhHm2BCpGjPACA1TtaNFjM&limit=20&tag=';

function GetGifs(tag, cb) {
  Request({url: tumblr + tag, json:true}, function (error, res, body) {
    if (!error && res.statusCode == 200) {
        console.log(tumblr + tag);
    var urls = new Array();
    var i = 0;
    for (var i = 0; i < body.response.length; i++)
    {
        var entry = body.response[i];
        if (typeof entry.photos !== 'undefined')
        {
            //console.log(entry.photos[0].original_size.url);
                urls[i] = entry.photos[0].original_size.url;
        }
    }

        cb(urls);
    }
    console.log('Response code: ' + res.statusCode + ' for ' + tumblr + tag);
  });  
}

module.exports.GetGifs = GetGifs;
