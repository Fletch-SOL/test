// statCalculator.ts - Calculate hero's final stats with all bonuses

import { Hero, HeroClass } from './types';

const CLASS_BONUSES = {
  Warrior: { combat: 15, vitality: 0, damage: 0, fortune: 0, luck: 0 },
  Mage: { combat: 0, vitality: 0, damage: 5, fortune: 0, luck: 0 },
  Marksman: { combat: 0, vitality: 0, damage: 0, fortune: 10, luck: 10 },
  Priest: { combat: 0, vitality: 15, damage: 0, fortune: 0, luck: 0 },
};

const POSITION_BONUSES = {
  1: { vitality: 15, combat: 0, fortune: 0, luck: 0 },
  2: { vitality: 0, combat: 15, fortune: 0, luck: 0 },
  3: { vitality: 0, combat: 0, fortune: 10, luck: 10 },
};

export function calculateFinalStats(hero: Hero) {
  const classBonus = CLASS_BONUSES[hero.class];
  const positionBonus = POSITION_BONUSES[hero.position];

  // Start with base stats
  let combat = hero.baseStats.combat;
  let vitality = hero.baseStats.vitality;
  let fortune = hero.baseStats.fortune;
  let luck = hero.baseStats.luck;
  let damage = 0;

  // Add equipment bonuses
  combat += hero.equipmentBonuses.combat;
  vitality += hero.equipmentBonuses.vitality;
  fortune += hero.equipmentBonuses.fortune;
  luck += hero.equipmentBonuses.luck;
  damage += hero.equipmentBonuses.damage;

  // Add class bonuses
  combat += classBonus.combat;
  vitality += classBonus.vitality;
  damage += classBonus.damage;
  fortune += classBonus.fortune;
  luck += classBonus.luck;

  // Apply Class Synergy talent (doubles class bonus)
  if (hero.combatTalents.classSynergy) {
    combat += classBonus.combat;
    vitality += classBonus.vitality;
    damage += classBonus.damage;
    fortune += classBonus.fortune;
    luck += classBonus.luck;
  }

  // Add position bonuses
  combat += positionBonus.combat;
  vitality += positionBonus.vitality;
  fortune += positionBonus.fortune;
  luck += positionBonus.luck;

  // Add tier 1 talent bonuses
  if (hero.combatTalents.battleTempered) combat += 5;
  if (hero.vitalityTalents.bulwarkVitality) vitality += 5;

  // Add unique item bonuses
  if (hero.uniqueItem === 'Four-Leaf Clover') {
    fortune += 10;
    luck += 10;
  }

  return {
    combat,
    vitality,
    fortune,
    luck,
    damage,
    maxHealth: vitality, // Health = Vitality
  };
}
