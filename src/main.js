import readline from 'readline';
import { io } from 'socket.io-client';

import { addPlayer, gameState, movePlayer } from './game.js';

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

