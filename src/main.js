import readline from 'readline';

import { config } from "./config.js";

const gameState = {
    players:{},
    fruits: {}
}




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
    renderScreen();
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

    movePlayer({
        playerId: 'id1',
        move: key.name
    })
});


addPlayer({ playerId: 'id1', positionX: 2, positionY: 6 });
addFruit({ fruitId: 'id3', positionX: 6, positionY: 1 });
