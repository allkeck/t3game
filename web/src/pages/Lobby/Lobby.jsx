import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

import { sendTurnData } from '../../api/sendTurnData';
import { endpoints, eventTypes, gameBoard } from '../../shared/constants';

import { GameButton } from '../../components/GameButton/GameButton';

import './Lobby.css';

export const Lobby = () => {
  const [lobbyStarted, setLobbyStarted] = useState(false);
  const [xPlayer, setXPlayer] = useState(false);
  const [isMyTurn, setIsMyTurn] = useState(false);
  const [currentGameBoard, setCurrentGameBoard] = useState(gameBoard);

  const { uid } = useParams();

  // TODO: clsx
  let classNames = 'lobby-wrapper';

  if (!isMyTurn) {
    classNames += ' locked';
  }

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
  }, [uid]);

  const playerTurnClickHandler = (position) => {
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
    <div className={classNames}>
      <div>{lobbyStarted ? `you are on the ${xPlayer ? 'X' : 'O'}-side` : 'waiting for players'}</div>
      {isMyTurn && <div>make a turn</div>}
      <div className="board">
        {currentGameBoard.map(({ id, field, position }) => (
          <GameButton key={id} name={field} onClick={() => playerTurnClickHandler(position)} />
        ))}
      </div>
    </div>
  );
};
