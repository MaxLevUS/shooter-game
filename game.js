document.addEventListener("DOMContentLoaded", () => {
  // Get canvas and context
  const canvas = document.getElementById("gameCanvas");
  const ctx = canvas.getContext("2d");

  // Set canvas size
  canvas.width = 800;
  canvas.height = 600;

  // Game variables
  const FIGHTER_STEP = 10;
  const BALL_STEP = 4;
  const ALIEN_STEP = 0.5;

  let fighterWidth = 50;
  let fighterHeight = 50;
  let fighterX = canvas.width / 2 - fighterWidth / 2;
  let fighterY = canvas.height - fighterHeight;

  let ballWidth = 10;
  let ballHeight = 20;
  let ballX = 0;
  let ballY = 0;
  let ballWasFired = false;

  let alienWidth = 50;
  let alienHeight = 50;
  let alienX = Math.random() * (canvas.width - alienWidth);
  let alienY = 0;

  let gameScore = 0;
  let gameScoreForSpeedIncrease = 0;
  let alienSpeed = ALIEN_STEP;

  // Load images
  const fighterImage = new Image();
  const ballImage = new Image();
  const alienImage = new Image();

  fighterImage.src = "images/fighter.jpg";
  ballImage.src = "images/ball.png";
  alienImage.src = "images/alien.png";

  // Function to start the game loop when all images are loaded
  function startGame() {
    function gameLoop() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Move the alien
      alienY += alienSpeed;

      // Move the ball
      if (ballWasFired) {
        ballY -= BALL_STEP;
        if (ballY + ballHeight < 0) {
          ballWasFired = false;
        }
      }

      // Draw the fighter
      ctx.drawImage(
        fighterImage,
        fighterX,
        fighterY,
        fighterWidth,
        fighterHeight
      );

      // Draw the alien
      ctx.drawImage(alienImage, alienX, alienY, alienWidth, alienHeight);

      // Draw the ball
      if (ballWasFired) {
        ctx.drawImage(ballImage, ballX, ballY, ballWidth, ballHeight);
      }

      // Draw the score
      ctx.fillStyle = "red";
      ctx.font = "30px Arial";
      ctx.fillText(`Your Score is: ${gameScore}`, 20, 30);

      // Check for collisions
      if (
        ballWasFired &&
        ballX < alienX + alienWidth &&
        ballX + ballWidth > alienX &&
        ballY < alienY + alienHeight &&
        ballY + ballHeight > alienY
      ) {
        ballWasFired = false;
        alienX = Math.random() * (canvas.width - alienWidth);
        alienY = 0;
        gameScore++;
        gameScoreForSpeedIncrease++;
        if (gameScoreForSpeedIncrease === 5) {
          alienSpeed += ALIEN_STEP / 2;
          gameScoreForSpeedIncrease = 0;
        }
      }

      // Check for game over
      if (alienY + alienHeight > fighterY) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = "red";
        ctx.font = "50px Arial";
        ctx.fillText("GAME OVER", canvas.width / 2 - 150, canvas.height / 2);
        return;
      }

      requestAnimationFrame(gameLoop);
    }

    gameLoop();
  }

  // Ensure all images are loaded before starting the game
  let imagesLoaded = 0;
  const totalImages = 3;

  function imageLoaded() {
    imagesLoaded++;
    if (imagesLoaded === totalImages) {
      startGame(); // Start the game when all images are loaded
    }
  }

  fighterImage.onload = imageLoaded;
  ballImage.onload = imageLoaded;
  alienImage.onload = imageLoaded;

  // Control the fighter
  document.addEventListener("keydown", (e) => {
    if (e.key === "ArrowLeft" && fighterX > 0) {
      fighterX -= FIGHTER_STEP;
    }
    if (e.key === "ArrowRight" && fighterX < canvas.width - fighterWidth) {
      fighterX += FIGHTER_STEP;
    }
    if (e.key === " " && !ballWasFired) {
      ballWasFired = true;
      ballX = fighterX + fighterWidth / 2 - ballWidth / 2;
      ballY = fighterY - ballHeight;
    }
  });
});
