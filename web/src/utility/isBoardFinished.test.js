import { expect, test } from 'vitest';
import { isBoardFinished } from './isBoardFinished';
import { getGameBoard } from '../shared/constants';

test('first turn', () => {
  const board = getGameBoard();
  board[0].value = 'X';

  expect(isBoardFinished(0, 0, 'X', board)).toStrictEqual([]);
});

test('won by row', () => {
  const board = getGameBoard();
  board[0].value = 'X';
  board[1].value = 'X';
  board[2].value = 'X';

  expect(isBoardFinished(0, 2, 'X', board)).toStrictEqual([0, 1, 2]);
});

test('won by col', () => {
  const board = getGameBoard();
  board[0].value = 'X';
  board[3].value = 'X';
  board[6].value = 'X';

  expect(isBoardFinished(2, 0, 'X', board)).toStrictEqual([0, 3, 6]);
});

test('won by diag', () => {
  const board = getGameBoard();
  board[0].value = 'X';
  board[4].value = 'X';
  board[8].value = 'X';

  expect(isBoardFinished(2, 2, 'X', board)).toStrictEqual([0, 4, 8]);
});
