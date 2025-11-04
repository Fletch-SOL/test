// testHeroGenerator.ts - Generate sample heroes for testing

import { Hero, HeroClass, UniqueItem } from './simulator/types';
import { saveHero, generateHeroId } from './heroStorage';

const TEST_HEROES_DATA: Array<Omit<Hero, 'id'>> = [
  {
    name: 'Thorin Ironshield',
    class: 'Warrior',
    position: 1,
    baseStats: { combat: 95, vitality: 110, fortune: 45, luck: 50 },
    equipmentBonuses: { combat: 15, vitality: 25, fortune: 5, luck: 5, damage: 8 },
    talents: { combat: 3, vitality: 5, fortune: 0, luck: 0 },
    combatTalents: {
      battleTempered: true,
      mythicForce: true,
      classSynergy: true,
      openersEdge: false,
      relentlessForce: false,
    },
    vitalityTalents: {
      bulwarkVitality: true,
      secondWind: true,
      environmentalArmour: true,
      fortifiedStance: true,
      sacredEvasion: true,
    },
    uniqueItem: 'Golden Heart',
  },
  {
    name: 'Lyra Flameheart',
    class: 'Mage',
    position: 2,
    baseStats: { combat: 105, vitality: 75, fortune: 60, luck: 60 },
    equipmentBonuses: { combat: 20, vitality: 10, fortune: 10, luck: 10, damage: 12 },
    talents: { combat: 5, vitality: 3, fortune: 0, luck: 0 },
    combatTalents: {
      battleTempered: true,
      mythicForce: true,
      classSynergy: true,
      openersEdge: true,
      relentlessForce: true,
    },
    vitalityTalents: {
      bulwarkVitality: true,
      secondWind: true,
      environmentalArmour: true,
      fortifiedStance: false,
      sacredEvasion: false,
    },
    uniqueItem: 'Warhorn',
  },
  {
    name: 'Silvanus Swiftarrow',
    class: 'Marksman',
    position: 3,
    baseStats: { combat: 90, vitality: 80, fortune: 80, luck: 80 },
    equipmentBonuses: { combat: 18, vitality: 12, fortune: 15, luck: 15, damage: 10 },
    talents: { combat: 4, vitality: 2, fortune: 1, luck: 1 },
    combatTalents: {
      battleTempered: true,
      mythicForce: true,
      classSynergy: true,
      openersEdge: true,
      relentlessForce: false,
    },
    vitalityTalents: {
      bulwarkVitality: true,
      secondWind: true,
      environmentalArmour: false,
      fortifiedStance: false,
      sacredEvasion: false,
    },
    uniqueItem: 'Four-Leaf Clover',
  },
  {
    name: 'Brother Aldric',
    class: 'Priest',
    position: 1,
    baseStats: { combat: 70, vitality: 120, fortune: 55, luck: 55 },
    equipmentBonuses: { combat: 10, vitality: 30, fortune: 8, luck: 8, damage: 5 },
    talents: { combat: 2, vitality: 5, fortune: 0, luck: 1 },
    combatTalents: {
      battleTempered: true,
      mythicForce: true,
      classSynergy: false,
      openersEdge: false,
      relentlessForce: false,
    },
    vitalityTalents: {
      bulwarkVitality: true,
      secondWind: true,
      environmentalArmour: true,
      fortifiedStance: true,
      sacredEvasion: true,
    },
    uniqueItem: 'Harp',
  },
  {
    name: 'Grimnar the Berserker',
    class: 'Warrior',
    position: 2,
    baseStats: { combat: 115, vitality: 95, fortune: 40, luck: 40 },
    equipmentBonuses: { combat: 25, vitality: 15, fortune: 5, luck: 5, damage: 15 },
    talents: { combat: 5, vitality: 3, fortune: 0, luck: 0 },
    combatTalents: {
      battleTempered: true,
      mythicForce: true,
      classSynergy: true,
      openersEdge: true,
      relentlessForce: true,
    },
    vitalityTalents: {
      bulwarkVitality: true,
      secondWind: true,
      environmentalArmour: true,
      fortifiedStance: false,
      sacredEvasion: false,
    },
    uniqueItem: 'Horse Mount',
  },
];

export function generateTestHeroes(): Hero[] {
  const heroes: Hero[] = TEST_HEROES_DATA.map((data) => ({
    ...data,
    id: generateHeroId(),
  }));

  // Save all heroes to localStorage
  heroes.forEach((hero) => saveHero(hero));

  return heroes;
}

export function hasTestHeroes(): boolean {
  if (typeof window === 'undefined') return false;
  const stored = localStorage.getItem('defi_dungeons_test_heroes_created');
  return stored === 'true';
}

export function markTestHeroesCreated(): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem('defi_dungeons_test_heroes_created', 'true');
}
