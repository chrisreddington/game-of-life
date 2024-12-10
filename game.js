/** @type {HTMLCanvasElement} */
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Configuration
const CONFIG = {
    cellSize: 10,
    updateInterval: 500, // 0.5s
    initialDensity: 0.3,
    colors: {
        0: '#0d1117', // background
        1: '#9be9a8', // lightest
        2: '#40c463',
        3: '#30a14e',
        4: '#216e39'  // darkest
    }
};

// Game state
const state = {
    isRunning: false,
    lastUpdate: 0,
    grid: []
};

/**
 * Initializes the game grid with random cells
 * @returns {void}
 */
function initGrid() {
    const cols = Math.floor(window.innerWidth / CONFIG.cellSize);
    const rows = Math.floor(window.innerHeight / CONFIG.cellSize);
    state.grid = Array(rows).fill().map(() => 
        Array(cols).fill().map(() => Math.random() < CONFIG.initialDensity)
    );
}

/**
 * Returns color based on number of neighbors
 * @param {number} neighbors - Number of neighboring cells
 * @returns {string} Color code
 */
function getCellColor(neighbors) {
    return CONFIG.colors[Math.min(neighbors, 4)];
}

/**
 * Draws a single cell on the canvas
 * @param {number} x - X coordinate
 * @param {number} y - Y coordinate
 * @param {number} neighbors - Number of neighbors
 */
function drawCell(x, y, neighbors) {
    const size = CONFIG.cellSize;
    ctx.beginPath();
    ctx.roundRect(x * size, y * size, size - 1, size - 1, 2);
    ctx.fillStyle = getCellColor(neighbors);
    ctx.fill();
}

/**
 * Draws the entire grid on the canvas
 */
function drawGrid() {
    state.grid.forEach((row, y) => {
        row.forEach((cell, x) => {
            if (cell) {
                const neighbors = countNeighbors(x, y);
                drawCell(x, y, neighbors);
            } else {
                drawCell(x, y, 0);
            }
        });
    });
}

/**
 * Counts the number of alive neighbors for a cell at the given coordinates (x, y).
 * Uses a wrapping approach where the grid is treated as a torus (cells on edges connect to opposite edges).
 * 
 * @param {number} x - The x coordinate (column) of the cell
 * @param {number} y - The y coordinate (row) of the cell
 * @returns {number} The count of alive neighboring cells (0-8)
 * 
 * @example
 * // returns the number of alive neighbors for cell at position (2,3)
 * const aliveNeighbors = countNeighbors(2, 3);
 */
function countNeighbors(x, y) {
    let count = 0;
    for (let i = -1; i <= 1; i++) {
        for (let j = -1; j <= 1; j++) {
            if (i === 0 && j === 0) continue;
            const row = (y + i + state.grid.length) % state.grid.length;
            const col = (x + j + state.grid[0].length) % state.grid[0].length;
            count += state.grid[row][col] ? 1 : 0;
        }
    }
    return count;
}

/**
 * Updates the game state based on Conway's rules
 */
function updateGrid() {
    const newGrid = state.grid.map((row, y) => 
        row.map((cell, x) => {
            const neighbors = countNeighbors(x, y);
            return neighbors === 3 || (cell && neighbors === 2);
        })
    );
    state.grid = newGrid;
}

/**
 * Main game loop
 * @param {number} timestamp - Current timestamp
 */
function gameLoop(timestamp) {
    if (!state.isRunning) return;
    
    if (timestamp - state.lastUpdate >= CONFIG.updateInterval) {
        updateGrid();
        drawGrid();
        state.lastUpdate = timestamp;
    }
    
    requestAnimationFrame(gameLoop);
}

// Game controls
function toggleGame() {
    state.isRunning = !state.isRunning;
    if (state.isRunning) {
        state.lastUpdate = performance.now();
        gameLoop(state.lastUpdate);
    }
}

function resetGame() {
    state.isRunning = false;
    initGrid();
    drawGrid();
}

// Event handlers
window.addEventListener('resize', () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    initGrid();
});

// Initialization
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
initGrid();
drawGrid();