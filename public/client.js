/*global io*/
var socket = io();

/**
 * Connexion
 */
$('#login form').submit(function (e) {
  e.preventDefault();
  if ($('#login input').val().trim().length > 0) { // Si le champ de connexion n'est pas vide
    $('body').removeAttr('id'); // Cache formulaire de connexion
    $('#chat input').focus(); // Focus sur le champ du message
  }
});

/**
 * Envoi d'un message
 */
$('#chat form').submit(function (e) {
  e.preventDefault();
  var message = {
    text : $('#m').val()
  };
  $('#m').val('');
  if (message.text.trim().length !== 0) { // Gestion message vide
    socket.emit('chat-message', message);
  }
  $('#chat input').focus(); // Focus sur le champ du message
});

/**
 * Réception d'un message
 */
socket.on('chat-message', function (message) {
  $('#messages').append($('<li>').text(message.text));
});
