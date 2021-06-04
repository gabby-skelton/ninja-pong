const canvas = document.getElementById('canvas');
const context = canvas.getContext('2d');

const netWidth = 4;
const netHeight = canvas.height;

const paddleWidth = 10;
const paddleHeight = 100;

let upArrowPressed = false;
let downArrowPressed = false;
let spacePressed = false;
let gamePaused = false;
let victory = false;

var pauseButton = document.getElementsByClassName('bi-pause-circle');
pauseButton = pauseButton[0];

var playButton = document.getElementsByClassName('bi-play-circle');
playButton = playButton[0];

var winner = document.getElementById('winner');

// net
const net = {
  x: canvas.width / 2 - netWidth / 2,
  y: 0,
  width: netWidth,
  height: netHeight,
  color: "#FFF"
};

// mouse paddle
const mouse = {
  x: 10,
  y: canvas.height / 2 - paddleHeight / 2,
  width: paddleWidth,
  height: paddleHeight,
  color: '#FFF',
  score: 0
};

//keys paddle
const keys = {
  x: canvas.width - (paddleWidth + 10),
  y: canvas.height / 2 - paddleHeight / 2,
  width: paddleWidth,
  height: paddleHeight,
  color: '#FFF',
  score: 0
};

const ball = {
  x: canvas.width / 2,
  y: canvas.height / 2,
  radius: 10,
  speed: 7,
  velocityX: 5,
  velocityY: 5,
  color: '#FFF' 
};

function drawCanvas() {
  context.fillStyle = "#114e8a";
  context.fillRect(0, 0, canvas.width, canvas.height);

  drawNet();
  drawScore(canvas.width / 4, canvas.height / 6, mouse.score, "p1");
  drawScore(3 * canvas.width / 4, canvas.height / 6, keys.score, "p2");
  drawPaddle(mouse.x, mouse.y, mouse.width, mouse.height, mouse.color);
  drawPaddle(keys.x, keys.y, keys.width, keys.height, keys.color);
  drawBall(ball.x, ball.y, ball.radius, ball.color);
}

function drawNet() {
  context.fillStyle = net.color;
  context.fillRect(net.x, net.y, net.width, net.height);
}

function drawScore(x, y, score, player) {
  context.fillStyle = '#fff';
  context.font = '25px sans-serif';
  context.fillText(player + ": " + score, x, y);
}

function drawPaddle(x, y, width, height, color) {
  context.fillStyle = color;
  context.fillRect(x, y, width, height);
}

function drawBall(x, y, radius, color) {
  context.fillStyle = color;
  context.beginPath();
  context.arc(x, y, radius, 0, Math.PI * 2, true);
  context.closePath();
  context.fill();
}

window.addEventListener('keydown', keyDownHandler);
window.addEventListener('keyup', keyUpHandler);

function keyDownHandler(event) {
  switch (event.keyCode) {
    case 32:
      spacePressed = true;
      console.log("space pressed");
      setInterval(playGame, 1000 / 60);
      break;
    case 38:
      upArrowPressed = true;
      console.log(event + " pressed");
      break;
    case 40:
      downArrowPressed = true;
      console.log(event + " pressed");
      break;
  }
}

function keyUpHandler(event) {
  switch (event.keyCode) {
    case 32: 
      spacePressed = false;
      break;
    case 38:
      upArrowPressed = false;
      break;
    case 40:
      downArrowPressed = false;
      break;
  }
}

function reset() {
  ball.x = canvas.width / 2;
  ball.y = canvas.height / 2;
  ball.speed = 7;

  ball.velocityX = -ball.velocityX;
  ball.velocityY = -ball.velocityY;
}

function collisionDetect(player, ball) {
  player.top = player.y;
  player.right = player.x + player.width;
  player.bottom = player.y + player.height;
  player.left = player.x;

  ball.top = ball.y - ball.radius;
  ball.right = ball.x + ball.radius;
  ball.bottom = ball.y + ball.radius;
  ball.left = ball.x - ball.radius;

  return ball.left < player.right && ball.top < player.bottom && ball.right > player.left && ball.bottom > player.top;
}

function update() {
  ball.x += ball.velocityX;
  ball.y += ball.velocityY;

  if (upArrowPressed && mouse.y > 0 && gamePaused == false) {
    mouse.y -= 8;
  } else if (downArrowPressed && (mouse.y < canvas.height - mouse.height) && gamePaused == false) {
    mouse.y += 8;
  }

  if (ball.y + ball.radius >= canvas.height || ball.y - ball.radius <= 0) {
    ball.velocityY = -ball.velocityY;
  }

  if (ball.x + ball.radius >= canvas.width) {
    mouse.score += 1;
    if(mouse.score === 5) {
      winner.innerHTML = "p1 wins!!";
      winner.style.display = "block";
      victory = true;
      pause();
    }
    reset();
  }

  if (ball.x - ball.radius <= 0) {
    keys.score += 1;
    if(keys.score === 5) {
      winner.innerHTML = "p2 wins!!";
      winner.style.display = "block";
      victory = true;
      pause();
    }
    reset();
  }

  let player = (ball.x < canvas.width / 2) ? mouse : keys;

  if (collisionDetect(player, ball)) {
    let angle = 0;

    if (ball.y < (player.y + player.height / 2)) {
      angle = -1 * Math.PI / 4;
    } else if (ball.y > (player.y + player.height / 2)) {
      angle = Math.PI / 4;
    }

    ball.velocityX = (player === mouse ? 1 : -1) * ball.speed * Math.cos(angle);
    ball.velocityY = ball.speed * Math.sin(angle);

    ball.speed += 0.2;
  }

  keys.y += ((ball.y - (keys.y + keys.height / 2))) * 0.09;
}

function pause() {
  pauseButton.style.display = "none";
  playButton.style.display = "block";
  ball.speed = 0;
  ball.velocityX = 0;
  ball.velocityY = 0;
  gamePaused = true;
}

function play() {
  pauseButton.style.display = "block";
  playButton.style.display = "none";
  ball.speed = 7;
  ball.velocityX = 5;
  ball.velocityY = 5;
  gamePaused = false;
  if(victory == true) {
    ball.x = canvas.width / 2;
    ball.y = canvas.height / 2;
    mouse.x = 10;
    mouse.y = canvas.height / 2 - paddleHeight / 2;
    keys.x = canvas.width - (paddleWidth + 10);
    keys.y = canvas.height / 2 - paddleHeight / 2;
    keys.score = 0;
    mouse.score = 0;
    winner.style.display = "none";
    victory = false;
  }
}

function playGame() {
  update();
  drawCanvas();
}

drawCanvas();

if(spacePressed == true) {
  
}
