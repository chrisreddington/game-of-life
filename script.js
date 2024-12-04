/**
 * @typedef {boolean[][]} Grid
 */

/**
 * @constant {Object} COLORS Configuration for cell colors based on neighbor count
 */
const COLORS = {
    DEAD: 'white',
    ISOLATED: '#9be9a8',    // 0-1 neighbors
    BALANCED: '#40c463',    // 2-3 neighbors
    CROWDED: '#30a14e',     // 4-5 neighbors
    OVERPOPULATED: '#216e39' // 6+ neighbors
};

/**
 * @constant {Object} GAME_CONFIG Game configuration parameters
 */
const GAME_CONFIG = {
    CELL_SIZE: 10,
    GENERATION_DELAY: 500,
    INITIAL_LIFE_PROBABILITY: 0.3,
    CELL_BORDER_RADIUS: 2
};

const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
let animationId = null;
let grid = [];

/**
 * @description Initializes the canvas and creates initial grid state
 */
function initializeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    const rows = Math.floor(canvas.height / GAME_CONFIG.CELL_SIZE);
    const cols = Math.floor(canvas.width / GAME_CONFIG.CELL_SIZE);
    
    grid = createInitialGrid(rows, cols);
}

/**
 * @description Creates initial random grid state
 * @param {number} rows - Number of rows
 * @param {number} cols - Number of columns
 * @returns {Grid} Initial game grid
 */
function createInitialGrid(rows, cols) {
    return Array(rows).fill().map(() => 
        Array(cols).fill().map(() => 
            Math.random() < GAME_CONFIG.INITIAL_LIFE_PROBABILITY
        )
    );
}

/**
 * @description Determines cell color based on neighbor count
 * @param {number} neighbors - Number of living neighbors
 * @param {boolean} alive - Cell's current state
 * @returns {string} Color value
 */
function getCellColor(neighbors, alive) {
    if (!alive) return COLORS.DEAD;
    
    if (neighbors <= 1) return COLORS.ISOLATED;
    if (neighbors <= 3) return COLORS.BALANCED;
    if (neighbors <= 5) return COLORS.CROWDED;
    return COLORS.OVERPOPULATED;
}

/**
 * @description Draws a single cell on the canvas
 * @param {number} x - X coordinate
 * @param {number} y - Y coordinate
 * @param {boolean} alive - Cell's state
 */
function drawCell(x, y, alive) {
    const neighbors = countNeighbors(x, y);
    ctx.fillStyle = getCellColor(neighbors, alive);
    
    ctx.beginPath();
    ctx.roundRect(
        x * GAME_CONFIG.CELL_SIZE, 
        y * GAME_CONFIG.CELL_SIZE, 
        GAME_CONFIG.CELL_SIZE - 1, 
        GAME_CONFIG.CELL_SIZE - 1, 
        GAME_CONFIG.CELL_BORDER_RADIUS
    );
    ctx.fill();
}

/**
 * Counts the number of live neighbors for a cell in Conway's Game of Life.
 * Uses a toroidal (wrapping) grid where the edges connect to the opposite side.
 * Checks all 8 adjacent cells (horizontal, vertical, and diagonal).
 * 
 * @param {number} row - The row index of the current cell
 * @param {number} col - The column index of the current cell
 * @returns {number} The count of live neighboring cells (0-8)
 */
function countNeighbors(row, col) {
    return [-1, 0, 1].reduce((count, i) => 
        count + [-1, 0, 1].reduce((innerCount, j) => {
            if (i === 0 && j === 0) return innerCount;
            const newRow = (row + i + grid.length) % grid.length;
            const newCol = (col + j + grid[0].length) % grid[0].length;
            return innerCount + (grid[newRow][newCol] ? 1 : 0);
        }, 0)
    , 0);
}

/**
 * @description Updates grid state based on Game of Life rules
 */
function updateGrid() {
    grid = grid.map((row, i) =>
        row.map((cell, j) => {
            const neighbors = countNeighbors(i, j);
            return neighbors === 3 || (cell && neighbors === 2);
        })
    );
}

/**
 * @description Draws the entire grid state
 */
function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    grid.forEach((row, i) => 
        row.forEach((cell, j) => drawCell(j, i, cell))
    );
}

/**
 * @description Main game loop
 */
function gameLoop() {
    updateGrid();
    draw();
    animationId = setTimeout(() => {
        requestAnimationFrame(gameLoop);
    }, GAME_CONFIG.GENERATION_DELAY);
}

// Game Control Functions
const startGame = () => !animationId && gameLoop();
const stopGame = () => {
    if (animationId) {
        clearTimeout(animationId);
        animationId = null;
    }
};
const resetGame = () => {
    stopGame();
    initializeCanvas();
    draw();
};

// Event Listeners
window.addEventListener('resize', () => {
    initializeCanvas();
    draw();
});

// Initial Setup
initializeCanvas();
draw();