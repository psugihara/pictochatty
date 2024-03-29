'use strict';

var express = require('express'),
    app = express(),
    http = require('http'),
    path = require('path'),
    gifs = require('./libs/gifs.js'),
    server = http.createServer(app),
    io = require('socket.io').listen(server);

app.configure(function () {
    app.set('port', process.env.PORT || 3000);
    app.set('views', __dirname + '/views');
    app.set('view engine', 'ejs');
    app.use(express.favicon());
    app.use(express.logger('dev'));
    app.use(express.bodyParser());
    app.use(express.methodOverride());
    app.use(express.cookieParser('your secret here'));
    app.use(express.session());
    app.use(app.router);
    app.use(express.static(path.join(__dirname, 'public')));
});

app.configure('development', function () {
    app.use(express.errorHandler());
});

app.get('/', function (req, res) {
    res.render('index', { title: 'picchat' });
});

app.get('/:thread', function (req, res) {
    var tag = req.params.thread + '+gif';
    gifs.getGifs(tag, function (fetched) {
        res.render('messages', {
            title: req.param('thread'),
            keyboard: fetched
        });
    });
});

app.get('/api/gifs', function (req, res) {
    gifs.getGifs('gif', function (fetched) {
        var limit = req.query.limit || fetched.length;
        res.json(fetched.slice(0, limit));
    });
});

io.on('connection', function (client) {
    client.on('message', function (message) {
        message = JSON.parse(message);
        var out = JSON.stringify({ msg: message.message });
        client.join(message.channelName);
        io.sockets.in(message.channelName).emit('message', out);
    });
});

server.listen(80);
console.log('Listening on port 80');
