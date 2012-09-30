var HOST = 'http://pictochatty.jit.su/';

var Messenger = function (channelName, textElement, messageListElement) {
  var possibleIdChars = ['©','∂','ß','å','œ','∑','®','†','¥','ø','π','…','æ','≥','≤','µ','∫'];
  this.channelName = channelName;
  this.idChar = possibleIdChars[Math.floor(Math.random()*18)]
  this.textElement = textElement;
  this.messageListElement = messageListElement;
  this.messageListItems = 40;
}

Messenger.prototype.receiveMessage = function(message) {
  var li = $('<li class="messageListItem">' + message + '</li>')

  // Alternate dark/light backgrounds.
  if (this.bg) {
    li.css('background', '#EEEEEE');
  } else {
    li.css('background', '#FFFFFF');
  }
  this.bg = !(this.bg)

  li.appendTo(this.messageListElement);
  this.adjustLineHeight();
  this.scrollToBottom();
}

Messenger.prototype.openSocket = function() {
  var self = this;
  this.socket = io.connect(HOST);
  this.sendMessage(true); // Send off a blank message to register for the channel.
  this.socket.on('message', function(data) {
    var msg = JSON.parse(data).msg;
    self.receiveMessage(msg);
  });
}

Messenger.prototype.sendMessage = function(allowBlank) {
  var msg = $(this.textElement).val().trim();
  if (msg || allowBlank) {
    msg = {
      channelName: this.channelName,
      message: msg
    }
    this.socket.emit('message', JSON.stringify(msg));
  }
}

Messenger.prototype.adjustLineHeight = function() {
  var height = ($(window).height() - $(this.textElement).height()) / this.messageListItems;
  $('.messageListItem').css('font-size', height + 'px');
  $('.messageListItem').css('line-height', 1.2*height + 'px');
}

Messenger.prototype.scrollToBottom = function() {
  $("html:not(:animated),body:not(:animated)").animate({ scrollTop: document.height}, 1200);
}


$(document).ready(function() {
  var channelName = $('#title').html(),
  messageText = $('#messageText'),
  messageList = $('#messageList'),
  mess = new Messenger(channelName, messageText, $('#messageList'));
  mess.openSocket();

  $('input#messageText').val(mess.idChar + ': ');
  $('#messageText').focus();

  messageText.keypress(function(event) {
    if (event.which === 13) { // return key
      mess.sendMessage();
      $('input#messageText').val(mess.idChar + ': ');
    }
  });

  $(window).resize(function(event) {
    mess.adjustLineHeight();
  });

});
