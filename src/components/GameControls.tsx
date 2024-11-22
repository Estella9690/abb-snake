import React from 'react';

interface GameControlsProps {
  onReset: () => void;
  onPause: () => void;
  gameOver: boolean;
  paused: boolean;
}

const GameControls: React.FC<GameControlsProps> = ({ onReset, onPause, gameOver, paused }) => {
  return (
    <div className="game-controls" style={{ marginTop: '20px' }}>
      <button onClick={onReset} style={{ marginRight: '10px' }}>
        {gameOver ? 'New Game' : 'Reset'}
      </button>
      <button onClick={onPause} disabled={gameOver}>
        {paused ? 'Resume' : 'Pause'}
      </button>
    </div>
  );
};

export default GameControls;