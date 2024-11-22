import React from 'react';
import { Position } from '../types/game';

interface GameBoardProps {
  snake: Position[];
  item: {
    type: string;
    position: Position;
  };
  gridSize: number;
}

const GameBoard: React.FC<GameBoardProps> = ({ snake, item, gridSize }) => {
  return (
    <div className="game-board" style={{ 
      display: 'grid',
      gridTemplateColumns: `repeat(${gridSize}, 20px)`,
      gap: '1px',
      backgroundColor: '#ccc',
      padding: '10px'
    }}>
      {Array.from({ length: gridSize * gridSize }).map((_, index) => {
        const x = index % gridSize;
        const y = Math.floor(index / gridSize);
        const isSnake = snake.some(segment => segment.x === x && segment.y === y);
        const isItem = item.position.x === x && item.position.y === y;

        return (
          <div
            key={index}
            style={{
              width: '20px',
              height: '20px',
              backgroundColor: isSnake ? '#4CAF50' : isItem ? '#FFC107' : '#fff'
            }}
          />
        );
      })}
    </div>
  );
};

export default GameBoard;