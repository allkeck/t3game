import styles from './GameButton.module.css';

export const GameButton = ({ name, playerTurn, isWonCell }) => {
  return (
    <button onClick={playerTurn} type="button" className={`${styles['game-button']} ${isWonCell && styles['won-cell']}`}>
      {name}
    </button>
  );
};
