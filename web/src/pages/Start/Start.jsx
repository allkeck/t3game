import { useState } from 'react';
import { createGame } from '../../api/createGame';
import { Link } from 'react-router-dom';

import './Start.css';

export const Start = () => {
  const [game, setGame] = useState(null);

  const newGame = async () => {
    setGame(await createGame());
  };

  return (
    <>
      <h1>Krestiki vs Noliki</h1>
      {game === null ? (
        <button type="button" onClick={newGame}>
          new game
        </button>
      ) : (
        <Link to={`/game/${game.data.Uid}`}>go to lobby</Link>
      )}
    </>
  );
};
