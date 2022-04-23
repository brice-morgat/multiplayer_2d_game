//Inscription / Login
var gameDiv = document.getElementById('gameDiv');
var signDiv = document.getElementById('signDiv');
var signDivUsername = document.getElementById('signDiv-username');
var signDivPassword = document.getElementById('signDiv-password');
var signDivSignIn = document.getElementById('signDiv-signIn');
var signDivSignUp = document.getElementById('signDiv-signUp');

signDivSignIn.onclick = function(){
	socket.emit('signIn', {
		username:signDivUsername.value,
		password:signDivPassword.value});
};

signDivSignUp.onclick = function(){
	socket.emit('signUp', {
		username:signDivUsername.value,
		password:signDivPassword.value});
};

socket.on('signInResponse', function(data){
	if (data.success){
		signDiv.style.display = 'none';
		gameDiv.style.display = 'inline-block';
	}
	else 
		alert("Pseudo ou Mot de passe incorrect");
});

socket.on('signUpResponse', function(data){
	if (data.success){
		alert("Vous êtes désormais inscrit !")
	}
	else 
		alert("Pseudo déjà utilisé");
});


//La barre de tchat
var chatText = document.getElementById('chat-text');
var chatInput = document.getElementById('chat-input');
var chatForm = document.getElementById('chat-form');
	
//Socket : 
	
//Tchat 
socket.on('addToChat', function(data){
	chatText.innerHTML += '<div>' + data + '</div>';
});

chatForm.onsubmit = function(e) {
	e.preventDefault();
	if (chatInput.value[0] === '/')
		socket.emit('evalServer', chatInput.value.slice(1));
	else
		socket.emit('sendMsgToServer', chatInput.value);
	chatInput.value = '';
}

//Debug command
socket.on('evalAnswer', function(data){
	console.log(data);
});