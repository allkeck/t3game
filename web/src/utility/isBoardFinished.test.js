import { expect, test } from 'vitest';
import { isBoardFinished } from './isBoardFinished';
import { gameBoard } from '../shared/constants';

test('first turn', () => {
  const board = JSON.parse(JSON.stringify(gameBoard));
  board[0].value = 'X';

  expect(isBoardFinished(0, 0, 'X', board)).toBe(false);
});

test('won by row', () => {
  const board = JSON.parse(JSON.stringify(gameBoard));
  board[0].value = 'X';
  board[1].value = 'X';
  board[2].value = 'X';

  expect(isBoardFinished(0, 2, 'X', board)).toBe(true);
});

test('won by col', () => {
  const board = JSON.parse(JSON.stringify(gameBoard));
  board[0].value = 'X';
  board[3].value = 'X';
  board[6].value = 'X';

  expect(isBoardFinished(2, 0, 'X', board)).toBe(true);
});

test('won by diag', () => {
  const board = JSON.parse(JSON.stringify(gameBoard));
  board[0].value = 'X';
  board[4].value = 'X';
  board[8].value = 'X';

  expect(isBoardFinished(2, 2, 'X', board)).toBe(true);
});
