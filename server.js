var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var i;

/**
 * Gestion des requêtes HTTP des utilisateurs en leur renvoyant les fichiers du dossier 'public'
 */
app.use('/', express.static(__dirname + '/public'));

/**
 * List of connected users
 */
var users = [];

/**
 * Historique des messages
 */
var messages = [];

io.on('connection', function (socket) {

  /**
   * Utilisateur connecté à la socket
   */
  var loggedUser;

  /**
   * Log de connexion d'un utilisateur (avant login)
   */
  console.log('a user connected');

  /**
   * Emission d'un événement "user-login" pour chaque utilisateur connecté
   */
  for (i = 0; i < users.length; i++) {
    socket.emit('user-login', users[i]);
  }

  /** 
   * Emission d'un événement "chat-message" pour chaque message de l'historique
   */
  for (i = 0; i < messages.length; i++) {
    if (messages[i].username !== undefined) {
      socket.emit('chat-message', messages[i]);
    } else {
      socket.emit('service-message', messages[i]);
    }
  }

  /**
   * Déconnexion d'un utilisateur :
   *  - suppression de la liste des connectés
   *  - broadcast d'un 'service-message'
   *  - ajout du message à l'historique
   *  - broadcast d'un 'user-logout' contenant le user
   */
  socket.on('disconnect', function () {
    if (loggedUser !== undefined) {
      console.log('user disconnected : ' + loggedUser.username);
      var serviceMessage = {
        text: 'User "' + loggedUser.username + '" disconnected',
        type: 'logout'
      };
      var userIndex = users.indexOf(loggedUser);
      if (userIndex !== -1) {
        users.splice(userIndex, 1);
      }
      socket.broadcast.emit('service-message', serviceMessage);
      messages.push(serviceMessage);
      io.emit('user-logout', loggedUser);
    }
  });

  /**
   * Connexion d'un utilisateur via le formulaire :
   *  - sauvegarde du user
   *  - ajout à la liste des connectés
   *  - émission d'un 'service-message' pour rappeler le pseudo de l'utilisateur
   *  - broadcast d'un 'service-message'
   *  - ajout du message broadcasté à l'historique
   *  - événement global contenant le user
   *  - appel du callback
   */
  socket.on('user-login', function (user, callback) {
    var userIndex = -1;
    for (i = 0; i < users.length; i++) {
      if (users[i].username === user.username) {
        userIndex = i;
      }
    }
    if (user !== undefined && userIndex === -1) {
      loggedUser = user;
      users.push(loggedUser);
      var userServiceMessage = {
        text: 'You logged in as "' + loggedUser.username + '"',
        type: 'login'
      };
      var broadcastedServiceMessage = {
        text: 'User "' + loggedUser.username + '" logged in',
        type: 'login'
      };
      socket.emit('service-message', userServiceMessage);
      socket.broadcast.emit('service-message', broadcastedServiceMessage);
      messages.push(broadcastedServiceMessage);
      io.emit('user-login', loggedUser);
      callback(true);
    } else {
      callback(false);
    }
  });

  /**
   * Réception de l'événement 'chat-message' et réémission vers tous les utilisateurs
   * Ajout à la liste des messages et purge si nécessaire
   */
  socket.on('chat-message', function (message) {
    message.username = loggedUser.username;
    io.emit('chat-message', message);
    console.log('Message de : ' + loggedUser.username);
    messages.push(message);
    if (messages.length > 150) {
      messages.splice(0, 1);
    }
  });
});

/**
 * Lancement du serveur en écoutant les connexions arrivant sur le port 3000
 */
http.listen(3000, function () {
  console.log('Server is listening on *:3000');
});