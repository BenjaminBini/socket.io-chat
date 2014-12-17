var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);

// On gère les requêtes HTTP des utilisateurs en leur renvoyant les fichiers du dossier 'public'
app.use("/", express.static(__dirname + "/public"));

io.on('connection', function(socket){

	// Log de connexion et de déconnexion des utilisateurs
	console.log('a user connected');
	socket.on('disconnect', function() {
		console.log('user disconected');
	})

	// Réception de l'événement 'chat-message' et réémission vers tous les utilisateurs
	socket.on('chat-message', function(message) {
		io.emit('chat-message', message);
	});
});

// On lance le serveur en écoutant les connexions arrivant sur le port 3000
http.listen(3000, function(){
	console.log('Server is listening on *:3000');
});
