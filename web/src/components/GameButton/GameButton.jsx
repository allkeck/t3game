import './GameButton.css';

export const GameButton = ({ name }) => {
  return (
    <button type="button" className="game-button">
      {name}
    </button>
  );
};
