const block_size = 25;
const total_rows = 28;
const total_cols = 28;

let board;
let context;

let snake_x = block_size * 4;
let snake_y = block_size * 5;
let speed_x = 0;
let speed_y = 0;

let snake_body = [];
let food_x;
let food_y;
let current_food_type;
let game_over = false;

let score = 0;
let speed = 10;
let interval;

const food = {
  apple: new Image(),
  burger: new Image(),
};
food.apple.src = "img/apple.png";
food.burger.src = "img/burger.png";

const snake_bodyImage = new Image();
snake_bodyImage.src = "img/boby.png";
const snake_head_images = {
  up: new Image(),
  down: new Image(),
  left: new Image(),
  right: new Image(),
};

snake_head_images.up.src = "img/up.png";
snake_head_images.down.src = "img/down.png";
snake_head_images.left.src = "img/left.png";
snake_head_images.right.src = "img/right.png";

let burger_timer = 0;
const burger_timeout = 12 * 1000;

food.apple.onload = function () {
  window.onload = function () {
    board = document.getElementById("board");
    board.height = total_rows * block_size;
    board.width = total_cols * block_size;
    context = board.getContext("2d");

    place_food();
    document.addEventListener("keyup", change_direction);
    document.getElementById("restart").addEventListener("click", restart_game);

    interval = setInterval(update, 2000 / speed);
  };
};

function place_food() {
  food_x = Math.floor(Math.random() * total_cols) * block_size;
  food_y = Math.floor(Math.random() * total_rows) * block_size;
  if (Math.random() < 0.7) {
    current_food_type = "apple";
  } else {
    current_food_type = "burger";
    burger_timer = 0;
  }
}

function update() {
  if (game_over) {
    showgame_over();
    clearInterval(interval);
    return;
  }

  context.fillStyle = "#92cc41";
  context.fillRect(0, 0, board.width, board.height);

  if (current_food_type === "burger") {
    context.drawImage(food.burger, food_x, food_y, block_size, block_size);
    burger_timer += 200;
    if (burger_timer >= burger_timeout) {
      place_food();
    }
  } else {
    context.drawImage(food.apple, food_x, food_y, block_size, block_size);
  }

  let previousHeadX = snake_x;
  let previousHeadY = snake_y;

  snake_x += speed_x * block_size;
  snake_y += speed_y * block_size;

  snake_body.unshift([previousHeadX, previousHeadY]);

  if (!(snake_x === food_x && snake_y === food_y)) {
    snake_body.pop();
  } else {
    if (current_food_type === "apple") {
      score += 1;
    } else if (current_food_type === "burger") {
      score += 3;
    }
    place_food();
    speed += 0.5;
    clearInterval(interval);
    interval = setInterval(update, 2000 / speed);
  }

  let snake_head_image = snake_head_images.up;
  if (speed_x === 1) {
    snake_head_image = snake_head_images.right;
  } else if (speed_x === -1) {
    snake_head_image = snake_head_images.left;
  } else if (speed_y === 1) {
    snake_head_image = snake_head_images.down;
  }
  context.drawImage(snake_head_image, snake_x, snake_y, block_size, block_size);

  for (let i = 0; i < snake_body.length; i++) {
    context.drawImage(
      snake_bodyImage,
      snake_body[i][0],
      snake_body[i][1],
      block_size,
      block_size
    );
  }

  if (
    snake_x < 0 ||
    snake_x >= total_cols * block_size ||
    snake_y < 0 ||
    snake_y >= total_rows * block_size
  ) {
    game_over = true;
  }

  for (let i = 1; i < snake_body.length; i++) {
    if (snake_x === snake_body[i][0] && snake_y === snake_body[i][1]) {
      game_over = true;
      break;
    }
  }

  draw_score();
}

function change_direction(e) {
  if (e.code === "ArrowUp" && speed_y !== 1) {
    speed_x = 0;
    speed_y = -1;
  } else if (e.code === "ArrowDown" && speed_y !== -1) {
    speed_x = 0;
    speed_y = 1;
  } else if (e.code === "ArrowLeft" && speed_x !== 1) {
    speed_x = -1;
    speed_y = 0;
  } else if (e.code === "ArrowRight" && speed_x !== -1) {
    speed_x = 1;
    speed_y = 0;
  }
}

function restart_game() {
  snake_x = block_size * 5;
  snake_y = block_size * 5;
  speed_x = 0;
  speed_y = 0;
  snake_body = [];
  game_over = false;
  score = 0;
  speed = 10;
  place_food();
  clearInterval(interval);
  interval = setInterval(update, 2000 / speed);
  context.clearRect(0, 0, board.width, board.height);
}

function showgame_over() {
  context.fillStyle = "#212529";
  context.fillRect(0, 0, board.width, board.height);

  const game_overImg = new Image();
  game_overImg.onload = function () {
    const imgX = (board.width - game_overImg.width) / 2;
    const imgY = (board.height - game_overImg.height) / 2 - 100;
    context.drawImage(game_overImg, imgX, imgY);

    context.fillStyle = "red";
    context.font = "48px 'Press Start 2P'";
    context.textAlign = "center";
    context.fillText("Game Over!", board.width / 2, board.height / 2 + 50);
    context.font = "24px 'Press Start 2P'";
    context.fillText(
      "Press restart to play again",
      board.width / 2,
      board.height / 2 + 100
    );

    context.fillStyle = "#F7D51D";
    context.fillText(
      `Your score: ${score}`,
      board.width / 2,
      board.height / 2 + 140
    );
  };

  game_overImg.src =
    "https://media0.giphy.com/media/v1.Y2lkPTc5MGI3NjExMXZ1cHNoa3p2OW5iY2JlMDJ3cGxuNjA5emQydGQ1MGVkb2l2M29zNSZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9cw/Lwja53LRnmd8Phlm6B/200w.gif";
}

function draw_score() {
  const score_id = document.getElementById("score");
  if (score_id) {
    score_id.textContent = "Score: " + score;
  }
}
