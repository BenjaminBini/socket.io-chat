# Socket.io : Chat

Cette application reprend les sources du tutoriel présent sur le blog [bini.io](http://blog.bini.io) :

* [Partie 1](http://blog.bini.io/developper-une-application-avec-socket-io/)
* [Partie 2](http://blog.bini.io/developper-un-chat-avec-socket-io-partie-2/)
* [Partie 3](http://blog.bini.io/developper-un-chat-avec-socket-io-partie-3/)

Ce tutoriel est lui même une adaptation du [tutoriel officiel](http://socket.io/get-started/chat/) de socket.io.

Cette version ajoute les fonctionnalités suivantes par rapport à la version du tutoriel officiel :

* Support des noms d'utilisateurs
* Affichage d'un message lors de la connexion/déconnexion d'un utilisateur
* Affichage de la liste des utilisateurs connectés
* Conservation d'un historique des messages
* Affichage du texte "typing" à côté du nom des utilisateurs en train de saisir un message

## Installation

Si vous n'avez pas bower d'installé sur votre machine, installez-le au préalable de la façon suivante :
```
npm install -g bower
```

Pour installer l'application, téléchargez les sources (zip ou git clone) et exécutez la commande suivante depuis la racine du projet.
```
npm install
bower install
```

## Démarrer l'application

Pour démarrer l'application, exécutez la commande suivante depuis la racine du projet.
```
node server
```

L'application est désormais accesssible à l'url **http://localhost:3000/**.

