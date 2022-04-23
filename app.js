require('./Database')

//Script d'initialisation du serveur
var express = require('express');
const { pathToFileURL } = require('url');
var app = express();
var serv = require('http').Server(app);
 
app.get('/',function(req, res) {
    res.sendFile(__dirname + '/client/index.html');
});
app.use('/client',express.static(__dirname + '/client'));
serv.listen(2000);

console.log("Serveur : Serveur connecté");

//********************************************************
var SOCKET_LIST = {};   

//Liaison avec socket.io
var io = require('socket.io')(serv,{});


var PLAYER_LIST = {};

var Player = function(id){
	var self = {
		username:"",
		x:100,
		y:400,
		id:id,
		pressingRight:false,
		pressingLeft:false,
		pressingUp:false,
		maxSpd:10,
		gravity:5
	}
	self.updatePosition = function(){
		if(self.pressingRight)
			self.x += self.maxSpd;
		if(self.pressingLeft)
			self.x -= self.maxSpd;
		if(self.pressingUp)
			self.y -= self.maxSpd;
		if(self.pressingDown)
			self.y += self.maxSpd;
		
	}

	return self;
}

//Connexion du joueur
io.sockets.on('connection', function(socket){
	socket.id = Math.random();
	SOCKET_LIST[socket.id] = socket;
	var player = Player(socket.id);
	PLAYER_LIST[socket.id] = player;

	socket.on('signIn',function(data){
		Database.isValidPassword(data,function(res){
			if(res){
				socket.emit('signInResponse',{success:true});
				player.username = data.username;
			} else {
				socket.emit('signInResponse',{success:false});			
			}
		});
	});
	socket.on('signUp',function(data){
		Database.isUsernameTaken(data,function(res){
			if(res){
				socket.emit('signUpResponse',{success:false});		
			} else {
				Database.addUsername(data,function(){
					socket.emit('signUpResponse',{success:true});					
				});
			}
		});	
	});

    //Tchat du jeu :
    //Envoi de message
    socket.on('sendMsgToServer', function(data) {
        //var playerName = ("" + socket.id).slice(2,7);
        for (var i in SOCKET_LIST) {
            SOCKET_LIST[i].emit('addToChat',player.username + ': ' + data);
        }
    });
    //Debug
    socket.on('evalServer', function(data) {
        var res = eval(data);
        socket.emit('evalAnswer',res);
    });

	socket.on('keyPress',function(data){
		if(data.inputId === 'left')
			player.pressingLeft = data.state;
		else if(data.inputId === 'right')
			player.pressingRight = data.state;
		else if(data.inputId === 'up')
			player.pressingUp = data.state;
		else if(data.inputId === 'down')
			player.pressingDown = data.state;
	});

    //Déconnection du joueur
	socket.on('disconnect',function(){
		delete SOCKET_LIST[socket.id];
		delete PLAYER_LIST[socket.id];
    });
});
//****************************************** */

setInterval(function(){
	var pack = [];
	for(var i in PLAYER_LIST) {
		var player = PLAYER_LIST[i];
		player.updatePosition();
		if (player.y < 430)
			player.y += player.gravity;
		pack.push({
			x:player.x,
			y:player.y
		});
	}
	for (var i in SOCKET_LIST){
		var socket = SOCKET_LIST[i];
		socket.emit('newPositions',pack);
	}
}, 1000/25);