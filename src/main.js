import readline from 'readline';
import { io } from 'socket.io-client';

import { addPlayer, gameState, movePlayer, setGameState } from './game.js';

const socket = io('ws://localhost:3333');

socket.on('connect', () => {
    console.log('connected', socket.id);
    gameState.myId = socket.id;
})

socket.on('setup', data => {
    setGameState(data);
}) 

socket.on('newPlayer', player => {
    addPlayer({ playerId: player.playerId, positionX: player.positionX, positionY: player.positionY });
}) 

socket.on('playerMove', data => {
    movePlayer({ playerId: data.playerId, move: data.move });
}) 

readline.emitKeypressEvents(process.stdin);
process.stdin.setRawMode(true);

process.stdin.on('keypress', (str, key) => {
  if (key.name === 'escape') process.exit();

  const playerId = gameState.myId;

  if(!playerId) return

  
  const hasMoved = movePlayer({
      playerId,
      move: key.name
    })

    if(!hasMoved) return

    socket.emit('move', {
      move: key.name
    })
});

