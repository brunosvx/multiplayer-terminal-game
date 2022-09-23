import { config } from "./config.js";

export const gameState = {
    myId: null,
    players:{},
    fruits: {}
}


export function setGameState({ fruits, players }){
    gameState.players = players;
    gameState.fruits = fruits;

    renderScreen();
}


export function movePlayer({ playerId, move }) {
    const acceptedMoves = {
        down() {
            if(gameState.players[playerId].positionY + 1 === config.screenHeight) return false
            gameState.players[playerId].positionY++
        },
        up() {
            if(gameState.players[playerId].positionY === 0) return false
            gameState.players[playerId].positionY--
        },
        left() {
            if(gameState.players[playerId].positionX === 0) return false
            gameState.players[playerId].positionX--
        },
        right() {
            if(gameState.players[playerId].positionX + 1 === config.screenWidth) return false
            gameState.players[playerId].positionX++
        },
    }

    const moveFunction = acceptedMoves[move];

    if(!moveFunction) return false;

    moveFunction();
    checkPlayerCollision({ playerId })
    renderScreen();
    return true;
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


export function addPlayer({ playerId, positionX, positionY }) {
    gameState.players[playerId] = {
        positionX,
        positionY,
        points: 0
    }
    
    renderScreen();
}

export function addFruit({ fruitId, positionX, positionY }) {
    gameState.fruits[fruitId] = {
        positionX,
        positionY
    }

    renderScreen();
}


export function removePlayer({ playerId }) {
    delete gameState.players[playerId];
    
    renderScreen();
}

export function removeFruit({ fruitId }) {
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


export function setPlayerPoints({ playerId, points }) {
    gameState.players[playerId].points = points;
}