import { expect, test } from 'vitest';
import { createIsBoardFinished } from './isBoardFinished';
import { gameBoard } from '../shared/constants';

test('first turn', () => {
  const board = JSON.parse(JSON.stringify(gameBoard));
  board[0].value = 'X';
  const checkBoard = createIsBoardFinished(board);

  expect(checkBoard(0, 0, 'X')).toBe(false);
});

test('won by row', () => {
  const board = JSON.parse(JSON.stringify(gameBoard));
  board[0].value = 'X';
  board[1].value = 'X';
  board[2].value = 'X';
  const checkBoard = createIsBoardFinished(board);

  expect(checkBoard(0, 2, 'X')).toBe(true);
});

test('won by col', () => {
  const board = JSON.parse(JSON.stringify(gameBoard));
  board[0].value = 'X';
  board[3].value = 'X';
  board[6].value = 'X';
  const checkBoard = createIsBoardFinished(board);

  expect(checkBoard(2, 0, 'X')).toBe(true);
});

test('won by diag', () => {
  const board = JSON.parse(JSON.stringify(gameBoard));
  board[0].value = 'X';
  board[4].value = 'X';
  board[8].value = 'X';
  const checkBoard = createIsBoardFinished(board);

  expect(checkBoard(2, 2, 'X')).toBe(true);
});
