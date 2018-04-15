"use strict";

const TILESIZE = 48;
const COLUMNS = 7;
const ROWS = 6;
const WIDTH = COLUMNS * TILESIZE;
const HEIGHT = ROWS * TILESIZE;

const TOKENS = [];
for (let x = 0; x < COLUMNS; x++) {
    TOKENS[x] = [];
    for (let y = 0; y < ROWS; y++) {
        TOKENS[x][y] = '0';
    }
}
let currentPlayer = 1;

// Canvas
const canvas = document.querySelector('canvas');
const ctx = canvas.getContext('2d');
canvas.setAttribute('width', WIDTH);
canvas.setAttribute('height', HEIGHT);

// Draw Grid
ctx.strokeStyle = '#000000';
ctx.fillStyle = '#ffffff';
for (let x = 0; x < COLUMNS; x++) {
    for (let y = 0; y < ROWS; y++) {
        ctx.fillRect(x * TILESIZE, y * TILESIZE, TILESIZE, TILESIZE);
        ctx.strokeRect(x * TILESIZE, y * TILESIZE, TILESIZE, TILESIZE);
    }
}

window.addEventListener('click', (event) => {
    placeToken(Math.floor((event.x - canvas.offsetLeft) / TILESIZE));
});

function placeToken(x) {
    // Find lowest empty row
    let y = ROWS - 1;
    while (y >= 0 && TOKENS[x][y] > 0) {
        y--;
    }
    if (y === -1) {
        // CHECK IF ALL COLUMNS ARE FULL - IF SO GAME IS A DRAW
        return console.log("That column is full.");
    }

    // Place token in empty slot and swap turns
    TOKENS[x][y] = currentPlayer;
    ctx.strokeStyle = '#000000';
    if (currentPlayer === 1) {
        ctx.fillStyle = '#ff0000';
        currentPlayer = 2;
    }
    else {
        ctx.fillStyle = '#ffff00';
        currentPlayer = 1;
    }
    ctx.fillRect(x * TILESIZE, y * TILESIZE, TILESIZE, TILESIZE);
    ctx.strokeRect(x * TILESIZE, y * TILESIZE, TILESIZE, TILESIZE);

    // Check if the player has connected 4 tokens
    
}