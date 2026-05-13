const canvas =
  document.getElementById("gameCanvas");

const ctx =
  canvas.getContext("2d");

const scoreElement =
  document.getElementById("score");

const highScoreElement =
  document.getElementById("highScore");

const pauseBtn =
  document.getElementById("pauseBtn");

const resetBtn =
  document.getElementById("resetBtn");

/* =========================
   COMMON VARIABLES
========================= */

let currentGame = "snake";

let paused = false;

/* =================================================
   SNAKE GAME
================================================= */

const snakeBox = 20;

let snake;
let snakeDirection;
let snakeFood;
let snakeScore;
let snakeGameLoop;

function initSnake() {

  clearInterval(snakeGameLoop);

  snake = [
    {
      x: 200,
      y: 200
    }
  ];

  snakeDirection = "RIGHT";

  snakeFood = createSnakeFood();

  snakeScore = 0;

  updateScore(
    snakeScore,
    localStorage.getItem(
      "snakeHighScore"
    ) || 0
  );

  snakeGameLoop =
    setInterval(drawSnake, 120);
}

function createSnakeFood() {

  return {
    x:
      Math.floor(Math.random() * 20)
      * snakeBox,

    y:
      Math.floor(Math.random() * 20)
      * snakeBox
  };
}

function drawSnake() {

  if (
    paused ||
    currentGame !== "snake"
  ) {
    return;
  }

  ctx.fillStyle = "black";

  ctx.fillRect(
    0,
    0,
    canvas.width,
    canvas.height
  );

  for (
    let i = 0;
    i < snake.length;
    i++
  ) {

    ctx.fillStyle =
      i === 0 ? "lime" : "green";

    ctx.fillRect(
      snake[i].x,
      snake[i].y,
      snakeBox,
      snakeBox
    );
  }

  ctx.fillStyle = "red";

  ctx.fillRect(
    snakeFood.x,
    snakeFood.y,
    snakeBox,
    snakeBox
  );

  let headX = snake[0].x;
  let headY = snake[0].y;

  if (snakeDirection === "LEFT") {
    headX -= snakeBox;
  }

  if (snakeDirection === "RIGHT") {
    headX += snakeBox;
  }

  if (snakeDirection === "UP") {
    headY -= snakeBox;
  }

  if (snakeDirection === "DOWN") {
    headY += snakeBox;
  }

  if (
    headX === snakeFood.x &&
    headY === snakeFood.y
  ) {

    snakeScore++;

    snakeFood = createSnakeFood();

    let high =
      localStorage.getItem(
        "snakeHighScore"
      ) || 0;

    if (snakeScore > high) {

      localStorage.setItem(
        "snakeHighScore",
        snakeScore
      );
    }

  } else {

    snake.pop();
  }

  const newHead = {
    x: headX,
    y: headY
  };

  if (
    headX < 0 ||
    headY < 0 ||
    headX >= 400 ||
    headY >= 400 ||
    snakeCollision(
      newHead,
      snake
    )
  ) {

    alert("Snake Game Over");

    initSnake();

    return;
  }

  snake.unshift(newHead);

  updateScore(
    snakeScore,
    localStorage.getItem(
      "snakeHighScore"
    ) || 0
  );
}

function snakeCollision(
  head,
  body
) {

  for (
    let i = 0;
    i < body.length;
    i++
  ) {

    if (
      head.x === body[i].x &&
      head.y === body[i].y
    ) {

      return true;
    }
  }

  return false;
}

/* =================================================
   TETRIS GAME
================================================= */

const grid = 20;

let board;
let piece;
let tetrisScore;
let dropStart;

function initTetris() {

  clearInterval(snakeGameLoop);

  board = [];

  for (let y = 0; y < 20; y++) {

    board[y] = [];

    for (let x = 0; x < 10; x++) {

      board[y][x] = 0;
    }
  }

  piece = {
    shape: [
      [1, 1],
      [1, 1]
    ],
    x: 4,
    y: 0
  };

  tetrisScore = 0;

  dropStart = Date.now();

  updateScore(
    tetrisScore,
    localStorage.getItem(
      "tetrisHighScore"
    ) || 0
  );

  requestAnimationFrame(
    updateTetris
  );
}

function drawTetris() {

  ctx.fillStyle = "black";

  ctx.fillRect(
    0,
    0,
    canvas.width,
    canvas.height
  );

  for (
    let y = 0;
    y < board.length;
    y++
  ) {

    for (
      let x = 0;
      x < board[y].length;
      x++
    ) {

      if (board[y][x]) {

        ctx.fillStyle = "cyan";

        ctx.fillRect(
          x * grid,
          y * grid,
          grid,
          grid
        );
      }
    }
  }

  ctx.fillStyle = "yellow";

  for (
    let y = 0;
    y < piece.shape.length;
    y++
  ) {

    for (
      let x = 0;
      x < piece.shape[y].length;
      x++
    ) {

      if (piece.shape[y][x]) {

        ctx.fillRect(
          (piece.x + x) * grid,
          (piece.y + y) * grid,
          grid,
          grid
        );
      }
    }
  }
}

