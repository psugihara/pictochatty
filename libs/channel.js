var Channel = module.exports = function(name, clients) {
  this.name = name;
  this.clients = (clients instanceof Array) ? clients : new Array();
  this.messages = [];
}

Channel.prototype.broadcast = function(message) {
  // this.messages.push(message); // don't save for now.
  var msg = JSON.stringify({ msg: message });
  this.clients.map(function(client) {
    client.send(msg);
  });
}

Channel.prototype.bulkBroadcast = function(messages) {
  var msgs = { msgs: messages };
  client.send(JSON.stringify(msgs));
}

Channel.prototype.join = function(client) {
  this.clients.push(client);
  // Send backlogged messages.
}

Channel.prototype.leave = function(client) {
  this.clients = this.clients.filter(function(c) {
    c != client;
  });
}

Channel.prototype.member = function(client) {
  return this.clients.indexOf(client) >= 0;
}