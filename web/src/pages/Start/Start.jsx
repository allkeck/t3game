import { useState } from 'react';
import { createGame } from '../../api/createGame';
import { Link } from 'react-router-dom';

import styles from './Start.module.css';

export const Start = () => {
  const [game, setGame] = useState(null);

  const newGame = async () => {
    const gameData = await createGame();

    setGame(gameData);
  };

  return (
    <>
      <h1>Krestiki vs Noliki</h1>
      {game === null ? (
        <button type="button" onClick={newGame}>
          new game
        </button>
      ) : (
        <Link to={`/game/${game.data.Uid}`} className={styles.link}>
          go to lobby
        </Link>
      )}
    </>
  );
};
