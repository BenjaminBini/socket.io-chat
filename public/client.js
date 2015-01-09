/*global io, rivets, utils*/
/*jslint browser: true*/
var socket = io();
var i, j;

/**
 * Liste des messages
 */
var messages = [];

/**
 * Liste des utilisateurs
 */
var users = [];


/*** DataBinding initial ***/

rivets.bind($('#messages'), { messages : messages });
rivets.bind($('#users'), { users : users });


/*** Gestion des événements ***/

/**
 * Connexion de l'utilisateur
 * Uniquement si le username n'est pas vide et n'existe pas encore
 */
$('#login form').submit(function (e) {
  e.preventDefault();
  var user = {
    username : $('#login input').val().trim()
  };
  if (user.username.length > 0) { // Si le champ de connexion n'est pas vide
    socket.emit('user-login', user, function (success) {
      if (success) {
        $('body').removeAttr('id'); // Cache formulaire de connexion
        $('#chat input').focus(); // Focus sur le champ du message
      }
    });
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
  message.label = message.username;
  messages.push(message);
  utils.scrollToBottom();
});

/**
 * Réception d'un message de service
 */
socket.on('service-message', function (message) {
  message.label = 'information';
  messages.push(message);
  utils.scrollToBottom();
});

/**
 * Connexion d'un nouvel utilisateur
 */
socket.on('user-login', function (user) {
  users.push(user);
  setTimeout(function () {
    $('#users li.new').removeClass('new');
  }, 1000);
});

/**
 * Déconnexion d'un utilisateur
 */
socket.on('user-logout', function (user) {
  var userIndex = users.indexOf(user);
  if (userIndex !== -1) {
    users.splice(userIndex, 1);
  }
});

/**
 * Détection saisie utilisateur
 */
var typingTimer;
var isTyping = false;

$('#m').keypress(function () {
  clearTimeout(typingTimer);
  if (!isTyping) {
    socket.emit('start-typing');
    isTyping = true;
  }
});

$('#m').keyup(function () {
  clearTimeout(typingTimer);
  typingTimer = setTimeout(function () {
    if (isTyping) {
      socket.emit('stop-typing');
      isTyping = false;
    }
  }, 500);
});

/**
 * Gestion saisie des autres utilisateurs
 */
socket.on('update-typing', function (typingUsers) {
  for (i = 0; i < users.length; i++) {
    users[i].typing = false;
  }
  for (i = 0; i < typingUsers.length; i++) {
    for (j = 0; j < users.length; j++) {
      if (typingUsers[i].username === users[j].username) {
        users[j].typing = true;
        break;
      }
    }
  }
});