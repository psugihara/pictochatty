var express = require('express'),
    app = express(),
    http = require('http'),
    path = require('path'),
    gifs = require('./libs/get_gifs.js'),
    server = http.createServer(app),
    io = require('socket.io').listen(server);

app.configure(function() {
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

app.configure('development', function() {
  app.use(express.errorHandler());
});

app.get('/', function(req, res) {
    res.render('index', { title: 'picchat' });
});

app.get('/:thread', function(req, res) {
    gifs.GetGifs('gif', function(fetched) {
        res.render('messages', { title: req.param('thread'), keyboard: fetched });
    });
});

var Channel = require('./libs/channel.js'),
    channels = {};

io.on('connection', function(client) {
    client.on('message', function(message) {

        var message = JSON.parse(message),
            name = message.channelName,
            channel = channels[name] || new Channel(name),
            msg = message.message;

        channels[name] = channel;

        if (!channel.member(client)) {
            channel.join(client);
        }

        channel.broadcast(msg, client);
    })
    client.on('disconnect', function() {
        for (var channel in channels)
            channels[channel].leave(client);
    }) 
})

server.listen(80);
console.log('Listening on port 80');