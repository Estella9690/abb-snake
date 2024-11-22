export interface Position {
  x: number;
  y: number;
}

export type Direction = 'UP' | 'DOWN' | 'LEFT' | 'RIGHT';

export type ItemType = 'FOOD' | 'BONUS' | 'POWER' | 'EXTRA_LIFE';

export interface GameState {
  snake: Position[];
  direction: Direction;
  item: {
    type: ItemType;
    position: Position;
    points: number;
    effect: string | null | undefined;
  };
  score: number;
  highScore: number;
  gameOver: boolean;
  paused: boolean;
  lives: number;
}