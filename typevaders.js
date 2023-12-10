// Get the canvas and context
const canvas = document.createElement("canvas");
const ctx = canvas.getContext("2d");
document.body.appendChild(canvas);

// Set canvas size
canvas.width = 400;
canvas.height = 600;

// Player spaceship
const player = {
    x: canvas.width / 2,
    y: canvas.height - 30,
    width: 20,
    height: 20,
    color: 'white',
};

// Shots fired by the player
const shots = [];

// Initialize game variables (add more as needed)
let score = 0;
let lives = 3;
let currentWord = generateRandomWord();

function generateRandomWord() {
    // Implement word generation logic
}

function draw() {
    // Clear the canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw player
    drawPlayer();

    // Draw shots
    drawShots();

    // Implement other drawing logic (enemies, words, score, etc.)
}

function drawPlayer() {
    ctx.beginPath();
    ctx.moveTo(player.x, player.y);
    ctx.lineTo(player.x - player.width / 2, player.y + player.height);
    ctx.lineTo(player.x + player.width / 2, player.y + player.height);
    ctx.fillStyle = player.color;
    ctx.fill();
    ctx.closePath();
}

function drawShots() {
    for (let i = 0; i < shots.length; i++) {
        ctx.fillStyle = 'white';
        ctx.fillRect(shots[i].x, shots[i].y, 2, 5); // Adjust size as needed
    }
}

function updateShots() {
    for (let i = 0; i < shots.length; i++) {
        shots[i].y -= 5; // Adjust the speed of the shots
        if (shots[i].y < 0) {
            shots.splice(i, 1); // Remove shots that go off-screen
            i--;
        }
    }
}

// Handle keyboard input
document.addEventListener("keydown", function (event) {
    if (event.key === " ") {
        shots.push({ x: player.x, y: player.y });
    }
});

function update() {
    // Update shots
    updateShots();

    // Implement game logic (movement, collision detection, etc.)
}

function gameLoop() {
    update();
    draw();

    requestAnimationFrame(gameLoop);
}



// Start the game loop
gameLoop();
