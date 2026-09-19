document.addEventListener('DOMContentLoaded', () => {
    const canvas = document.getElementById('gameCanvas');
    const ctx = canvas.getContext('2d');
    const scoreElement = document.getElementById('score');
    const speedControl = document.getElementById('speedControl');
    const speedValue = document.getElementById('speedValue');
    const snakeColorPicker = document.getElementById('snakeColor');
    const foodColorPicker = document.getElementById('foodColor');
    const bgColorPicker = document.getElementById('bgColor');
    const startBtn = document.getElementById('startBtn');
    const overlay = document.getElementById('gameOverOverlay');
    const overlayMsg = document.getElementById('gameOverMessage');
    const restartBtn = document.getElementById('restartBtn');
    const eatSound = document.getElementById('eatSound');
    const gameOverSound = document.getElementById('gameOverSound');

    const gridSize = 20; // size of each cell in pixels
    // Size the canvas to fill the viewport (minus a small margin) and keep it square
    function setCanvasSize() {
        const size = Math.min(window.innerWidth, window.innerHeight) - 40;
        canvas.width = size;
        canvas.height = size;
        cells = Math.floor(size / gridSize);
    }
    let cells;
    setCanvasSize();
    window.addEventListener('resize', setCanvasSize);

    let snake = [{ x: 10, y: 10 }]; // initial snake head position
    let direction = { x: 1, y: 0 }; // start moving right
    let nextDirection = direction; // store next direction from key press
    let food = { x: 5, y: 5 };
    let score = 0;
    let gameInterval;
    let currentSpeed = 100; // ms, default matches initial range value

    function drawCell(x, y, color) {
        ctx.fillStyle = color;
        ctx.fillRect(x * gridSize, y * gridSize, gridSize, gridSize);
    }

    function spawnFood() {
        // Random position not occupied by snake
        let newFood;
        do {
            newFood = {
                x: Math.floor(Math.random() * cells),
                y: Math.floor(Math.random() * cells)
            };
        } while (snake.some(segment => segment.x === newFood.x && segment.y === newFood.y));
        food = newFood;
    }

    function update() {
        // Update direction
        direction = nextDirection;
        // Compute new head position
        const newHead = {
            x: (snake[0].x + direction.x + cells) % cells,
            y: (snake[0].y + direction.y + cells) % cells
        };

        // Check collision with self
        if (snake.some(seg => seg.x === newHead.x && seg.y === newHead.y)) {
            endGame();
            return;
        }

        // Add new head
        snake.unshift(newHead);

        // Check if food eaten
        if (newHead.x === food.x && newHead.y === food.y) {
            score++;
            scoreElement.textContent = `Score: ${score}`;
            // play sound
            eatSound.currentTime = 0;
            eatSound.play();
            spawnFood();
        } else {
            // Remove tail
            snake.pop();
        }
    }

    function draw() {
        // Clear whole canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        // Fill background with selected color
        ctx.fillStyle = bgColorPicker.value;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        // Draw snake with selected color
        const snakeCol = snakeColorPicker.value;
        snake.forEach((segment, index) => {
            drawCell(segment.x, segment.y, snakeCol);
        });
        // Draw food with selected color
        drawCell(food.x, food.y, foodColorPicker.value);
    }

    function gameLoop() {
        update();
        draw();
    }

    // The endGame function is now defined later with UI overlay handling.

    // Key handling
    document.addEventListener('keydown', (e) => {
        const key = e.key;
        if (key === 'ArrowUp' && direction.y !== 1) {
            nextDirection = { x: 0, y: -1 };
        } else if (key === 'ArrowDown' && direction.y !== -1) {
            nextDirection = { x: 0, y: 1 };
        } else if (key === 'ArrowLeft' && direction.x !== 1) {
            nextDirection = { x: -1, y: 0 };
        } else if (key === 'ArrowRight' && direction.x !== -1) {
            nextDirection = { x: 1, y: 0 };
        }
    });

    // ---------- Game Control Functions ----------
    function startGame() {
        // Apply background color
        canvas.style.backgroundColor = bgColorPicker.value;
        // Reset state
        snake = [{ x: Math.floor(cells / 2), y: Math.floor(cells / 2) }];
        direction = { x: 1, y: 0 };
        nextDirection = direction;
        score = 0;
        scoreElement.textContent = `Score: ${score}`;
        overlay.style.display = 'none';
        spawnFood();
        clearInterval(gameInterval);
        gameInterval = setInterval(gameLoop, currentSpeed);
    }

    function changeSpeed() {
        const val = Number(speedControl.value);
        currentSpeed = val;
        speedValue.textContent = `${val} ms`;
        if (gameInterval) {
            clearInterval(gameInterval);
            gameInterval = setInterval(gameLoop, currentSpeed);
        }
    }

    function endGame() {
        clearInterval(gameInterval);
        overlayMsg.textContent = `Game Over! Your score: ${score}`;
        overlay.style.display = 'flex';
        gameOverSound.currentTime = 0;
        gameOverSound.play();
    }

    // UI event listeners
    startBtn.addEventListener('click', startGame);
    restartBtn.addEventListener('click', startGame);
    speedControl.addEventListener('input', changeSpeed);
    bgColorPicker.addEventListener('input', () => { canvas.style.backgroundColor = bgColorPicker.value; });

    // Initialize UI values
    speedValue.textContent = `${speedControl.value} ms`;
    canvas.style.backgroundColor = bgColorPicker.value;

    // Hide overlay initially; game starts on button click.
    overlay.style.display = 'none';
    // Auto‑start the game so the user sees the snake immediately
    startGame();
});
