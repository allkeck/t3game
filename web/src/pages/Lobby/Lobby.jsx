import { useCallback, useEffect, useRef, useState } from 'react';
import { Link, useParams } from 'react-router-dom';

import { sendTurnData } from '../../api/sendTurnData';
import { endpoints, eventTypes, gameBoard } from '../../shared/constants';

import { GameButton } from '../../components/GameButton/GameButton';

import styles from './Lobby.module.css';
import { isBoardFinished } from '../../utility/isBoardFinished';

export const Lobby = () => {
  const [lobbyStarted, setLobbyStarted] = useState(false);
  const [xPlayer, setXPlayer] = useState(false);
  const [isMyTurn, setIsMyTurn] = useState(false);
  const [currentGameBoard, setCurrentGameBoard] = useState(gameBoard);
  const [playerWon, setPlayerWon] = useState(null);
  const [lastTurn, setLastTurn] = useState(null);

  const eventSourceRef = useRef(null);

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
    setLastTurn({ row, col, xPlayer });
  }, []);

  useEffect(() => {
    if (lastTurn !== null) {
      const { row, col, xPlayer } = lastTurn;
      if (isBoardFinished(row, col, xPlayer ? 'X' : 'O', currentGameBoard)) {
        setPlayerWon(xPlayer ? 'X' : 'O');
        setIsMyTurn(false);
      }
    }
  }, [currentGameBoard, lastTurn]);

  useEffect(() => {
    eventSourceRef.current = new EventSource(`${endpoints.events}/${uid}`);

    return () => {
      eventSourceRef.current.close();
    };
  }, [uid]);

  useEffect(() => {
    const eventSource = eventSourceRef.current;

    eventSource.addEventListener(eventTypes.start, startHandler);
    eventSource.addEventListener(eventTypes.turn, turnHandler);

    return () => {
      eventSource.removeEventListener(eventTypes.start, startHandler);
      eventSource.removeEventListener(eventTypes.turn, turnHandler);
    };
  }, [startHandler, turnHandler]);

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
    setLastTurn({ row, col, xPlayer });
  };

  return (
    <div>
      <Link to="/">to start</Link>
      <div className={(!isMyTurn || playerWon) && styles.locked}>
        <div>{lobbyStarted ? `you are on the ${xPlayer ? 'X' : 'O'}-side` : 'waiting for players'}</div>
        {isMyTurn && <div>make a turn</div>}
        {playerWon && <div>{playerWon === (xPlayer ? 'X' : 'O') ? 'you won!' : 'you lose'}</div>}
        <div className={styles.board}>
          {currentGameBoard.map(({ id, value, position }) => (
            <GameButton key={id} name={value} onClick={(event) => playerTurnClickHandler(event, position)} />
          ))}
        </div>
      </div>
    </div>
  );
};
