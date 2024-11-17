const grid = document.getElementById("grid");
const scoreDisplay = document.getElementById("score");
const startButton = document.getElementById("start-game");
const startGameContainer = document.getElementById("start-game-container");
const gameContainer = document.getElementById("game-container");

// Function to display a message
function displayMessage(text) {
  const messageElement = document.getElementById("message");
  messageElement.textContent = text;
  messageElement.style.display = "block"; // Show the message
}

// Function to hide the message
function hideMessage() {
  const messageElement = document.getElementById("message");
  messageElement.style.display = "none"; // Hide the message
}

hideMessage(); // Hide the message initially

const gridSize = 15; // 15x15 grid
const cellSize = 32; // Size of each cell in pixels
let pacmanX = 0;
let pacmanY = 0;
let score = 0;
let direction = null; // Direction Pac-Man is moving
let isMoving = false; // Flag to prevent key spamming
let gameOver = false;

// Define some wall positions
const wallPositions = [
  // Inner maze structure
  [2, 2], [2, 3], [2, 4], [2, 6], [2, 7], [2, 8], [2, 10], [2, 11], [2, 12],
  [3, 2], [4, 2], [5, 2], [6, 2], [6, 3], [6, 4], [4, 4], [5, 4], [6, 6],
  [3, 12], [4, 12], [5, 12], [6, 12], [6, 11], [6, 10], [4, 10], [5, 10], [6, 8], [6, 9],
  [8, 2], [8, 3], [8, 4], [8, 6], [8, 7], [8, 8], [8, 10], [8, 11], [8, 12],
  [9, 4], [10, 4], [11, 4], [12, 4],
  [9, 10], [10, 10], [11, 10], [12, 10],
  [4, 6], [5, 6], [9, 6], [10, 6],
  [7, 6], [7, 8], [7, 4], [7, 10],
  [13, 6], [13, 7], [13, 8]
];

// Create the grid and place dots/walls
for (let y = 0; y < gridSize; y++) {
  for (let x = 0; x < gridSize; x++) {
    const cell = document.createElement("div");
    cell.classList.add("cell");
    cell.dataset.x = x;
    cell.dataset.y = y;

    // Add a wall if the position matches a wall position
    if (wallPositions.some(pos => pos[0] === x && pos[1] === y)) {
      cell.classList.add("wall");
    } else if (x !== 0 || y !== 0) {
      // Add a dot to non-wall, non-starting cells
      const dot = document.createElement("div");
      dot.classList.add("dot");
      cell.appendChild(dot);
    }

    grid.appendChild(cell);
  }
}

// Create Pac-Man
const pacman = document.createElement("div");
pacman.classList.add("pacman");
grid.appendChild(pacman);

// Create Ghost
const ghost = document.createElement("div");
ghost.classList.add("ghost");
grid.appendChild(ghost);

let ghostX = 14; // Starting position of the ghost
let ghostY = 7; // Starting position of the ghost

// Function to move Pac-Man
function movePacman() {
  if (gameOver || !direction) return; // No movement if game is over or no direction is set

  let newX = pacmanX;
  let newY = pacmanY;

  switch (direction) {
    case "up":
      newY--;
      break;
    case "down":
      newY++;
      break;
    case "left":
      newX--;
      break;
    case "right":
      newX++;
      break;
  }

  // Check if the new position is within bounds
  if (newX < 0 || newX >= gridSize || newY < 0 || newY >= gridSize) {
    return; // Stop movement if out of bounds
  }

  // Check if the target cell is a wall
  const targetCell = [...grid.children].find(
    cell => cell.dataset.x == newX && cell.dataset.y == newY
  );

  if (targetCell && targetCell.classList.contains("wall")) {
    return; // Stop movement if the cell is a wall
  }

  // Update Pac-Man's position
  pacmanX = newX;
  pacmanY = newY;
  updatePacmanPosition();
  checkCollision();
}

// Update Pac-Man's position
function updatePacmanPosition() {
  pacman.style.transform = `translate(${pacmanX * cellSize}px, ${pacmanY * cellSize}px)`;

  // Check for a dot in the new cell
  const targetCell = [...grid.children].find(
    cell => cell.dataset.x == pacmanX && cell.dataset.y == pacmanY
  );

  if (targetCell && targetCell.querySelector(".dot")) {
    targetCell.querySelector(".dot").remove(); // Eat the dot
    score++;
    scoreDisplay.textContent = `Score: ${score}`;
    // Check if all dots are collected
    if (document.querySelectorAll(".dot").length === 0) {
      gameOver = true; // Stop the game
      clearInterval(gameLoop); // Stop the game loop
      displayMessage("Congratulations! You Win!");
    }
  }
}

