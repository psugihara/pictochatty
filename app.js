var app = require('express')(),
    http = require('http'),
    server = http.createServer(app),
    io = require('socket.io').listen(server);

server.listen(3000);
app.get('/', function(req, res){
    res.send('Hello World');
});

var Channel = require('./libs/channel.js'),
    channels = [];

var channelNamed = function(name) {
    var channel = _.detect(channels, function(channel) { return (channel.name === name); });
    if (!channel) {
        channel = new Channel(name);
        channels.push(channel);
    }
    return channel;
}

io.on('connection', function(client) {
    client.on('message', function(message) {
        console.log(message);
        var message = JSON.parse(message);
        var channel = channelNamed(message.channelName);
        var msg = message.message;
        if (!channel.member(client)) {
            channel.join(client);
        }
        channel.broadcast(msg, client);
        // TODO: DB.storeMessage(message)...
    })
    client.on('disconnect', function() {
        _.each(channels, function(channel) { channel.leave(client); });
    }) 
})

server.listen(3000);
console.log('Listening on port 3000');