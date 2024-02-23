export const isBoardFinished = (row, col, player, currentGameBoard) => {
  let rowFinished = true;
  let colFinished = true;
  let mainDiagFinished = row === col;
  let secondaryDiagFinished = row + col === 2;
  for (let cell of currentGameBoard) {
    let [cellRow, cellCol] = cell.position;
    if (cellRow === row) rowFinished &&= cell.value === player;
    if (cellCol === col) colFinished &&= cell.value === player;
    if (cellRow === cellCol) mainDiagFinished &&= cell.value === player;
    if (cellRow + cellCol === 2) secondaryDiagFinished &&= cell.value === player;
  }

  return rowFinished || colFinished || mainDiagFinished || secondaryDiagFinished;
};
