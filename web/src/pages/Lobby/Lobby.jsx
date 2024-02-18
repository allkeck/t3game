import { useEffect } from 'react';
import { useParams } from 'react-router-dom';

import { stratGameBoard } from '../../shared/constants';
import { lobbyConnect } from '../../api/lobbyConnect';

import { GameButton } from '../../components/GameButton/GameButton';

import './style.css';

export const Lobby = () => {
  const { uid } = useParams();

  useEffect(() => {
    const eS = lobbyConnect(uid);

    return () => eS.close();
  }, [uid]);

  return (
    <div className="lobby-wrapper">
      {stratGameBoard.map(({ id, field }) => (
        <GameButton key={id} name={field} />
      ))}
    </div>
  );
};
