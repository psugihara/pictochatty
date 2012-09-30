var HOST = 'http://pictochatty.jit.su/';

var Messenger = function (channelName, $text, messageListElement) {
  var possibleIdChars = ['©','∂','ß','å','œ','∑','®','†','¥','ø','π','…','æ','≥','≤','µ','∫'];
  this.channelName = channelName;
  this.idChar = possibleIdChars[Math.floor(Math.random()*18)]
  this.$text = $text;
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
  var msg = this.$text.val().trim();
  if (msg || allowBlank) {
    msg = {
      channelName: this.channelName,
      message: msg
    }
    this.socket.emit('message', JSON.stringify(msg));
  }
}

Messenger.prototype.adjustLineHeight = function() {
  var height = ($(window).height() - this.$text.height()) / this.messageListItems;
  $('.messageListItem').css('font-size', height + 'px');
  $('.messageListItem').css('line-height', 1.2*height + 'px');
}

Messenger.prototype.scrollToBottom = function() {
  $("html:not(:animated),body:not(:animated)").animate({ scrollTop: document.height}, 1200);
}

var Keyboard = function(messenger) {
  this.messenger = messenger;
}

Keyboard.prototype.press = function(key) {
  switch (key) {
    case 13: //return
      this.messenger.sendMessage();
      this.messenger.$text.html(this.messenger.idChar + ': ');
      break;
    case 97: // a
      this.messenger.$text.append($('#a').clone());
      break;
    case 115: // s
      this.messenger.$text.append($('#s').clone());
      break;
    case 100: // d
      this.messenger.$text.append($('#d').clone());
      break;
    case 102: // f
      this.messenger.$text.append($('#f').clone());
      break;
    case 103: // g
      this.messenger.$text.append($('#g').clone());
      break;
    case 104: // h
      this.messenger.$text.append($('#h').clone());
      break;
    case 106: // j
      this.messenger.$text.append($('#j').clone());
      break;
    case 107: // k
      this.messenger.$text.append($('#k').clone());
      break;
    case 108: // l
      this.messenger.$text.append($('#l').clone());
  }
}

$(document).ready(function() {
  var channelName = $('#title').html(),
  messageText = $('#messageText'),
  messageList = $('#messageList'),
  mess = new Messenger(channelName, messageText, $('#messageList'));
  mess.openSocket();

  keyboard = new Keyboard(mess);

  $('input#messageText').val(mess.idChar + ': ');
  $('#messageText').focus();

  $('body').keypress(function(event) {
    keyboard.press(event.which);
    event.preventDefault();
  });

  $(window).resize(function(event) {
    mess.adjustLineHeight();
  });

});
