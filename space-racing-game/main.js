// Game variables
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const startScreen = document.getElementById('startScreen');
const gameOverScreen = document.getElementById('gameOverScreen');
const startButton = document.getElementById('startButton');
const restartButton = document.getElementById('restartButton');
const scoreElement = document.getElementById('scoreValue');
const finalScoreElement = document.getElementById('finalScore');

let gameLoop;
let score = 0;
let gameSpeed = 5;
let isGameRunning = false;

// Player spaceship
const player = {
    x: canvas.width / 2,
    y: canvas.height - 100,
    width: 50,
    height: 50,
    speed: 8,
    dx: 0
};

// Obstacles array
let obstacles = [];

// Controls
const keys = {
    left: false,
    right: false
};

// Event Listeners
document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft') keys.left = true;
    if (e.key === 'ArrowRight') keys.right = true;
});

document.addEventListener('keyup', (e) => {
    if (e.key === 'ArrowLeft') keys.left = false;
    if (e.key === 'ArrowRight') keys.right = false;
});

startButton.addEventListener('click', startGame);
restartButton.addEventListener('click', startGame);

// Star background
const stars = Array(100).fill().map(() => ({
    x: Math.random() * canvas.width,
    y: Math.random() * canvas.height,
    speed: Math.random() * 3 + 1,
    radius: Math.random() * 2 + 1
}));

// Game functions
function startGame() {
    // Reset game state
    score = 0;
    gameSpeed = 5;
    obstacles = [];
    player.x = canvas.width / 2;
    isGameRunning = true;
    
    // Update UI
    startScreen.style.display = 'none';
    gameOverScreen.style.display = 'none';
    scoreElement.textContent = '0';
    
    // Start game loop
    if (gameLoop) cancelAnimationFrame(gameLoop);
    gameLoop = requestAnimationFrame(updateGame);
}

function createObstacle() {
    if (Math.random() < 0.02 + (gameSpeed * 0.002)) {
        obstacles.push({
            x: Math.random() * (canvas.width - 30),
            y: -30,
            width: 30,
            height: 30,
            speed: gameSpeed
        });
    }
}

function updatePlayer() {
    // Update player position based on input
    if (keys.left) player.dx = -player.speed;
    else if (keys.right) player.dx = player.speed;
    else player.dx = 0;

    // Update player position
    player.x += player.dx;

    // Keep player in bounds
    if (player.x < 0) player.x = 0;
    if (player.x > canvas.width - player.width) player.x = canvas.width - player.width;
}

function updateObstacles() {
    for (let i = obstacles.length - 1; i >= 0; i--) {
        const obstacle = obstacles[i];
        obstacle.y += obstacle.speed;

        // Remove obstacles that are off screen
        if (obstacle.y > canvas.height) {
            obstacles.splice(i, 1);
            score++;
            scoreElement.textContent = score;
            
            // Increase game speed
            if (score % 10 === 0) {
                gameSpeed += 0.5;
            }
        }

        // Check collision
        if (checkCollision(player, obstacle)) {
            gameOver();
            return;
        }
    }
}

function updateStars() {
    stars.forEach(star => {
        star.y += star.speed;
        if (star.y > canvas.height) {
            star.y = 0;
            star.x = Math.random() * canvas.width;
        }
    });
}

function checkCollision(rect1, rect2) {
    return rect1.x < rect2.x + rect2.width &&
           rect1.x + rect1.width > rect2.x &&
           rect1.y < rect2.y + rect2.height &&
           rect1.y + rect1.height > rect2.y;
}

function drawPlayer() {
    // Draw spaceship
    ctx.fillStyle = '#00ff00';
    ctx.beginPath();
    ctx.moveTo(player.x + player.width / 2, player.y);
    ctx.lineTo(player.x + player.width, player.y + player.height);
    ctx.lineTo(player.x, player.y + player.height);
    ctx.closePath();
    ctx.fill();

    // Add engine glow
    ctx.fillStyle = '#ff6600';
    ctx.beginPath();
    ctx.moveTo(player.x + player.width * 0.3, player.y + player.height);
    ctx.lineTo(player.x + player.width * 0.5, player.y + player.height + 15);
    ctx.lineTo(player.x + player.width * 0.7, player.y + player.height);
    ctx.closePath();
    ctx.fill();
}

function drawObstacles() {
    ctx.fillStyle = '#ff0000';
    obstacles.forEach(obstacle => {
        ctx.beginPath();
        ctx.arc(
            obstacle.x + obstacle.width / 2,
            obstacle.y + obstacle.height / 2,
            obstacle.width / 2,
            0,
            Math.PI * 2
        );
        ctx.fill();
    });
}

function drawStars() {
    ctx.fillStyle = '#ffffff';
    stars.forEach(star => {
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
        ctx.fill();
    });
}

function gameOver() {
    isGameRunning = false;
    gameOverScreen.style.display = 'flex';
    finalScoreElement.textContent = score;
    cancelAnimationFrame(gameLoop);
}

function updateGame() {
    if (!isGameRunning) return;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Update game objects
    updateStars();
    updatePlayer();
    createObstacle();
    updateObstacles();

    // Draw game objects
    drawStars();
    drawObstacles();
    drawPlayer();

    // Continue game loop
    gameLoop = requestAnimationFrame(updateGame);
}

// Initialize game
window.addEventListener('load', () => {
    startScreen.style.display = 'flex';
    gameOverScreen.style.display = 'none';
});
