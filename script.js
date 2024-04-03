"use strict";

const canvas = document.getElementById("flappyBird");
const ctx = canvas.getContext("2d");
const birdImg = document.getElementById("bird");
const birdDownImg = document.getElementById("birdDown");

let speedX = 0.005;
let speedY = 0;
let gravite = -0.3;
let pillarSpeedX = 1.5;
let gameOver = false;

let score = 0;
let maxScore;

const flappyBird = {
  width: 300,
  height: 500,
  x: 0,
  y: 0,
  color: "#eee",
};
let bird = {
  width: 40,
  height: 40,
  x: flappyBird.width / 6,
  y: flappyBird.height * (1 / 3),
};
let controls = {
  jump: "Space",
};
let scoreParam = {
  font: '18px "Pixelify Sans"',
  x: 10,
  y: 20,
  color: "#38bdc2",
};
let gameOverText = {
  font: '25px "Pixelify Sans"',
  x: flappyBird.width / 4,
  y: flappyBird.height / 3,
  color: "#28a1a5",
};

let pillars = [];
let pillar = {
  width: 60,
  height: 18 * Math.floor(Math.random() * (13 - 5) + 5),
  x: flappyBird.width,
  y: 0,
};

function drawBoard() {
  ctx.fillStyle = flappyBird.color;
  ctx.fillRect(flappyBird.x, flappyBird.y, flappyBird.width, flappyBird.height);
  ctx.fill();
}

function drawBird() {
  speedY -= gravite;
  if (speedY <= 0) {
    ctx.drawImage(
      birdImg,
      (bird.x += speedX),
      (bird.y += speedY),
      bird.width,
      bird.height
    );
  } else if (speedY > 0) {
    ctx.drawImage(
      birdDownImg,
      (bird.x += speedX),
      (bird.y += speedY),
      bird.width,
      bird.height
    );
  }
}

function drawScore() {
  ctx.font = scoreParam.font;
  ctx.fillStyle = scoreParam.color;
  ctx.fillText(`Score: ${score}`, scoreParam.x, scoreParam.y);

  if (score > localStorage.getItem("maxScore")) {
    maxScore = score;
    localStorage.setItem("maxScore", `${score}`);
  } else {
    maxScore = getMaxScore();
  }

  ctx.font = scoreParam.font;
  ctx.fillStyle = scoreParam.color;
  ctx.fillText(
    `Best Score: ${maxScore}`,
    scoreParam.x + flappyBird.width / 2.2,
    scoreParam.y
  );
}

function createPillars() {
  pillars.push(pillar);

  pillar = {
    width: 60,
    height: -18 * Math.floor(Math.random() * (13 - 5) + 5),
    x: flappyBird.width,
    y: flappyBird.height,
  };

  pillars.push(pillar);

  pillar = {
    width: 60,
    height: 18 * Math.floor(Math.random() * (13 - 5) + 5),
    x: flappyBird.width + flappyBird.width / 2,
    y: 0,
  };

  pillars.push(pillar);

  pillar = {
    width: 60,
    height: -18 * Math.floor(Math.random() * (13 - 5) + 5),
    x: flappyBird.width + flappyBird.width / 2,
    y: flappyBird.height,
  };

  pillars.push(pillar);
}

function drawPillars() {
  pillars.forEach((pillar) => {
    if (pillar.x + pillar.width < 0) {
      pillar.x = flappyBird.width;
    }
    ctx.fillStyle = "#777";
    ctx.fillRect(
      (pillar.x -= pillarSpeedX),
      pillar.y,
      pillar.width,
      pillar.height
    );
  });
}

function checkingGameOver() {
  if (
    bird.y + bird.height / 9.5 <= 0 ||
    bird.y >= flappyBird.height - bird.height / 10
  ) {
    gameOver = true;
  }
  pillars.forEach((pillar) => {
    if (bird.x + bird.width >= pillar.x && bird.x <= pillar.x + pillar.width) {
      if (pillar.height > 0) {
        if (
          bird.y >= pillar.y &&
          bird.y + bird.height / 6 <= pillar.y + pillar.height
        ) {
          gameOver = true;
        }
      }
      if (pillar.height < 0) {
        if (
          bird.y + bird.height * (4.5 / 5) >= pillar.y + pillar.height &&
          bird.y <= pillar.y
        ) {
          gameOver = true;
        }
      }
      score += Math.floor(Math.random() * (5 - 1) - 1);
      return;
    }
  });
}

function getMaxScore() {
  if (localStorage.getItem("maxScore")) {
    maxScore = localStorage.getItem("maxScore");
    return maxScore;
  } else {
    maxScore = 0;
    return maxScore;
  }
}

window.addEventListener("keyup", (e) => {
  console.log(e.code);
  switch (e.code) {
    case controls.jump:
      speedY += -10;
      break;
  }
});

window.addEventListener("click", (e) => {
  speedY += -10;
});

createPillars();

setInterval(() => {
  if (gameOver) {
    window.addEventListener("click", function restart(e) {
      bird = {
        width: 40,
        height: 40,
        x: flappyBird.width / 6,
        y: flappyBird.height * (1 / 3),
      };
      pillars = [];
      pillar = {
        width: 60,
        height: 18 * Math.floor(Math.random() * (13 - 5) + 5),
        x: flappyBird.width,
        y: 0,
      };
      createPillars();
      speedX = 0.005;
      speedY = 0;
      gravite = -0.3;
      pillarSpeedX = 1.5;
      score = 0;
      gameOver = false;
      window.removeEventListener("click", restart);
    });
    ctx.font = gameOverText.font;
    ctx.fillStyle = gameOverText.color;
    ctx.fillText("GAME OVER 😢", gameOverText.x, gameOverText.y);
    ctx.fillText(
      "click or tap to restart",
      gameOverText.x - 70,
      gameOverText.y + 100
    );
    return;
  }
  drawBoard();
  drawBird();
  drawPillars();
  drawScore();
  checkingGameOver();
}, 20);
