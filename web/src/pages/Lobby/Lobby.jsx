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
      console.log(event);
    });

    return () => {
      eventSource.close();
    };
  }, [uid]);

  const playerTurnClickHandler = (position) => {
    sendTurnData(uid, xPlayer, position[0], position[1]);

    setIsMyTurn(false);
  };

  return (
    <div className={classNames}>
      {!lobbyStarted && <div>waiting for players</div>}
      {isMyTurn && <div>make a turn</div>}
      <div className="board">
        {gameBoard.map(({ id, field, position }) => (
          <GameButton key={id} name={field} onClick={() => playerTurnClickHandler(position)} />
        ))}
      </div>
    </div>
  );
};
