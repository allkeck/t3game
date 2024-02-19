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
  { id: 1, field: 'e', position: [0, 0] },
  { id: 2, field: 'e', position: [1, 0] },
  { id: 3, field: 'e', position: [2, 0] },
  { id: 4, field: 'e', position: [0, 1] },
  { id: 5, field: 'e', position: [1, 1] },
  { id: 6, field: 'e', position: [2, 1] },
  { id: 7, field: 'e', position: [0, 2] },
  { id: 8, field: 'e', position: [1, 2] },
  { id: 9, field: 'e', position: [2, 2] },
];
