// Get the canvas and context
const canvas = document.createElement("canvas");
const ctx = canvas.getContext("2d");
document.body.appendChild(canvas);

// Set canvas size
canvas.width = 500;
canvas.height = 700;

// Separate div for displaying scores
const scoreContainer = document.createElement("div");
scoreContainer.id = "score-container";
document.body.appendChild(scoreContainer);

// Player spaceship
const player = {
    x: canvas.width / 2,
    y: canvas.height - 30,
    width: 20,
    height: 20,
    color: 'white',
};

const font = '24px Arial';

// Shots fired by the player
const shots = [];

// Enemies (small triangles)
const enemies = [];

const availableLetters = ['a', 's', 'd', 'f', 'j', 'k', 'l', ';'];

// Initialize game variables (add more as needed)
// let score = 0;
// let lives = 3;
let currentWord = generateRandomWord();

function generateRandomWord() {
    // Implement word generation logic
}

// Initialize hit and miss variables
let hits = 0;
let misses = 0;


function drawScores() {
    // Display hit and miss scores in the separate div
    scoreContainer.innerHTML = `Hit: ${hits}    Miss: ${misses}`;
}

function createRandomEnemy() {
    const enemySize = 30; // Adjust the size of the enemy
    const enemySpeed = 3; // Adjust the speed of the enemy
    const margin = 20; // Adjust the margin to ensure enemies are not too close to the borders

    const randomLetter = availableLetters[Math.floor(Math.random() * availableLetters.length)];

    const enemy = {
        x: Math.random() * (canvas.width - 2 * margin - enemySize) + margin,
        y: 0,
        width: enemySize,
        height: enemySize,
        speed: enemySpeed,
        letter: randomLetter,
    };

    enemies.push(enemy);
}

function drawEnemies() {
    for (let i = 0; i < enemies.length; i++) {
        const enemy = enemies[i];

        ctx.beginPath();
        ctx.moveTo(enemy.x, enemy.y);
        ctx.lineTo(enemy.x - enemy.width / 2, enemy.y + enemy.height);
        ctx.lineTo(enemy.x + enemy.width / 2, enemy.y + enemy.height);
        ctx.closePath();  // Close the path to connect the last and first points
        ctx.fillStyle = 'black';
        ctx.strokeStyle = 'white';
        ctx.lineWidth = 2;
        ctx.fill();
        ctx.stroke();

        // Display the letter next to the enemy
        ctx.fillStyle = 'white';
        ctx.font = font;
        ctx.textAlign = 'center';
        ctx.fillText(enemy.letter, enemy.x, enemy.y + enemy.height + 20);
    }
}


function updateEnemies() {
    for (let i = 0; i < enemies.length; i++) {
        const enemy = enemies[i];
        enemy.y += enemy.speed;

        // Remove enemies that go off-screen
        if (enemy.y > canvas.height) {
            enemies.splice(i, 1);
            i--;
        }
    }
}

function draw() {
    // Clear the canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw player
    drawPlayer();

    // Draw shots
    drawShots();

    // Draw enemies
    drawEnemies();

    // Implement other drawing logic (score, etc.)

    drawScores();
}

// Draw player
function drawPlayer() {
    ctx.beginPath();
    ctx.moveTo(player.x, player.y);
    ctx.lineTo(player.x - player.width / 2, player.y + player.height);
    ctx.lineTo(player.x + player.width / 2, player.y + player.height);
    ctx.fillStyle = player.color;
    ctx.fill();
    ctx.closePath();
}

function shoot(letter) {
    console.log('Shoot called for letter:', letter);

    const matchingEnemy = enemies.find(enemy => enemy.letter === letter);
    if (matchingEnemy) {
        // Calculate the angle between the player and the enemy
        const angle = Math.atan2(matchingEnemy.y - player.y, matchingEnemy.x - player.x);

        // Calculate the components of the shot's velocity
        const speed = 25; // Adjust the speed of the shots
        const velocityX = speed * Math.cos(angle);
        const velocityY = speed * Math.sin(angle);

        const shot = {
            x: player.x,
            y: player.y,
            velocityX: velocityX,
            velocityY: velocityY,
        };

        shots.push(shot);
        console.log('Number of shots:', shots.length);
    }
}

// Function to draw shots
function drawShots() {
    // console.log('Number of shots:', shots.length);
    for (let i = 0; i < shots.length; i++) {
        ctx.fillStyle = 'white';
        ctx.fillRect(shots[i].x, shots[i].y, 2, 5); // Adjust size as needed
    }
}


function updateShots() {
    for (let i = 0; i < shots.length; i++) {
        shots[i].x += shots[i].velocityX;
        shots[i].y += shots[i].velocityY;

        // Check for collision with enemies with a small margin (e.g., 5 pixels)
        for (let j = 0; j < enemies.length; j++) {
            const enemy = enemies[j];
            const margin = 5; // Adjust the margin as needed

            if (
                shots[i].x + margin > enemy.x - enemy.width / 2 &&
                shots[i].x - margin < enemy.x + enemy.width / 2 &&
                shots[i].y + margin > enemy.y &&
                shots[i].y - margin < enemy.y + enemy.height
            ) {
                // Reduce enemy health or remove it if health becomes zero
                // For simplicity, let's remove the enemy directly
                enemies.splice(j, 1);
                // Add your logic for scoring or other actions here

                // Remove the shot that hit the enemy
                shots.splice(i, 1);
                i--; // Decrement i to recheck the current index

                // Break the loop to ensure that only one enemy is affected by each shot
                break;
            }
        }
    }
}






// Handle keyboard input
document.addEventListener("keydown", function (event) {
    const pressedKey = event.key.toLowerCase();

    // Create a shot for the pressed key
    if (availableLetters.includes(pressedKey)) {
        shoot(pressedKey);
    }

    // Check if any enemies with the pressed letter are on the screen
    const matchingEnemies = enemies.filter(enemy => enemy.letter === pressedKey);
    if (matchingEnemies.length > 0) {
        // Remove the first matching enemy (the one at the bottom)
        enemies.splice(enemies.indexOf(matchingEnemies[0]), 1);
        
        // Increment the hit count
        hits++;
    } else if (availableLetters.includes(pressedKey)) {
        // Increment the miss count if the pressed key is not on the screen
        misses++;
    }
  
});



function update() {
    // Update shots
    updateShots();

    // Update enemies
    updateEnemies();

    // Implement game logic (collision detection, etc.)

    // Draw scores
    drawScores();
}

function gameLoop() {
    updateShots(); // Add this line to explicitly call updateShots
    update();
    draw();
    requestAnimationFrame(gameLoop);
}

// Create new enemies at a regular interval
setInterval(createRandomEnemy, 700); // Every x miliseconds

// Start the game loop
gameLoop();
