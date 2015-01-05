/*global io*/
/*jslint browser: true*/
var socket = io();

/*** Fonctions utiles ***/

/**
 * Scroll vers le bas de page si l'utilisateur n'est pas remonté pour lire d'anciens messages
 */
function scrollToBottom() {
  if ($(window).scrollTop() + $(window).height() + 2 * $('#messages li').last().outerHeight() >= $(document).height()) {
    $("html, body").animate({ scrollTop: $(document).height() }, 0);
  }
}

/*** Gestion des événements ***/

/**
 * Connexion d'un utilisateur
 */
$('#login form').submit(function (e) {
  e.preventDefault();
  var user = {
    username : $('#login input').val().trim()
  };
  if (user.username.length > 0) { // Si le champ de connexion n'est pas vide
    socket.emit('user-login', user);
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
  $('#messages').append($('<li>').html('<span class="username">' + message.username + '</span> ' + message.text));
  scrollToBottom();
});

/**
 * Réception d'un message de service
 */
socket.on('service-message', function (message) {
  $('#messages').append($('<li class="' + message.type + '">').html('<span class="info">information</span> ' + message.text));
  scrollToBottom();
});