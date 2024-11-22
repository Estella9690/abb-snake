export const GRID_SIZE = 20;
export const INITIAL_SPEED = 3;
export const MAX_SPEED = 6;
export const SPEED_INCREMENT = 0.1;

export const ITEMS = {
  COFFEE: { points: 5, effect: 'INVINCIBLE' },
  LAPTOP: { points: 3, effect: 'EXTEND' },
  PENCIL: { points: 1, effect: null },
  FOLDER: { points: 2, effect: 'SHIELD' },
  CUP: { points: 2, effect: 'SPEED' }
} as const;

export const ITEM_SPAWN_INTERVAL = 3000;