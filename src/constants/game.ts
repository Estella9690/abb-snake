import { ItemType } from '../types/game';

export const GRID_SIZE = 20;
export const INITIAL_SPEED = 150;
export const ITEM_SPAWN_INTERVAL = 10000;

export const ITEMS = [
  {
    type: 'FOOD' as ItemType,
    points: 1,
    effect: null
  },
  {
    type: 'BONUS' as ItemType,
    points: 3,
    effect: 'SPEED'
  },
  {
    type: 'POWER' as ItemType,
    points: 5,
    effect: 'INVINCIBLE'
  },
  {
    type: 'EXTRA_LIFE' as ItemType,
    points: 2,
    effect: 'EXTEND'
  }
];