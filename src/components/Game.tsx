import React, { useState, useEffect } from 'react';
import { GameState, Position, Direction, GameItem, ItemType } from '../types/game';
import { GRID_SIZE, INITIAL_SPEED, ITEMS, ITEM_SPAWN_INTERVAL } from '../constants/game';
import styles from './Game.module.css';

const INITIAL_LIVES = 5;
const NORMAL_SPEED = 400;
const SLOW_SPEED = 600;

const Game: React.FC = () => {
  const [isGameStarted, setIsGameStarted] = useState(false);
  
  const initialSnake = [
    { x: 10, y: 10 },
    { x: 9, y: 10 },
    { x: 8, y: 10 }
  ];

  const [gameState, setGameState] = useState<GameState>({
    snake: initialSnake,
    direction: 'RIGHT',
    score: 0,
    speed: NORMAL_SPEED,
    isGameOver: false,
    isPaused: false,
    item: undefined,
    lives: INITIAL_LIVES
  });

  const [isSlowMode, setIsSlowMode] = useState(false);

  const startGame = () => {
    setIsGameStarted(true);
  };

  const restartGame = () => {
    setGameState({
      snake: initialSnake,
      direction: 'RIGHT',
      score: 0,
      speed: NORMAL_SPEED,
      isGameOver: false,
      isPaused: false,
      item: undefined,
      lives: INITIAL_LIVES
    });
    setIsSlowMode(false);
    setIsGameStarted(true);
  };

  const togglePause = () => {
    setGameState(prev => ({
      ...prev,
      isPaused: !prev.isPaused
    }));
  };

  const moveSnake = () => {
    setGameState(prev => {
      if (prev.isGameOver) return prev;

      const newSnake = [...prev.snake];
      const head = { ...newSnake[0] };

      switch (prev.direction) {
        case 'UP':
          head.y -= 1;
          break;
        case 'DOWN':
          head.y += 1;
          break;
        case 'LEFT':
          head.x -= 1;
          break;
        case 'RIGHT':
          head.x += 1;
          break;
      }

      if (head.x < 0 || head.x >= GRID_SIZE || head.y < 0 || head.y >= GRID_SIZE) {
        if (prev.lives > 1) {
          return {
            ...prev,
            snake: initialSnake,
            lives: prev.lives - 1,
            direction: 'RIGHT'
          };
        }
        return { ...prev, isGameOver: true };
      }

      for (let i = 0; i < newSnake.length; i++) {
        if (newSnake[i].x === head.x && newSnake[i].y === head.y) {
          if (prev.lives > 1) {
            return {
              ...prev,
              snake: initialSnake,
              lives: prev.lives - 1,
              direction: 'RIGHT'
            };
          }
          return { ...prev, isGameOver: true };
        }
      }

      newSnake.unshift(head);

      if (prev.item && head.x === prev.item.position.x && head.y === prev.item.position.y) {
        return {
          ...prev,
          snake: newSnake,
          score: prev.score + prev.item.points,
          item: undefined
        };
      }

      newSnake.pop();
      return { ...prev, snake: newSnake };
    });
  };

  const spawnItem = () => {
    setGameState(prev => {
      const availablePositions: Position[] = [];
      for (let x = 0; x < GRID_SIZE; x++) {
        for (let y = 0; y < GRID_SIZE; y++) {
          if (!prev.snake.some(segment => segment.x === x && segment.y === y)) {
            availablePositions.push({ x, y });
          }
        }
      }

      if (availablePositions.length === 0) return prev;

      const position = availablePositions[Math.floor(Math.random() * availablePositions.length)];
      const itemTypes = Object.keys(ITEMS) as ItemType[];
      const randomItem = itemTypes[Math.floor(Math.random() * itemTypes.length)];

      return {
        ...prev,
        item: {
          type: randomItem,
          position,
          points: ITEMS[randomItem].points,
          effect: ITEMS[randomItem].effect
        }
      };
    });
  };

  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      if (!isGameStarted && event.code === 'Enter') {
        startGame();
        return;
      }

      if (!isGameStarted) return;

      const directions: { [key: string]: Direction } = {
        ArrowUp: 'UP',
        ArrowDown: 'DOWN',
        ArrowLeft: 'LEFT',
        ArrowRight: 'RIGHT'
      };

      if (event.code === 'Space') {
        setIsSlowMode(prev => !prev);
        setGameState(prev => ({
          ...prev,
          speed: prev.speed === NORMAL_SPEED ? SLOW_SPEED : NORMAL_SPEED
        }));
        return;
      }

      if (event.code === 'KeyP') {
        togglePause();
        return;
      }

      const newDirection = directions[event.key];
      if (newDirection) {
        setGameState(prev => {
          const opposites = {
            UP: 'DOWN',
            DOWN: 'UP',
            LEFT: 'RIGHT',
            RIGHT: 'LEFT'
          };
          if (opposites[newDirection] === prev.direction) {
            return prev;
          }
          return { ...prev, direction: newDirection };
        });
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [isGameStarted]);

  useEffect(() => {
    if (!isGameStarted) return;

    const gameInterval = setInterval(() => {
      if (!gameState.isGameOver && !gameState.isPaused) {
        moveSnake();
      }
    }, gameState.speed);

    return () => clearInterval(gameInterval);
  }, [gameState.isGameOver, gameState.isPaused, gameState.speed, isGameStarted]);

  useEffect(() => {
    if (!isGameStarted) return;

    const itemInterval = setInterval(() => {
      if (!gameState.isGameOver && !gameState.isPaused && !gameState.item) {
        spawnItem();
      }
    }, ITEM_SPAWN_INTERVAL);

    return () => clearInterval(itemInterval);
  }, [gameState.isGameOver, gameState.isPaused, gameState.item, isGameStarted]);

  return (
    <div className={styles.gameContainer}>
      {!isGameStarted ? (
        <div className={styles.startScreen}>
          <h1>贪吃蛇游戏</h1>
          <button onClick={startGame} className={styles.startButton}>
            开始游戏
          </button>
          <div className={styles.instructions}>
            <p>游戏说明：</p>
            <p>- 使用方向键控制蛇的移动</p>
            <p>- 空格键切换减压/普通模式</p>
            <p>- P键或点击暂停按钮暂停游戏</p>
            <p>- 按回车键或点击按钮开始游戏</p>
          </div>
        </div>
      ) : (
        <>
          <div className={styles.gameBoard}>
            {gameState.snake.map((segment, index) => (
              <div
                key={index}
                className={
                  index === 0 ? styles.snakeHead : 
                  index === gameState.snake.length - 1 ? styles.snakeTail : 
                  styles.snakeBody
                }
                style={{
                  left: `${segment.x * 40}px`,
                  top: `${segment.y * 40}px`
                }}
              />
            ))}
            
            {gameState.item && (
  <div
    className={styles.item}
    style={{
      left: `${gameState.item.position.x * 40}px`,
      top: `${gameState.item.position.y * 40}px`
    }}
  />
            )}
          </div>
          
          <div className={styles.scoreBoard}>
            <div>分数: {gameState.score}</div>
            <div className={styles.lives}>生命值: {gameState.lives}</div>
            <div className={styles.mode}>
              模式: {isSlowMode ? '减压模式' : '普通模式'}
            </div>
          </div>

          <div className={styles.controls}>
            <button 
              onClick={togglePause} 
              className={styles.pauseButton}
            >
              {gameState.isPaused ? '继续游戏' : '暂停游戏'}
            </button>
          </div>

          {gameState.isGameOver && (
            <div className={styles.gameOver}>
              <h2>游戏结束</h2>
              <p>最终得分: {gameState.score}</p>
              <button onClick={restartGame} className={styles.restartButton}>
                重新开始
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Game;