"use strict";

var request = require('request');

var KEY = 'qbNY5cK4GHZxPElqaVR63ZU9LlIpBhHm2BCpGjPACA1TtaNFjM';
var TUMBLR = 'http://api.tumblr.com/v2/tagged?api_key=' + KEY + '&limit=20';
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

var dateIn2012 = module.exports.dateIn2012 = function () {
    var startOfYear = 1325431871;
    return startOfYear + Math.random() * (1349019156 - startOfYear);
};

var getGifs = module.exports.getGifs = function (tag, cb) {

    var req = {
        url: TUMBLR + '&before=' + dateIn2012() + '&tag=gif',
        json: true
    };

    request(req, function (error, res, body) {
        if (!error && res.statusCode === 200) {

            var urls, i, entry;

            urls = [];

            for (i = 0; i < body.response.length; i += 1) {
                entry = body.response[i];
                if (typeof entry.photos !== 'undefined') {
                    urls[i] = entry.photos[0].original_size.url;
                }
            }

            cb(urls);
        } else {
            cb(DEFAULT);
            console.log('Response code: ' + res.statusCode + ' for ' + req.url);
        }
    });
};
