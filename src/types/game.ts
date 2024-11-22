export type Position = {
  x: number;
  y: number;
};

export type Direction = 'UP' | 'DOWN' | 'LEFT' | 'RIGHT';

export type ItemType = 
  | 'COFFEE'
  | 'LAPTOP'
  | 'PENCIL'
  | 'FOLDER'
  | 'CUP';

export type GameItem = {
  type: ItemType;
  position: Position;
  points: number;
  effect?: string;
};

export type GameState = {
  snake: Position[];
  direction: Direction;
  item?: GameItem;
  score: number;
  speed: number;
  isGameOver: boolean;
  isPaused: boolean;
  lives: number;
};