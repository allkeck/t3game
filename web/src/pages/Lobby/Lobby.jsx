import { useEffect, useState } from 'react';
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

  useEffect(() => {
    const eventSource = new EventSource(`${endpoints.events}/${uid}`);

    eventSource.addEventListener(eventTypes.start, (event) => {
      const data = JSON.parse(event.data);

      setLobbyStarted(true);
      setXPlayer(data.xPlayer);
      setIsMyTurn(data.xPlayer);
    });

    eventSource.addEventListener(eventTypes.turn, (event) => {
      const { row, col, xPlayer } = JSON.parse(event.data);

      setCurrentGameBoard(
        currentGameBoard.map((item) => {
          if (item.position[0] === row && item.position[1] === col) {
            item.field = xPlayer ? 'X' : 'O';
          }

          return item;
        })
      );
      setIsMyTurn(true);
    });

    return () => {
      eventSource.close();
    };
    // TODO: выяснить как обработать завистимости, возможно нужно достать из useEffect'a
  }, [uid]);

  const playerTurnClickHandler = (event, position) => {
    if (event.currentTarget.textContent !== '') return;

    const [row, col] = position;

    sendTurnData(uid, xPlayer, row, col);

    setIsMyTurn(false);
    setCurrentGameBoard(
      currentGameBoard.map((item) => {
        if (item.position[0] === row && item.position[1] === col) {
          item.field = xPlayer ? 'X' : 'O';
        }

        return item;
      })
    );
  };

  return (
    <div>
      <Link to="/">to start</Link>
      <div className={!isMyTurn && styles.locked}>
        <div>{lobbyStarted ? `you are on the ${xPlayer ? 'X' : 'O'}-side` : 'waiting for players'}</div>
        {isMyTurn && <div>make a turn</div>}
        <div className={styles.board}>
          {currentGameBoard.map(({ id, field, position }) => (
            <GameButton key={id} name={field} onClick={(event) => playerTurnClickHandler(event, position)} />
          ))}
        </div>
      </div>
    </div>
  );
};
