let currentPlayer = 'X';  // Player 'X' starts the game
let gameBoard = ['', '', '', '', '', '', '', '', ''];  // 3x3 board as a 1D array
let xScore = 0;
let oScore = 0;
let gameActive = true;  // To track if the game is still active or has ended

// Get DOM elements
const boardElement = document.getElementById('game-board');
const resetButton = document.getElementById('reset-btn');
const xScoreElement = document.getElementById('x-score');
const oScoreElement = document.getElementById('o-score');
const homeButton = document.getElementById('home-btn');

// Create message element (will hold the win/draw message)
const messageElement = document.createElement('div');
document.body.appendChild(messageElement);  // Append the message element at the bottom
messageElement.classList.add('game-message'); // Add a default class for styling

// Function to initialize a new game board
function createBoard() {
    boardElement.innerHTML = '';  // Clear the board
    gameBoard = ['', '', '', '', '', '', '', '', ''];  // Reset the gameBoard array

    // Create the grid of cells
    for (let i = 0; i < 9; i++) {
        const cell = document.createElement('div');
        cell.classList.add('cell');
        cell.setAttribute('data-index', i);
        cell.addEventListener('click', handleCellClick);
        boardElement.appendChild(cell);
    }

    // Hide the message when starting a new game
    messageElement.textContent = '';
    messageElement.style.display = 'none'; // Hide message initially
}

// Function to handle cell clicks
function handleCellClick(event) {
    const index = event.target.getAttribute('data-index');
    if (gameBoard[index] !== '' || !gameActive) {
        return;  // Ignore if the cell is already filled or if the game is over
    }

    // Mark the cell with the current player's symbol
    gameBoard[index] = currentPlayer;
    event.target.textContent = currentPlayer;

    // Check for a win or draw
    if (checkWinner()) {
        setTimeout(() => {
            messageElement.textContent = `${currentPlayer} wins!`;  // Show win message
            messageElement.classList.add('win-message');  // Add a class for winning style
            messageElement.style.display = 'block';  // Make the message visible
            updateScore(); // Update score only when there's a winner
            createBoard(); // Reset the board for the next round
        }, 200);
    } else if (gameBoard.every(cell => cell !== '')) {
        setTimeout(() => {
            messageElement.textContent = "It's a draw!";  // Show draw message
            messageElement.classList.add('draw-message');  // Add a class for draw style
            messageElement.style.display = 'block';  // Make the message visible
            createBoard(); // Reset the board for the next round
        }, 200);
    } else {
        // Switch player
        currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
    }
}

// Function to check if there is a winner
function checkWinner() {
    const winningCombinations = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8],  // Horizontal
        [0, 3, 6], [1, 4, 7], [2, 5, 8],  // Vertical
        [0, 4, 8], [2, 4, 6]              // Diagonal
    ];

    for (let combination of winningCombinations) {
        const [a, b, c] = combination;
        if (gameBoard[a] && gameBoard[a] === gameBoard[b] && gameBoard[a] === gameBoard[c]) {
            return true;
        }
    }
    return false;
}

// Function to update the score based on the winner
function updateScore() {
    if (currentPlayer === 'X') {
        xScore++;
        xScoreElement.textContent = xScore;
    } else {
        oScore++;
        oScoreElement.textContent = oScore;
    }
}

// Function to reset the game
function resetGame() {
    gameActive = true;
    currentPlayer = 'X';
    createBoard(); // Only reset the board
    xScore = 0;
    xScoreElement.textContent = xScore;
    oScore = 0;
    oScoreElement.textContent = oScore;
}

// Reset game button
resetButton.addEventListener('click', resetGame);

// Initialize the game when the page loads
createBoard();
