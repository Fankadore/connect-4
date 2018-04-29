"use strict";

const canvas = document.querySelector('canvas');
const ctx = canvas.getContext('2d');

const TILESIZE = 48;
const COLUMNS = 7;
const ROWS = 6;
let GRID_COLOUR = '#0000a0';
let PLAYER1_COLOUR = '#ff0000';
let PLAYER2_COLOUR = '#ffff00';

const WIDTH = COLUMNS * TILESIZE;
const HEIGHT = ROWS * TILESIZE;
const TOKENS = [];
let currentPlayer = 1;
let winner = 0;
let score1 = 0;
let score2 = 0;

function getMouesPosition(event) {
    let mouseX = event.offsetX * canvas.width / canvas.clientWidth || 0;
    let mouseY = event.offsetY * canvas.height / canvas.clientHeight || 0;
    return { mouseX, mouseY };
}

canvas.addEventListener('click', (event) => {
    let { mouseX, mouseY } = getMouesPosition(event);
    if (mouseY < HEIGHT) {
        if (winner) {
            resetGame();
        }
        else {
            placeToken(Math.floor(mouseX / TILESIZE));
        }
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
    if (y < 0) {
        return console.log("That column is full.");
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

    // Swap the active player
    if (currentPlayer === 1) {
        currentPlayer = 2;
    }
    else {
        currentPlayer = 1;
    }
    drawUITokens();

    // Check if all columns are full - If so game is a draw
    if (y === 0) {
        let counter = 0;
        for (let loopX = 0; loopX < 7; loopX++) {
            for (let loopY = 0; loopY < 6; loopY++) {
                if (!TOKENS[loopX][loopY]) {
                    counter++;
                }
            }
        }
        if (counter === 0) return winGame(-1); // Game is a Draw
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
    winner = player;

    // Increase the score
    if (winner === 1) {
        score1++;
    }
    else if (winner === 2) {
        score2++;
    }
    drawScore();
    
    ctx.fillStyle = '#000000';
    ctx.fillRect(0, (HEIGHT / 2) - (TILESIZE / 2), WIDTH, TILESIZE);

    ctx.font = `${TILESIZE / 2}px Arial`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillStyle = '#ffffff';
    if (winner === -1) {
        // Game is a Draw Message
        ctx.fillText('GAME IS A DRAW!', WIDTH / 2, HEIGHT / 2);
    }
    else {
        // Player Wins Message
        ctx.fillText(`PLAYER ${winner} WINS!`, WIDTH / 2, HEIGHT / 2);
    }
}

function resetGame() {
    // Resize Canvas
    canvas.setAttribute('width', WIDTH);
    canvas.setAttribute('height', HEIGHT + (TILESIZE * 2));

    // Draw UI
    ctx.fillStyle = GRID_COLOUR;
    ctx.fillRect(0, HEIGHT, WIDTH, TILESIZE * 2);
    ctx.clearRect(0 + (TILESIZE / 2), HEIGHT + (TILESIZE / 2), WIDTH - TILESIZE, (TILESIZE * 1.5));
    drawScore();
    
    // Draw the UI Tokens - These are turn indicators
    drawUITokens();

    // Draw Grid and reset Tokens
    ctx.lineWidth = 5;
    ctx.strokeStyle = GRID_COLOUR;
    for (let x = 0; x < COLUMNS; x++) {
        TOKENS[x] = [];
        for (let y = 0; y < ROWS; y++) {
            TOKENS[x][y] = 0;
            ctx.strokeRect(x * TILESIZE, y * TILESIZE, TILESIZE, TILESIZE);
        }
    }
    winner = 0;
}

function drawUITokens() {
    ctx.lineWidth = 3;
    ctx.strokeStyle = '#000000';

    // Player 1 UI Token
    if (currentPlayer === 1) {
        ctx.fillStyle = PLAYER1_COLOUR;
    }
    else {
        ctx.fillStyle = '#000000';
    }
    ctx.beginPath();
    ctx.arc(0 + (TILESIZE * 1.25), HEIGHT + (TILESIZE * 1.25), TILESIZE / 2, 0, 2 * Math.PI);
    ctx.fill();
    ctx.stroke();

    // Player 2 UI Token
    if (currentPlayer === 2) {
        ctx.fillStyle = PLAYER2_COLOUR;
    }
    else {
        ctx.fillStyle = '#000000';
    }
    ctx.beginPath();
    ctx.arc(WIDTH - (TILESIZE * 1.25), HEIGHT + (TILESIZE * 1.25), TILESIZE / 2, 0, 2 * Math.PI);
    ctx.fill();
    ctx.stroke();
}

function drawScore() {
    ctx.clearRect(TILESIZE * 2, HEIGHT + (TILESIZE / 2), WIDTH - (TILESIZE * 4), TILESIZE * 1.5);
    ctx.font = `${TILESIZE}px Arial`;
    ctx.textAlign = 'center';
    ctx.fillStyle = GRID_COLOUR;
    ctx.fillText(`${score1} - ${score2}`, WIDTH / 2, HEIGHT + (TILESIZE * 1.5));
}

resetGame();