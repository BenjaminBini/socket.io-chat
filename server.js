var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);

/**
 * Gestion des requêtes HTTP des utilisateurs en leur renvoyant les fichiers du dossier 'public'
 */
app.use("/", express.static(__dirname + "/public"));

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
   * Déconnexion d'un utilisateur : broadcast d'un 'service-message'
   */
  socket.on('disconnect', function () {
    if (loggedUser !== undefined) {
      console.log('user disconnected : ' + loggedUser.username);
      var serviceMessage = {
        text: 'User "' + loggedUser.username + '" disconnected',
        type: 'logout'
      };
      socket.broadcast.emit('service-message', serviceMessage);
    }
  });

  /**
   * Connexion d'un utilisateur via le formulaire :
   *  - sauvegarde du user
   *  - broadcast d'un 'service-message'
   */
  socket.on('user-login', function (user) {
    loggedUser = user;
    if (loggedUser !== undefined) {
      var serviceMessage = {
        text: 'User "' + loggedUser.username + '" logged in',
        type: 'login'
      };
      socket.broadcast.emit('service-message', serviceMessage);
    }
  });

  /**
   * Réception de l'événement 'chat-message' et réémission vers tous les utilisateurs
   */
  socket.on('chat-message', function (message) {
    message.username = loggedUser.username;
    io.emit('chat-message', message);
    console.log('Message de : ' + loggedUser.username);
  });
});

/**
 * Lancement du serveur en écoutant les connexions arrivant sur le port 3000
 */
http.listen(3000, function () {
  console.log('Server is listening on *:3000');
});