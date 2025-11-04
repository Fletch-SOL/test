// types.ts - Core type definitions

export type HeroClass = 'Warrior' | 'Mage' | 'Marksman' | 'Priest';
export type BossName = 'Blackmaw' | 'Sir Malic' | 'Hexarion';
export type UniqueItem = 'Golden Heart' | 'Horse Mount' | 'Four-Leaf Clover' | 'Harp' | 'Warhorn' | null;

export interface TalentAllocation {
  combat: number;      // 0-5
  vitality: number;    // 0-5
  fortune: number;     // 0-5
  luck: number;        // 0-5
}

export interface CombatTalents {
  battleTempered: boolean;      // Tier 1: +5 Combat
  mythicForce: boolean;         // Tier 2: +25 Combat (Dungeons only)
  classSynergy: boolean;        // Tier 3: Double class bonus
  openersEdge: boolean;         // Tier 4: First attack +15% damage
  relentlessForce: boolean;     // Tier 5: All attacks +20 damage
}

export interface VitalityTalents {
  bulwarkVitality: boolean;     // Tier 1: +5 Vitality
  secondWind: boolean;          // Tier 2: Restore 10 HP after each boss
  environmentalArmour: boolean; // Tier 3: -5 environmental damage
  fortifiedStance: boolean;     // Tier 4: -5 from all boss attacks
  sacredEvasion: boolean;       // Tier 5: First boss attack 50% reduced
}

export interface BaseStats {
  combat: number;      // 1-150
  vitality: number;    // 1-150
  fortune: number;     // 1-150
  luck: number;        // 1-150
}

export interface Hero {
  id: string;
  name: string;
  class: HeroClass;
  baseStats: BaseStats;
  equipmentBonuses: {
    combat: number;
    vitality: number;
    fortune: number;
    luck: number;
    damage: number;
  };
  talents: TalentAllocation;
  combatTalents: CombatTalents;
  vitalityTalents: VitalityTalents;
  uniqueItem: UniqueItem;
  position: 1 | 2 | 3;  // Slot in raid party
}

export interface Boss {
  name: BossName;
  combat: number;
  health: number;
  environmentalDamage: number;
  attackPattern: ('melee' | 'aoe')[];
}

export interface RaidSetup {
  boss: Boss;
  heroes: [Hero, Hero, Hero];
}

export interface CombatState {
  heroHealths: [number, number, number];
  bossHealth: number;
  round: number;
  firstAttackUsed: [boolean, boolean, boolean];
}

export interface SimulationResult {
  victory: boolean;
  roundsToVictory: number;
  heroDeaths: [boolean, boolean, boolean];
  damageDealt: number;
  damageTaken: [number, number, number];
}

export interface AggregatedResults {
  winRate: number;
  averageRounds: number;
  deathRates: [number, number, number];
  averageDamageDealt: number;
  averageDamageTaken: [number, number, number];
}
