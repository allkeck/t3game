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
  { id: 1, field: ' ', position: [0, 0] },
  { id: 2, field: ' ', position: [0, 1] },
  { id: 3, field: ' ', position: [0, 2] },
  { id: 4, field: ' ', position: [1, 0] },
  { id: 5, field: ' ', position: [1, 1] },
  { id: 6, field: ' ', position: [1, 2] },
  { id: 7, field: ' ', position: [2, 0] },
  { id: 8, field: ' ', position: [2, 1] },
  { id: 9, field: ' ', position: [2, 2] },
];
