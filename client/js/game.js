var socket = io();

//Le jeu
var canvas = document.getElementById("ctx");
const ctx = canvas.getContext("2d");
canvas.width = 800;
canvas.height = 500;

ctx.font = '30px Arial';

var Img = {};
Img.player = new Image();
Img.player.src = '/client/image/dango.png';
var playerWidth = Img.player.width / 6;
var playerHeight = Img.player.height / 6;

Img.background = new Image();
Img.background.src = 'https://media.discordapp.net/attachments/772911315118718986/775005721166086154/Test_decor_1.png?width=1204&height=677';

function update(){
    ctx.clearRect(0,0, canvas.width.canvas.height);
    ctx.drawImage(Img.background.src, 200, 200)
}

socket.on('newPositions', function(data){
    ctx.clearRect(0,0,1000,1000);
    for(var i = 0; i < data.length; i++)
        ctx.drawImage(Img.player, 0,0, Img.player.width,Img.player.height,data[i].x, data[i].y, playerWidth,playerHeight);
})


document.onkeydown = function(event){
    if(event.keyCode === 39)	//d
        socket.emit('keyPress',{inputId:'right',state:true});
    else if(event.keyCode === 40)	//s
        socket.emit('keyPress',{inputId:'down',state:true});
    else if(event.keyCode === 37) //a
        socket.emit('keyPress',{inputId:'left',state:true});
    else if(event.keyCode === 38) // w
        socket.emit('keyPress',{inputId:'up',state:true});

}
document.onkeyup = function(event){
    if(event.keyCode === 39)	//d
        socket.emit('keyPress',{inputId:'right',state:false});
    else if(event.keyCode === 40)	//s
        socket.emit('keyPress',{inputId:'down',state:false});
    else if(event.keyCode === 37) //a
        socket.emit('keyPress',{inputId:'left',state:false});
    else if(event.keyCode === 38) // w
        socket.emit('keyPress',{inputId:'up',state:false});
}
update();