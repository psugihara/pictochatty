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
  var msg = this.$text.html().trim();
  if (msg || allowBlank) {
    msg = {
      channelName: this.channelName,
      message: this.idChar + ': ' + msg
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
  $("html:not(:animated),body:not(:animated)").animate({ scrollTop: document.height }, 1200);
  $img = $('img');
  if ($img.length > 120) {
    $img.slice(0, $img.length - 120);
  }
}

var Keyboard = function(messenger) {
  this.messenger = messenger;
}

Keyboard.prototype.press = function(event) {
  var hit = true;
  switch (event.which) {
    case 13: //return
      this.messenger.sendMessage();
      this.messenger.$text.html('');
      break;
    case 65: // a
      this.messenger.$text.append($('#a img').clone());
      break;
    case 83: // s
      this.messenger.$text.append($('#s img').clone());
      break;
    case 68: // d
      this.messenger.$text.append($('#d img').clone());
      break;
    case 70: // f
      this.messenger.$text.append($('#f img').clone());
      break;
    case 71: // g
      this.messenger.$text.append($('#g img').clone());
      break;
    case 72: // h
      this.messenger.$text.append($('#h img').clone());
      break;
    case 74: // j
      this.messenger.$text.append($('#j img').clone());
      break;
    case 75: // k
      this.messenger.$text.append($('#k img').clone());
      break;
    case 76: // l
      this.messenger.$text.append($('#l img').clone());
      break;
    case 8: // delete
      $('img:last-child', this.messenger.$text).remove();
      break;
    default:
      hit = false;
  }
  if (hit)
      event.preventDefault().stopPropagation();
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

  $('body').keydown(function(event) {
    keyboard.press(event);
  });

  $(window).resize(function(event) {
    mess.adjustLineHeight();
  });

});
