import './GameButton.css';

export const GameButton = ({ name, onClick }) => {
  return (
    <button onClick={onClick} type="button" className="game-button">
      {name}
    </button>
  );
};
