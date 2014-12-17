var socket = io();

$('form').submit(function(e) {
	e.preventDefault();
	var message = {
		text : $('#m').val()
	}
    $('#m').val('');
	socket.emit('chat-message', message);
});

socket.on('chat-message', function(message) {
	$('#messages').append($('<li>').text(message.text));
});