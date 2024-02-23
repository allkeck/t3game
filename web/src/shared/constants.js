export const endpoints = {
  newGame: '/new-game',
  events: '/events',
  turn: '/turn',
};

export const eventTypes = {
  start: 'start',
  turn: 'turn',
};

export const gameBoard = [
  { id: 1, value: '', position: [0, 0] },
  { id: 2, value: '', position: [0, 1] },
  { id: 3, value: '', position: [0, 2] },
  { id: 4, value: '', position: [1, 0] },
  { id: 5, value: '', position: [1, 1] },
  { id: 6, value: '', position: [1, 2] },
  { id: 7, value: '', position: [2, 0] },
  { id: 8, value: '', position: [2, 1] },
  { id: 9, value: '', position: [2, 2] },
];
