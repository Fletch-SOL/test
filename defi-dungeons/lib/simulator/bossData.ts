// bossData.ts - Boss stat definitions

import { Boss } from './types';

export const BOSSES: Record<string, Boss> = {
  blackmaw: {
    name: 'Blackmaw',
    combat: 400,  // 1200 / 3 heroes
    health: 400,  // 1200 / 3 heroes
    environmentalDamage: 20,
    attackPattern: ['melee', 'aoe', 'melee'],
  },
  sirMalic: {
    name: 'Sir Malic',
    combat: 600,  // 1800 / 3
    health: 600,  // 1800 / 3
    environmentalDamage: 25,
    attackPattern: ['melee', 'melee', 'aoe'],
  },
  hexarion: {
    name: 'Hexarion',
    combat: 800,  // 2400 / 3
    health: 800,  // 2400 / 3
    environmentalDamage: 30,
    attackPattern: ['aoe', 'melee', 'aoe'],
  },
};
