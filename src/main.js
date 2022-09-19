import readline from 'readline';

import { config } from "./config.js";

const gameState = {
    players:{
        'id1':{
                positionX: 1,
                positionY: 3
            }
        },
    fruits: {
        'id3':{
            positionX: 4,
            positionY: 8
            }
        }
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
        canvas[fruits[prop].positionY][fruits[prop].positionX] = '\x1b[41m  \x1b[0m'
    }

    let output = '\n\n';

    canvas.map(line => {
        line.map(field => {
            output += field
        })
        output += '\n'
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