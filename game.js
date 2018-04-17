"use strict";

const TILESIZE = 48;
const COLUMNS = 7;
const ROWS = 6;
let GRID_COLOUR = '#0000a0';
let BACKGROUND_COLOUR = '#ffffff';
let PLAYER1_COLOUR = '#ff0000';
let PLAYER2_COLOUR = '#ffff00';

const WIDTH = COLUMNS * TILESIZE;
const HEIGHT = ROWS * TILESIZE;
const TOKENS = [];
let currentPlayer = 1;

// Canvas
const canvas = document.querySelector('canvas');
const ctx = canvas.getContext('2d');
resetGame();

window.addEventListener('click', (event) => {
    if (event.y - canvas.offsetTop < HEIGHT) {
        placeToken(Math.floor((event.x - canvas.offsetLeft) / TILESIZE));
    }
});

function placeToken(x) {
    if (x < 0 || x >= COLUMNS) {
        return;
    }
    
    // Find lowest empty row
    let y = ROWS - 1;
    while (y >= 0 && TOKENS[x][y] > 0) {
        y--;
    }

    // Check if current column is full
    if (y === -1) {
        // Check if all columns are full - If so game is a draw - Else try again
        for (let loopX = 0; loopX < 7; loopX++) {
            for (let loopY = 0; loopY < 6; loopY++) {
                if (!TOKENS[loopX][loopY]) {
                    return console.log("That column is full.");
                }
            }
        }
        return console.log("Game is a draw.");
    }

    // Place token in empty slot
    TOKENS[x][y] = currentPlayer;
    ctx.strokeStyle = GRID_COLOUR;
    if (currentPlayer === 1) {
        ctx.fillStyle = PLAYER1_COLOUR;
    }
    else {
        ctx.fillStyle = PLAYER2_COLOUR;
    }
    ctx.fillRect(x * TILESIZE, y * TILESIZE, TILESIZE, TILESIZE);
    ctx.strokeRect(x * TILESIZE, y * TILESIZE, TILESIZE, TILESIZE);

    // Check if the player has connected 4 tokens
    checkConnectFour(x, y, currentPlayer)

    // Swap Turns
    if (currentPlayer === 1) {
        currentPlayer = 2;
    }
    else {
        currentPlayer = 1;
    }
}

function checkConnectFour(x, y, player) {
    let leftCount = 0;
    let rightCount = 0;
    let upCount = 0;
    let downCount = 0;
    let upLeftCount = 0;
    let upRightCount = 0;
    let downLeftCount = 0;
    let downRightCount = 0;

    if (x > 0) {
        leftCount = checkNextToken(x, y, -1, 0, player, 0);
        if (leftCount >= COLUMNS * ROWS) return winGame(player);
    }
    if (x < 6) {
        rightCount = checkNextToken(x, y, 1, 0, player, 0);
        if (rightCount >= COLUMNS * ROWS) return winGame(player);
    }
    if (y > 0) {
        upCount = checkNextToken(x, y, 0, -1, player, 0);
        if (upCount >= COLUMNS * ROWS) return winGame(player);

        if (x > 0) {
            upLeftCount = checkNextToken(x, y, -1, -1, player, 0);
            if (upLeftCount >= COLUMNS * ROWS) return winGame(player);
        }
        if (x < 6) {
            upRightCount = checkNextToken(x, y, 1, -1, player, 0);
            if (upRightCount >= COLUMNS * ROWS) return winGame(player);
        }
    }
    if (y < 5) {
        downCount = checkNextToken(x, y, 0, 1, player, 0);
        if (downCount >= COLUMNS * ROWS) return winGame(player);

        if (x > 0) {
            downLeftCount = checkNextToken(x, y, -1, 1, player, 0);
            if (downLeftCount >= COLUMNS * ROWS) return winGame(player);
        }
        if (x < 6) {
            downRightCount = checkNextToken(x, y, 1, 1, player, 0);
            if (downRightCount >= COLUMNS * ROWS) return winGame(player);
        }
    }

    if ((leftCount + rightCount >= 3) || (upCount + downCount >= 3) || (upLeftCount + downRightCount >= 3) || (downLeftCount + upRightCount >= 3)) {
        return winGame(player);
    }
}

function checkNextToken(x, y, directionX, directionY, player, counter) {
    if (counter === 3) {
        return COLUMNS * ROWS;  // Player Wins
    }
    else if (x + directionX < 0 || x + directionX >= COLUMNS || y + directionY < 0 || y + directionY >= ROWS) {
        return counter;
    }
    else if (TOKENS[x + directionX][y + directionY] === player) {
        return checkNextToken(x + directionX, y + directionY, directionX, directionY, player, counter + 1);
    }
    else {
        return counter;
    }
}

function winGame(player) {
    ctx.font = '40px Arial';
    ctx.textAlign = 'center';
    ctx.fillStyle = '#000000';
    ctx.fillRect(0, TILESIZE * 2, WIDTH, HEIGHT - (TILESIZE * 4));
    ctx.fillStyle = '#ffffff';
    ctx.fillText(`PLAYER ${player} WINS!`, WIDTH / 2, HEIGHT / 2);
}

function resetGame() {
    // Resize Canvas
    canvas.setAttribute('width', WIDTH);
    canvas.setAttribute('height', HEIGHT + (TILESIZE * 2));

    // Draw UI
    ctx.fillStyle = GRID_COLOUR;
    ctx.fillRect(0, HEIGHT, WIDTH, TILESIZE * 2);
    ctx.fillStyle = '#000033'
    ctx.fillRect(0 + 10, HEIGHT + (TILESIZE / 2), WIDTH - (TILESIZE / 2), (TILESIZE * 2) - (TILESIZE / 2));

    // Draw Grid and reset Tokens
    ctx.lineWidth = 5;
    ctx.strokeStyle = GRID_COLOUR;
    ctx.fillStyle = BACKGROUND_COLOUR;
    for (let x = 0; x < COLUMNS; x++) {
        TOKENS[x] = [];
        for (let y = 0; y < ROWS; y++) {
            TOKENS[x][y] = 0;
            ctx.fillRect(x * TILESIZE, y * TILESIZE, TILESIZE, TILESIZE);
            ctx.strokeRect(x * TILESIZE, y * TILESIZE, TILESIZE, TILESIZE);
        }
    }
}