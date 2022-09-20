import readline from 'readline';
import { io } from 'socket.io-client';

import { config } from "./config.js";

const gameState = {
    myId: null,
    players:{},
    fruits: {}
}


const socket = io('ws://localhost:3333');

socket.on('connect', () => {
    console.log('connected', socket.id);
    gameState.myId = socket.id;
})

socket.on('initialPositions', positions => {
    addPlayer({ playerId: gameState.myId, positionX: positions.positionX, positionY: positions.positionY })
}) 

socket.on('newPlayer', player => {
    addPlayer({ playerId: player.playerId, positionX: player.positionX, positionY: player.positionY });
}) 

function movePlayer({ playerId, move }) {
    const acceptedMoves = {
        down() {
            if(gameState.players[playerId].positionY + 1 === config.screenHeight) return
            gameState.players[playerId].positionY++
        },
        up() {
            if(gameState.players[playerId].positionY === 0) return
            gameState.players[playerId].positionY--
        },
        left() {
            if(gameState.players[playerId].positionX === 0) return
            gameState.players[playerId].positionX--
        },
        right() {
            if(gameState.players[playerId].positionX + 1 === config.screenWidth) return
            gameState.players[playerId].positionX++
        },
    }

    const moveFunction = acceptedMoves[move];

    if(!moveFunction) return;

    moveFunction();
    checkPlayerCollision({ playerId })
    renderScreen();
}


function checkPlayerCollision({ playerId }) {
    const player = gameState.players[playerId];

    for(const fruitId in gameState.fruits){
        const fruit = gameState.fruits[fruitId];
        if(player.positionX !== fruit.positionX || player.positionY !== fruit.positionY) continue

        removeFruit({
            fruitId
        })
    }
}


function addPlayer({ playerId, positionX, positionY }) {
    gameState.players[playerId] = {
        positionX,
        positionY
    }
    
    renderScreen();
}

function addFruit({ fruitId, positionX, positionY }) {
    gameState.fruits[fruitId] = {
        positionX,
        positionY
    }

    renderScreen();
}


function removePlayer({ playerId }) {
    delete gameState.players[playerId];
    
    renderScreen();
}

function removeFruit({ fruitId }) {
    delete gameState.fruits[fruitId];

    renderScreen();
}


function renderScreen() {
    const canvas = Array.from({
        length: config.screenHeight 
    }, () => Array(config.screenWidth).fill('\x1b[47m  '));

    canvas[config.screenHeight-1][config.screenWidth-1] = '\x1b[47m  \x1b[0m'


    const players = gameState.players;
    const fruits = gameState.fruits;

    for(const prop in players){
        canvas[players[prop].positionY][players[prop].positionX] = '\x1b[41m  \x1b[0m'
    }
    for(const prop in fruits){
        canvas[fruits[prop].positionY][fruits[prop].positionX] = '\x1b[42m  \x1b[0m'
    }

    let output = '\n\n\x1b[0m  ';

    canvas.map(line => {
        line.map(field => {
            output += field
        })
        output += '\n\x1b[0m  '
    })
    
    console.clear();
    console.log(output);

    
}

renderScreen();


readline.emitKeypressEvents(process.stdin);
process.stdin.setRawMode(true);

process.stdin.on('keypress', (str, key) => {
  if (key.name === 'escape') process.exit();

  if(!gameState.myId) return

    movePlayer({
        playerId: gameState.myId,
        move: key.name
    })
});

