import React from 'react';

interface GameStatusProps {
  score: number;
  highScore: number;
  lives: number;
}

const GameStatus: React.FC<GameStatusProps> = ({ score, highScore, lives }) => {
  return (
    <div className="game-status" style={{ marginBottom: '20px' }}>
      <div>Score: {score}</div>
      <div>High Score: {highScore}</div>
      <div>Lives: {lives}</div>
    </div>
  );
};

export default GameStatus;