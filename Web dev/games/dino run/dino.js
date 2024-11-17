// Get DOM elements
const dino = document.getElementById('dino');
const gameContainer = document.getElementById('gameContainer');
const gameOverText = document.getElementById('gameOver');
const scoreDisplay = document.getElementById('score');
const highScoreDisplay = document.getElementById('highScore');

// Game state variables
let isJumping = false;
let gravity = 0.9;
let position = 0;
let isGameOver = false;
let score = 0;
let highScore = 0;
let gameSpeed = 5;
let lastObstacleTime = 0;

// Jump mechanics
function jump() {
    if (!isJumping && !isGameOver) {
        isJumping = true;
        let jumpCount = 0;
        let jumpInterval = setInterval(() => {
            // Jump up
            if (jumpCount < 15) {
                position += 5;
                dino.style.bottom = position + 'px';
            }
            
            // Fall down
            if (jumpCount > 20) {
                position -= 5;
                dino.style.bottom = position + 'px';
            }
            
            // End jump
            if (position <= 0) {
                clearInterval(jumpInterval);
                isJumping = false;
                position = 0;
                dino.style.bottom = '0';
            }
            
            jumpCount++;
        }, 20);
    }
}

// Create and move obstacles
function createObstacle() {
    const obstacle = document.createElement('div');
    obstacle.classList.add('obstacle');
    gameContainer.appendChild(obstacle);
    obstacle.style.right = '0px';
    
    let obstaclePosition = 0;
    
    const moveObstacle = setInterval(() => {
        if (isGameOver) {
            clearInterval(moveObstacle);
            return;
        }
        
        obstaclePosition += gameSpeed;
        obstacle.style.right = obstaclePosition + 'px';
        
        // Check collision
        const dinoRect = dino.getBoundingClientRect();
        const obstacleRect = obstacle.getBoundingClientRect();
        
        if (
            dinoRect.right > obstacleRect.left &&
            dinoRect.left < obstacleRect.right &&
            dinoRect.bottom > obstacleRect.top
        ) {
            gameOver();
            clearInterval(moveObstacle);
            return;
        }
        
        // Remove obstacle when it's off screen
        if (obstaclePosition > gameContainer.offsetWidth) {
            obstacle.remove();
            clearInterval(moveObstacle);
        }
    }, 20);
}

// Game over handling
function gameOver() {
    isGameOver = true;
    gameOverText.style.display = 'block';
    if (score > highScore) {
        highScore = score;
        highScoreDisplay.textContent = String(highScore).padStart(5, '0');
    }
}

// Reset game
function resetGame() {
    isGameOver = false;
    score = 0;
    gameSpeed = 5;
    scoreDisplay.textContent = '00000';
    gameOverText.style.display = 'none';
    
    // Remove all obstacles
    const obstacles = document.querySelectorAll('.obstacle');
    obstacles.forEach(obstacle => obstacle.remove());
}

// Start game loop
function gameLoop() {
    if (!isGameOver) {
        // Create obstacles
        if (Date.now() - lastObstacleTime > 1500) {
            createObstacle();
            lastObstacleTime = Date.now();
        }
        
        // Update score
        score++;
        scoreDisplay.textContent = String(score).padStart(5, '0');
        
        // Increase game speed
        if (score % 500 === 0) {
            gameSpeed += 0.5;
        }
    }
    requestAnimationFrame(gameLoop);
}

// Controls
document.addEventListener('keydown', (event) => {
    if (event.code === 'Space') {
        if (isGameOver) {
            resetGame();
        } else {
            jump();
        }
        event.preventDefault();
    }
});

// Start the game
gameLoop();