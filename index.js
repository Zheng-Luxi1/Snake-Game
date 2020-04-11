var canvas = document.querySelector("canvas"),
	gd = canvas.getContext('2d'),
    snake = {
		x : -25,
		y : 0,
		w : 25,
		h : 25,
		lastDir : 0,
		offsetX : 0,
		offsetY : 0
    },
    snakeBody = [],
    food = {
		x : 0,
		y : 0,
		w : snake.w,
		h : snake.h
	},
	timer = null,
	speed = 0,
	{ x, y } = getRandomFood();

canvas.width = 1250;
canvas.height = 775;
	
food.x = x;
food.y = y;

for( let i = 0 ; i < 5 ; i ++ ){
	snake.x += snake.w;
	snakeBody.unshift({...snake});
}

tips();
drawSnake();

function getRandom( min, max ){
	return Math.floor( Math.random() * ( max - min ) ) + min;
}

function getRandomFood(){
	const x = getRandom( 0, canvas.width / snake.w ) * food.w;
	const y = getRandom( 0, canvas.height / snake.h ) * food.h;
	if( snakeBody.findIndex( item => item.x === x && item.y === y ) != -1 )
		return getRandomFood();
	return { x, y };
}

function drawFood(){
	gd.beginPath();
	gd.fillStyle = '#9DA';
	gd.fillRect( food.x, food.y, food.w - 1, food.h - 1 );
}

function drawSnake(){
	snakeBody.forEach(function(item){
		gd.beginPath();
		gd.fillStyle = 'red';
		gd.fillRect( item.x, item.y, item.w - 1, item.h - 1 );
	});

	gd.beginPath();
	gd.fillStyle = '#69C';
	gd.fillRect( snakeBody[0].x, snakeBody[0].y, snakeBody[0].w - 1, snakeBody[0].h - 1 );
}

function tips(){
	var user = prompt("请输入一个用户名");
	alert("欢迎" + user + "用户玩贪吃蛇游戏(Snake Game)");
	alert("本游戏适合在全屏模式下游玩(请按F11键进入全屏模式)");
}

function drawWaterMark(){
	gd.beginPath();
	gd.textAlign = 'center';
	gd.textBaseline = 'middle';
	gd.fillStyle = 'rgba( 255, 255, 255, 0.3 )';
	gd.font = 'italic normal bold 100px Consolas';
	gd.fillText( "Author: Zheng Luxi", canvas.width / 2, canvas.height / 2 );
}

function faild(){
	gd.clearRect( 0, 0, canvas.width, canvas.height );
	alert( "Game Over! You are Faild!");
	snake.x = 0;
	snake.y = 0;
	snake.offsetX = 0;
	snake.offsetY = 0;
	snake.lastDir = 0;
	snakeBody = [];
	for( let i = 0 ; i < 5 ; i ++ ){
		snake.x += snake.w;
		snakeBody.unshift({...snake});
	}
	cancelAnimationFrame(timer);
	gd.clearRect( 0, 0, canvas.width, canvas.height );
	var start = document.createElement("button");
	start.id = 'start';
	start.innerHTML = 'Start Game';
	document.body.appendChild(start);
	start.onclick = function(){
		cancelAnimationFrame(timer);
		timer = window.requestAnimationFrame(snakeMove);
		document.body.removeChild(this);
	}
}

function changeData(){
	document.querySelector("#length").innerText = snakeBody.length;
	document.querySelector("#food").innerText = snakeBody.length - 5;
}

function snakeMove(){
	cancelAnimationFrame(snakeMove);
	if( snake.x < 0 || snake.x >= canvas.width || snake.y < 0 || snake.y >= canvas.height ){
		faild();
	}else{
		timer = window.requestAnimationFrame(snakeMove);
		if( ++ speed < parseInt( document.querySelector("#speed").value ) ) return;
		speed = 0;
		snake.x += snake.offsetX;
		snake.y += snake.offsetY;

		gd.clearRect( 0, 0, canvas.width, canvas.height );
		snakeBody.unshift({...snake});
		if( snake.x === food.x && snake.y === food.y ){
			const { x, y } = getRandomFood();
			food.x = x;
			food.y = y;
		}else{
			snakeBody.pop();
		}

		drawWaterMark();
		drawSnake();
		drawFood();
		changeData();
	}
}

document.querySelector("#start").onclick = function(){
	timer = window.requestAnimationFrame(snakeMove);
	document.body.removeChild(this);
}

document.addEventListener("keydown",function(e){
	e = e || window.event;
	e.which = 122;
	if( Math.abs( e.which - snake.lastDir ) === 2 ) return;
	snake.lastDir = e.which;
	switch( e.which ){
		case 38:
			snake.offsetX = 0;
			snake.offsetY = -1 * snake.h;
		break;
		case 40:
			snake.offsetX = 0;
			snake.offsetY = snake.h;
		break;
		case 37:
			snake.offsetX = -1 * snake.w;
			snake.offsetY = 0;
		break;
		case 39:
			snake.offsetX = snake.w;
			snake.offsetY = 0;
		break;
	}
})