// Check for collision with ghost
function checkCollision() {
  if (pacmanX === ghostX && pacmanY === ghostY) {
    gameOver = true;
    clearInterval(gameLoop); // Stop the game loop
    displayMessage("Game Over! Pac-Man was caught by the ghost.");
  }
}

// Counter to track how many steps the ghost has taken
let ghostStepCount = 0;
const chaseSteps = 5; // Number of steps the ghost chases Pac-Man
const randomSteps = 3; // Number of random steps before chasing again

// Helper function to check if a position is valid (within bounds and not a wall)
function isValid(x, y) {
    if (x < 0 || x >= gridSize || y < 0 || y >= gridSize) return false;
    const cell = grid.children[y * gridSize + x]; // Directly access the cell using y * gridSize + x
    return !cell.classList.contains("wall"); // Position is valid if it's not a wall
  }
  
  // Function to calculate random direction but biased towards Pac-Man's position
  function moveGhost() {
    if (gameOver) return; // Stop ghost movement if the game is over
  
    let newX = ghostX;
    let newY = ghostY;

    let movementMode = ghostStepCount < chaseSteps ? "chase" : "random";

    if (movementMode === "chase") {
    
      // Calculate the x and y differences between the ghost and Pac-Man
      const diffX = pacmanX - ghostX;
      const diffY = pacmanY - ghostY;
    
      // Direction preference based on Pac-Man's position
      let direction = "";
    
      // Bias towards the direction that has the largest difference
      if (Math.abs(diffX) > Math.abs(diffY)) {
        direction = diffX > 0 ? "right" : "left"; // Horizontal bias
      } else {
        direction = diffY > 0 ? "down" : "up"; // Vertical bias
      }
    
      // Try to move the ghost in the chosen direction if it's valid
      switch (direction) {
        case "up":
          if (isValid(newX, newY - 1)) newY--;
          break;
        case "down":
          if (isValid(newX, newY + 1)) newY++;
          break;
        case "left":
          if (isValid(newX - 1, newY)) newX--;
          break;
        case "right":
          if (isValid(newX + 1, newY)) newX++;
          break;
      }
  
      // If the ghost didn't move (it was blocked), try a random direction
      if (newX === ghostX && newY === ghostY) {
        // Opposite direction logic
        switch (direction) {
          case "up":
            if (isValid(newX, newY + 1)) newY++; // Move down
            break;
          case "down":
            if (isValid(newX, newY - 1)) newY--; // Move up
            break;
          case "left":
            if (isValid(newX + 1, newY)) newX++; // Move right
            break;
          case "right":
            if (isValid(newX - 1, newY)) newX--; // Move left
            break;
        }
      }
    }
    if (newX === ghostX && newY === ghostY) movementMode = "random";
    if (movementMode === "random") {
      const directions = ["up", "down", "left", "right"];
      for (let i = 0; i < directions.length; i++) {
        let randomDirection = directions[Math.floor(Math.random() * directions.length)];
    
        switch (randomDirection) {
          case "up":
            if (isValid(newX, newY - 1)) {
              newY--;
              break;
            }
          case "down":
            if (isValid(newX, newY + 1)) {
              newY++;
              break;
            }
          case "left":
            if (isValid(newX - 1, newY)) {
              newX--;
              break;
            }
          case "right":
            if (isValid(newX + 1, newY)) {
              newX++;
              break;
            }
        }
        // If ghost moved, stop searching for a valid direction
        if (newX !== ghostX || newY !== ghostY) break;
    }
  }
    // Update the ghost's position if it moved
    if (newX !== ghostX || newY !== ghostY) {
      ghostX = newX;
      ghostY = newY;
      ghost.style.transform = `translate(${ghostX * cellSize}px, ${ghostY * cellSize}px)`;
    }
    // Increment step count and reset if necessary
    ghostStepCount++;
    if (ghostStepCount >= chaseSteps + randomSteps) ghostStepCount = 0;
    checkCollision();
  }
  
  
  
// Listen for key presses
document.addEventListener("keydown", (event) => {
  if (isMoving || gameOver) return; // Prevent rapid direction changes or movement after game over
  isMoving = true;

  switch (event.key) {
    case "ArrowUp":
      direction = "up";
      break;
    case "ArrowDown":
      direction = "down";
      break;
    case "ArrowLeft":
      direction = "left";
      break;
    case "ArrowRight":
      direction = "right";
      break;
  }
});

// Stop rapid movement when key is released
document.addEventListener("keyup", () => {
  isMoving = false;
});

// Start the game loop
const gameLoop = setInterval(() => {
  movePacman();
  moveGhost();
}, 200); // Pac-Man moves every 200ms

// Initialize Pac-Man's position
updatePacmanPosition();
