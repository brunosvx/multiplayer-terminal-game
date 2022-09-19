import { config } from "./config.js";

const gameState = {
    players:[
        {
            playerId: 'id1',
            positionX: 1,
            positionY: 3
        }
    ],
    fruits: [
        {
            fruitId: 'id3',
            positionX: 4,
            positionY: 8
        }
    ]
}

function renderScreen() {
    const canvas = Array.from({
        length: config.screenHeight 
      }, () => Array(config.screenWidth).fill('\x1b[47m  \x1b[0m'));


    gameState.players.map(player => {
        canvas[player.positionY][player.positionX] = '\x1b[41m  \x1b[0m'
    })
    gameState.fruits.map(fruit => {
        canvas[fruit.positionY][fruit.positionX] = '\x1b[42m  \x1b[0m'
    })

    let output = '';

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