function updateTetris() {

  if (
    paused ||
    currentGame !== "tetris"
  ) {

    requestAnimationFrame(
      updateTetris
    );

    return;
  }

  const now = Date.now();

  if (
    now - dropStart > 500
  ) {

    piece.y++;

    if (tetrisCollision()) {

      piece.y--;

      mergePiece();

      clearTetrisLines();

      piece = {
        shape: [
          [1, 1],
          [1, 1]
        ],
        x: 4,
        y: 0
      };

      if (tetrisCollision()) {

        alert(
          "Tetris Game Over"
        );

        initTetris();

        return;
      }
    }

    dropStart = now;
  }

  drawTetris();

  requestAnimationFrame(
    updateTetris
  );
}

function tetrisCollision() {

  for (
    let y = 0;
    y < piece.shape.length;
    y++
  ) {

    for (
      let x = 0;
      x < piece.shape[y].length;
      x++
    ) {

      if (
        piece.shape[y][x] &&
        (
          !board[y + piece.y] ||
          board[y + piece.y][x + piece.x]
        )
      ) {

        return true;
      }
    }
  }

  return false;
}

function mergePiece() {

  for (
    let y = 0;
    y < piece.shape.length;
    y++
  ) {

    for (
      let x = 0;
      x < piece.shape[y].length;
      x++
    ) {

      if (
        piece.shape[y][x]
      ) {

        board[y + piece.y][
          x + piece.x
        ] = 1;
      }
    }
  }
}

function clearTetrisLines() {

  for (
    let y = board.length - 1;
    y >= 0;
    y--
  ) {

    let full = true;

    for (
      let x = 0;
      x < board[y].length;
      x++
    ) {

      if (
        board[y][x] === 0
      ) {

        full = false;
      }
    }

    if (full) {

      board.splice(y, 1);

      board.unshift(
        Array(10).fill(0)
      );

      tetrisScore += 10;
    }
  }

  let high =
    localStorage.getItem(
      "tetrisHighScore"
    ) || 0;

  if (
    tetrisScore > high
  ) {

    localStorage.setItem(
      "tetrisHighScore",
      tetrisScore
    );
  }

  updateScore(
    tetrisScore,
    localStorage.getItem(
      "tetrisHighScore"
    ) || 0
  );
}

/* =================================================
   COMMON FUNCTIONS
================================================= */

function updateScore(
  score,
  high
) {

  scoreElement.innerText =
    score;

  highScoreElement.innerText =
    high;
}

/* =================================================
   KEYBOARD CONTROLS
================================================= */

document.addEventListener(
  "keydown",
  event => {

    /* GAME SWITCH */

    if (
      event.key === "s" ||
      event.key === "S"
    ) {

      currentGame = "snake";

      paused = false;

      initSnake();

      return;
    }

    if (
      event.key === "t" ||
      event.key === "T"
    ) {

      currentGame = "tetris";

      paused = false;

      initTetris();

      return;
    }

    /* SNAKE CONTROLS */

    if (
      currentGame === "snake"
    ) {

      if (
        event.key === "ArrowLeft" &&
        snakeDirection !== "RIGHT"
      ) {

        snakeDirection = "LEFT";
      }

      if (
        event.key === "ArrowRight" &&
        snakeDirection !== "LEFT"
      ) {

        snakeDirection = "RIGHT";
      }

      if (
        event.key === "ArrowUp" &&
        snakeDirection !== "DOWN"
      ) {

        snakeDirection = "UP";
      }

      if (
        event.key === "ArrowDown" &&
        snakeDirection !== "UP"
      ) {

        snakeDirection = "DOWN";
      }
    }

    /* TETRIS CONTROLS */

    if (
      currentGame === "tetris"
    ) {

      if (
        event.key === "ArrowLeft"
      ) {

        piece.x--;

        if (
          tetrisCollision()
        ) {

          piece.x++;
        }
      }

      if (
        event.key === "ArrowRight"
      ) {

        piece.x++;

        if (
          tetrisCollision()
        ) {

          piece.x--;
        }
      }

      if (
        event.key === "ArrowDown"
      ) {

        piece.y++;

        if (
          tetrisCollision()
        ) {

          piece.y--;
        }
      }
    }
  }
);

/* =================================================
   BUTTONS
================================================= */

pauseBtn.addEventListener(
  "click",
  () => {

    paused = !paused;

    pauseBtn.innerText =
      paused
        ? "Resume"
        : "Pause";
  }
);

resetBtn.addEventListener(
  "click",
  () => {

    if (
      currentGame === "snake"
    ) {

      initSnake();

    } else {

      initTetris();
    }
  }
);

/* =================================================
   START GAME
================================================= */

initSnake();