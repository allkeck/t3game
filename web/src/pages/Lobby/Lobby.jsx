import { useEffect } from 'react';
import { useParams } from 'react-router-dom';

import { stratGameBoard } from '../../shared/constants';
import { settings } from '../../shared/constants';

import { GameButton } from '../../components/GameButton/GameButton';

import './Lobby.css';

export const Lobby = () => {
  const { uid } = useParams();

  useEffect(() => {
    const eventSource = new EventSource(`${settings.events}/${uid}`);

    eventSource.addEventListener('message', (event) => {
      console.log(event);
    });

    return () => {
      eventSource.close();
    };
  }, [uid]);

  return (
    <div className="lobby-wrapper">
      {stratGameBoard.map(({ id, field }) => (
        <GameButton key={id} name={field} />
      ))}
    </div>
  );
};
