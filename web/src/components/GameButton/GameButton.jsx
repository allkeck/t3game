import styles from './GameButton.module.css';

export const GameButton = ({ name, onClick }) => {
  return (
    <button onClick={onClick} type="button" className={styles['game-button']}>
      {name}
    </button>
  );
};
