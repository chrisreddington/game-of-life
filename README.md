
# Conway's Game of Life

A modern implementation of Conway's Game of Life using HTML5 Canvas with a pleasing GitHub-inspired color scheme.

## Overview

This implementation features:
- Responsive canvas that adapts to window size
- Smooth animations with configurable update intervals
- GitHub-style contribution graph color scheme
- Toroidal grid (edges wrap around)
- Cell aging visualization through color gradients

## Current Implementation

The game follows Conway's classic rules:
1. Any live cell with fewer than two live neighbors dies (underpopulation)
2. Any live cell with two or three live neighbors lives
3. Any live cell with more than three live neighbors dies (overpopulation)
4. Any dead cell with exactly three live neighbors becomes alive (reproduction)

Additional features:
- Cell colors indicate neighbor density
- Configurable initial population density
- Play/Pause and Reset controls
- Automatic resizing with window changes

## Getting Started

1. Clone the repository
2. Open index.html in a modern web browser
3. Use the controls to:
   - Toggle simulation (Play/Pause)
   - Reset the grid with new random cells

## Configuration

The game can be customized through the CONFIG object:
- cellSize: Size of each cell in pixels
- updateInterval: Time between generations in milliseconds
- initialDensity: Probability of cells being alive at start
- colors: Color scheme for cells based on neighbor count

## Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a new branch for your feature
3. Follow the code guidelines:
   - Use consistent naming conventions
   - Add JSDoc comments for new functions
   - Maintain existing code style
   - Test thoroughly
4. Submit a pull request with a clear description of your changes

## Development

The project uses vanilla JavaScript and HTML5 Canvas. Key files:
- game.js: Core game logic and rendering
- index.html: Game canvas and controls
- styles.css: Basic styling