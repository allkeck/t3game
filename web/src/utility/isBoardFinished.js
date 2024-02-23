export const isBoardFinished = (row, col, player, currentGameBoard) => {
  const rowFinished = [];
  const colFinished = [];
  const mainDiagFinished = [];
  const secondaryDiagFinished = [];

  for (let i = 0; i < currentGameBoard.length; i++) {
    const cell = currentGameBoard[i];
    const [cellRow, cellCol] = cell.position;

    if (cellRow === row && cell.value === player) rowFinished.push(i);
    if (cellCol === col && cell.value === player) colFinished.push(i);
    if (row === col && cellRow === cellCol && cell.value === player) mainDiagFinished.push(i);
    if (row + col === 2 && cellRow + cellCol === 2 && cell.value === player) secondaryDiagFinished.push(i);
  }

  return (
    (rowFinished.length === 3 && rowFinished) ||
    (colFinished.length === 3 && colFinished) ||
    (mainDiagFinished.length === 3 && mainDiagFinished) ||
    (secondaryDiagFinished.length === 3 && secondaryDiagFinished) ||
    []
  );
};
