'use strict';

var ID_CHARS = ['©', '∂', 'ß', 'å', 'œ', '∑', '®', '†', '¥', 'ø', 'π',
    '…', 'æ', '≥', '≤', 'µ', '∫'];

var KEY_MAP = {
    13: 'return',
    65: 'a',
    83: 's',
    68: 'd',
    70: 'f',
    71: 'g',
    72: 'h',
    74: 'j',
    75: 'k',
    76: 'l',
    8: 'delete',
    32: 'space'
};

var Messenger = function (channelName, $text, messageListElement) {
    this.channelName = channelName;
    this.idChar = ID_CHARS[Math.floor(Math.random() * ID_CHARS.length)];
    this.$text = $text;
    this.messageListElement = messageListElement;
    this.messageListItems = 40;
};

Messenger.prototype.receiveMessage = function (message) {
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

Messenger.prototype.openSocket = function () {
    var self = this;
    this.socket = io.connect('/');
    this.sendMessage(true); // Send off a blank message to register for the channel.
    this.socket.on('message', function(data) {
        var msg = JSON.parse(data).msg;
        self.receiveMessage(msg);
    });
}

Messenger.prototype.sendMessage = function (allowBlank) {
    var msg = this.$text.html().trim();
    if (msg || allowBlank) {
        msg = {
            channelName: this.channelName,
            message: this.idChar + ': ' + msg
        }
        this.socket.emit('message', JSON.stringify(msg));
    }
}

Messenger.prototype.adjustLineHeight = function () {
    var height = ($(window).height() - this.$text.height()) / this.messageListItems;
    $('.messageListItem').css('font-size', height + 'px');
    $('.messageListItem').css('line-height', 1.2*height + 'px');
}

Messenger.prototype.scrollToBottom = function () {
    $("html:not(:animated),body:not(:animated)").animate({
        scrollTop: document.height
    }, 1200);

    var $img = $('img');
    if ($img.length > 120) {
        $img.slice(0, $img.length - 120);
    }
}

var Keyboard = function (messenger) {
    this.messenger = messenger;
};

Keyboard.prototype.press = function (key) {
    if (key === 13) { // return
        this.messenger.sendMessage();
        this.messenger.$text.html('');
    } else if (key === 8) { // delete
        $('img:last-child', this.messenger.$text).remove();
    } else if (key === 32) {
        this.refresh();
    } else {
        var key_val = KEY_MAP[key];
        this.messenger.$text.append($('#' + key_val + ' img').clone());
    }
};

Keyboard.prototype.refresh = function () {
    $.getJSON('/api/gifs?limit=9', function (data) {
        var i = 0,
            d = (new Date()).getTime();
        $('#keyboard img').each(function () {
            // We append a querystring so the image loads.
            $(this).attr('src', data[i++] + '?' + d);
        })
    });
};

$(document).ready(function () {
    var channelName = $('#title').html(),
    messageText = $('#messageText'),
    messageList = $('#messageList'),
    mess = new Messenger(channelName, messageText, $('#messageList'));
    mess.openSocket();

    var keyboard = new Keyboard(mess);

    $('input#messageText').val(mess.idChar + ': ');
    $('#messageText').focus();

    $('body').keydown(function (event) {
        if (KEY_MAP.hasOwnProperty(event.which)) {
            event.preventDefault();
            event.stopPropagation();
            keyboard.press(event.which);
        }
    });

    $(window).resize(function (event) {
        mess.adjustLineHeight();
    });

});
