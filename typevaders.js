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

// Enemies (small triangles)
const enemies = [];

const availableLetters = ['a', 's', 'd', 'f', 'j', 'k', 'l', ';'];

// Initialize game variables (add more as needed)
let score = 0;
let lives = 3;
let currentWord = generateRandomWord();

function generateRandomWord() {
    // Implement word generation logic
}

function createEnemy() {
    const enemySize = 20; // Adjust the size of the enemy
    const enemySpeed = 2; // Adjust the speed of the enemy

    const enemy = {
        x: Math.random() * (canvas.width - enemySize),
        y: 0,
        width: enemySize,
        height: enemySize,
        speed: enemySpeed,
        letter: 'j', // The letter associated with the enemy
    };

    enemies.push(enemy);
}

function createRandomEnemy() {
    const enemySize = 20; // Adjust the size of the enemy
    const enemySpeed = 2; // Adjust the speed of the enemy

    const randomLetter = availableLetters[Math.floor(Math.random() * availableLetters.length)];

    const enemy = {
        x: Math.random() * (canvas.width - enemySize),
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
        ctx.font = '12px Arial';
        ctx.textAlign = 'center';
        ctx.fillText(enemy.letter, enemy.x, enemy.y + enemy.height + 12);
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
        const speed = 5; // Adjust the speed of the shots
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



// Function to update the position of shots and handle collisions
function updateShots() {
    for (let i = 0; i < shots.length; i++) {
        shots[i].x += shots[i].velocityX;
        shots[i].y += shots[i].velocityY;

        // Handle collisions with enemies
        for (let j = 0; j < enemies.length; j++) {
            const enemy = enemies[j];
            if (
                shots[i].x > enemy.x - enemy.width / 2 &&
                shots[i].x < enemy.x + enemy.width / 2 &&
                shots[i].y > enemy.y &&
                shots[i].y < enemy.y + enemy.height
            ) {
                // Remove the shot and the enemy
                shots.splice(i, 1);
                enemies.splice(j, 1);
                i--; // Adjust the index after removing the shot
                // Add your logic for scoring or other actions here
            }
        }

        // Remove shots that go off-screen
        if (shots[i] && shots[i].y < 0) {
            shots.splice(i, 1);
            i--;
        }
    }
}

// Handle keyboard input
document.addEventListener("keydown", function (event) {
    console.log('Key pressed:', event.key);

    const pressedKey = event.key.toLowerCase();

    if (availableLetters.includes(pressedKey)) {
        // If the pressed key is in availableLetters, call the shoot function
        shoot(pressedKey);
    }

    // Check if any enemies with the pressed letter are on the screen
    const matchingEnemies = enemies.filter(enemy => enemy.letter === pressedKey);
    if (matchingEnemies.length > 0) {
        // Remove the first matching enemy (the one at the bottom)
        enemies.splice(enemies.indexOf(matchingEnemies[0]), 1);
        // Add your logic for scoring or other actions here
    }

   
});



function update() {
    // Update shots
    updateShots();

    // Update enemies
    updateEnemies();

    // Implement game logic (collision detection, etc.)
}

function gameLoop() {
    updateShots(); // Add this line to explicitly call updateShots
    update();
    draw();
    requestAnimationFrame(gameLoop);
}

// Create new enemies at a regular interval
setInterval(createRandomEnemy, 2000); // Every 2 seconds

// Start the game loop
gameLoop();
