import { useCallback, useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';

import { sendTurnData } from '../../api/sendTurnData';
import { endpoints, eventTypes, gameBoard } from '../../shared/constants';

import { GameButton } from '../../components/GameButton/GameButton';

import styles from './Lobby.module.css';

export const Lobby = () => {
  const [lobbyStarted, setLobbyStarted] = useState(false);
  const [xPlayer, setXPlayer] = useState(false);
  const [isMyTurn, setIsMyTurn] = useState(false);
  const [currentGameBoard, setCurrentGameBoard] = useState(gameBoard);

  const { uid } = useParams();

  const startHandler = useCallback((event) => {
    const data = JSON.parse(event.data);

    setLobbyStarted(true);
    setXPlayer(data.xPlayer);
    setIsMyTurn(data.xPlayer);
  }, []);

  const turnHandler = useCallback((event) => {
    const { row, col, xPlayer } = JSON.parse(event.data);

    setCurrentGameBoard((prevBoard) => {
      return prevBoard.map((item) => {
        if (item.position[0] === row && item.position[1] === col) {
          item.value = xPlayer ? 'X' : 'O';
        }

        return item;
      });
    });
    setIsMyTurn(true);
  }, []);

  useEffect(() => {
    const eventSource = new EventSource(`${endpoints.events}/${uid}`);

    eventSource.addEventListener(eventTypes.start, startHandler);
    eventSource.addEventListener(eventTypes.turn, turnHandler);

    return () => {
      eventSource.removeEventListener(eventTypes.start, startHandler);
      eventSource.removeEventListener(eventTypes.turn, turnHandler);
      eventSource.close();
    };
  }, [uid, startHandler, turnHandler]);

  const playerTurnClickHandler = (event, position) => {
    if (event.currentTarget.textContent !== '') return;

    const [row, col] = position;

    sendTurnData(uid, xPlayer, row, col);

    setIsMyTurn(false);
    setCurrentGameBoard(
      currentGameBoard.map((item) => {
        if (item.position[0] === row && item.position[1] === col) {
          item.value = xPlayer ? 'X' : 'O';
        }

        return item;
      })
    );
  };

  const isBoardFinished = (row, col, player) => {}

  const isBoardFinishedV2 = (row, col, player) => {
    let rowFinished = true;
    let colFinished = true;
    let mainDiagFinished = row === col;
    let secondaryDiagFinished = (row + col) === 2;
    for (let cell of currentGameBoard) {
      let [cellRow, cellCol] = cell.position;
      if (cellRow === row) rowFinished &= cell.value === player;
      if (cellCol === col) colFinished &= cell.value === player;
      if (cellRow === cellCol) mainDiagFinished &= cell.value === player;
      if ((cellRow+cellCol) === 2) secondaryDiagFinished &= cell.value === player;
    }
    return rowFinished || colFinished || mainDiagFinished || secondaryDiagFinished;
  };

  console.log(currentGameBoard);

  return (
    <div>
      <Link to="/">to start</Link>
      <div className={!isMyTurn && styles.locked}>
        <div>{lobbyStarted ? `you are on the ${xPlayer ? 'X' : 'O'}-side` : 'waiting for players'}</div>
        {isMyTurn && <div>make a turn</div>}
        <div className={styles.board}>
          {currentGameBoard.map(({ id, value, position }) => (
            <GameButton key={id} name={value} onClick={(event) => playerTurnClickHandler(event, position)} />
          ))}
        </div>
      </div>
    </div>
  );
};
