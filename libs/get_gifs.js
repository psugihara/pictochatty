var Request = require('request');

var tumblr = 'http://api.tumblr.com/v2/tagged?api_key=qbNY5cK4GHZxPElqaVR63ZU9LlIpBhHm2BCpGjPACA1TtaNFjM&limit=20&before=';

var DEFAULT = [
    'http://25.media.tumblr.com/tumblr_mb5f0oZedW1qzaos7o1_1280.gif',
    'http://24.media.tumblr.com/tumblr_lx1mw8RoSU1qil3j5o1_500.gif',
    'http://25.media.tumblr.com/tumblr_mb5viytVOI1rt8q5do1_500.gif',
    'http://25.media.tumblr.com/tumblr_m9p2ftlIo31rcg392o1_500.gif',
    'http://25.media.tumblr.com/tumblr_m48jttqlpH1qgbrt2o1_500.gif',
    'http://25.media.tumblr.com/tumblr_m5v6uwLJMn1rpiyaso1_r1_250.gif',
    'http://24.media.tumblr.com/tumblr_maitd7nZSZ1qzt4vjo1_r3_500.gif',
    'http://24.media.tumblr.com/tumblr_mb57tgaZWx1qetdhio1_250.gif',
    'http://25.media.tumblr.com/tumblr_mb2mbd5LYc1qi26lwo1_500.gif',
    'http://25.media.tumblr.com/tumblr_mb57tzP9pr1ru1axpo1_1280.gif',
    'http://25.media.tumblr.com/tumblr_mb570gDO381qc8ofbo1_400.gif',
    'http://25.media.tumblr.com/tumblr_madwkl6JpJ1qe6mn3o1_400.gif',
    'http://24.media.tumblr.com/tumblr_mb4ob4RoTf1rulzcho1_500.gif',
    'http://24.media.tumblr.com/tumblr_mb4dj9B4lJ1rt4xnho1_400.gif',
    'http://25.media.tumblr.com/tumblr_mb4t0t4GLp1qzyas5o1_400.gif',
    'http://25.media.tumblr.com/tumblr_mb52553Dje1rrvlodo1_500.gif',
    'http://24.media.tumblr.com/tumblr_mb47mu09TI1qkpz2go1_500.gif',
    'http://25.media.tumblr.com/tumblr_maiuev7ist1qfqip3o1_500.gif',
    'http://24.media.tumblr.com/tumblr_mb4z3vxLRJ1qzt4vjo1_500.gif',
    'http://24.media.tumblr.com/tumblr_mb4tfn7z1e1rehgzwo1_500.gif'
];

function randomDateIn2012() 
{
    var startOfYear = 1325431871;

    return startOfYear + Math.random() * (1349019156 - startOfYear);
}

function GetGifs(tag, cb) {
    Request({url: tumblr + randomDateIn2012() + '&tag=gif', json:true}, function (error, res, body) {
        if (!error && res.statusCode == 200) {

            var urls = [];

            for (var i = 0; i < body.response.length; i++) {
                var entry = body.response[i];
                if (typeof entry.photos !== 'undefined') {
                        urls[i] = entry.photos[0].original_size.url;
                }
            }

            cb(urls);
        }
        else {
            cb(DEFAULT);
            console.log('Response code: ' + res.statusCode + ' for ' + tumblr + tag);
        }
  });  
}

module.exports.GetGifs = GetGifs;
