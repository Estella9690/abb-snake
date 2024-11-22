import React, { useState, useEffect, useCallback } from 'react';
import { GameState, Direction, Position } from '../types/game';
import { GRID_SIZE, ITEMS } from '../constants/game';
import GameBoard from './GameBoard';
import GameControls from './GameControls';
import GameStatus from './GameStatus';

const Game: React.FC = () => {
  const [gameState, setGameState] = useState<GameState>({
    snake: [{ x: 5, y: 5 }],
    direction: 'RIGHT',
    item: {
      type: 'FOOD',
      position: { x: 10, y: 10 },
      points: 1,
      effect: null
    },
    score: 0,
    highScore: 0,
    gameOver: false,
    paused: false,
    lives: 3
  });

  const moveSnake = useCallback(() => {
    if (gameState.gameOver || gameState.paused) return;

    setGameState(prev => {
      const head = prev.snake[0];
      const newHead = { ...head };

      switch (prev.direction) {
        case 'UP':
          newHead.y = (newHead.y - 1 + GRID_SIZE) % GRID_SIZE;
          break;
        case 'DOWN':
          newHead.y = (newHead.y + 1) % GRID_SIZE;
          break;
        case 'LEFT':
          newHead.x = (newHead.x - 1 + GRID_SIZE) % GRID_SIZE;
          break;
        case 'RIGHT':
          newHead.x = (newHead.x + 1) % GRID_SIZE;
          break;
      }

      // Check for collision with self
      const selfCollision = prev.snake.some(
        segment => segment.x === newHead.x && segment.y === newHead.y
      );

      if (selfCollision) {
        if (prev.lives > 1) {
          return {
            ...prev,
            snake: [{ x: 5, y: 5 }],
            direction: 'RIGHT',
            lives: prev.lives - 1
          };
        }
        return { ...prev, gameOver: true };
      }

      const newSnake = [newHead, ...prev.snake];
      
      // Check for item collision
      if (newHead.x === prev.item.position.x && newHead.y === prev.item.position.y) {
        // Update score and generate new item
        const newScore = prev.score + prev.item.points;
        const newHighScore = Math.max(newScore, prev.highScore);
        
        // Generate new item position
        let newItemPosition: Position;
        do {
          newItemPosition = {
            x: Math.floor(Math.random() * GRID_SIZE),
            y: Math.floor(Math.random() * GRID_SIZE)
          };
        } while (
          newSnake.some(
            segment => segment.x === newItemPosition.x && segment.y === newItemPosition.y
          )
        );

        // Select random item
        const randomIndex = Math.floor(Math.random() * ITEMS.length);
        const newItem = {
          ...ITEMS[randomIndex],
          position: newItemPosition,
          effect: ITEMS[randomIndex].effect as string | null | undefined
        };

        return {
          ...prev,
          snake: newSnake,
          item: newItem,
          score: newScore,
          highScore: newHighScore
        };
      }

      // Remove tail if no item was eaten
      newSnake.pop();

      return { ...prev, snake: newSnake };
    });
  }, [gameState.gameOver, gameState.paused]);

  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      if (event.key === ' ') {
        setGameState(prev => ({ ...prev, paused: !prev.paused }));
        return;
      }

      if (gameState.gameOver || gameState.paused) return;

      const newDirection: { [key: string]: Direction } = {
        ArrowUp: 'UP',
        ArrowDown: 'DOWN',
        ArrowLeft: 'LEFT',
        ArrowRight: 'RIGHT'
      };

      if (newDirection[event.key]) {
        setGameState(prev => ({ ...prev, direction: newDirection[event.key] }));
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [gameState.gameOver, gameState.paused]);

  useEffect(() => {
    const gameLoop = setInterval(moveSnake, 150);
    return () => clearInterval(gameLoop);
  }, [moveSnake]);

  const resetGame = () => {
    setGameState({
      snake: [{ x: 5, y: 5 }],
      direction: 'RIGHT',
      item: {
        type: 'FOOD',
        position: { x: 10, y: 10 },
        points: 1,
        effect: null
      },
      score: 0,
      highScore: gameState.highScore,
      gameOver: false,
      paused: false,
      lives: 3
    });
  };

  return (
    <div className="game-container">
      <GameStatus
        score={gameState.score}
        highScore={gameState.highScore}
        lives={gameState.lives}
      />
      <GameBoard
        snake={gameState.snake}
        item={gameState.item}
        gridSize={GRID_SIZE}
      />
      <GameControls
        onReset={resetGame}
        onPause={() => setGameState(prev => ({ ...prev, paused: !prev.paused }))}
        gameOver={gameState.gameOver}
        paused={gameState.paused}
      />
    </div>
  );
};

export default Game;