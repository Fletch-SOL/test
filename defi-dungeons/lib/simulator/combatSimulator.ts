// combatSimulator.ts - Single combat simulation

import { RaidSetup, CombatState, SimulationResult, Hero, Boss } from './types';
import { calculateFinalStats } from './statCalculator';

function randomBetween(min: number, max: number): number {
  return Math.random() * (max - min) + min;
}

function calculateInitiative(combat: number): number {
  const rng = randomBetween(0.8, 1.2);
  return combat * rng;
}

function calculateHitChance(attackerCombat: number, defenderHealth: number): boolean {
  const rng = randomBetween(0.8, 1.2);
  return (attackerCombat * rng) >= (defenderHealth / 3);
}

function calculateDamage(
  hero: Hero,
  finalStats: ReturnType<typeof calculateFinalStats>,
  isGlancingBlow: boolean,
  isFirstAttack: boolean,
  round: number
): number {
  let baseDamage = finalStats.combat / 4;

  // Add base damage from equipment/stats
  baseDamage += finalStats.damage;

  // Apply Relentless Force talent (+20 damage per attack in raids)
  if (hero.combatTalents.relentlessForce) {
    baseDamage += 20;
  }

  // Apply Opener's Edge talent (+15% on first attack per boss)
  if (hero.combatTalents.openersEdge && isFirstAttack) {
    baseDamage *= 1.15;
  }

  // Glancing blow deals 1/4 damage
  if (isGlancingBlow) {
    baseDamage /= 4;
  }

  return Math.floor(baseDamage);
}

function calculateBossDamage(
  boss: Boss,
  attackType: 'melee' | 'aoe',
  hero: Hero,
  isGlancingBlow: boolean
): number {
  let baseDamage: number;

  if (attackType === 'melee') {
    baseDamage = (boss.combat / 3) / 4;
  } else {
    // AOE damage
    baseDamage = (boss.combat / 3) / 8;
  }

  // Apply Fortified Stance (-5 from all boss attacks)
  if (hero.vitalityTalents.fortifiedStance) {
    baseDamage = Math.max(0, baseDamage - 5);
  }

  // Glancing blow deals 1/4 damage
  if (isGlancingBlow) {
    baseDamage /= 4;
  }

  return Math.floor(baseDamage);
}

function calculateEnvironmentalDamage(boss: Boss, hero: Hero): number {
  let damage = boss.environmentalDamage;

  // Apply Environmental Armour (-5 environmental damage)
  if (hero.vitalityTalents.environmentalArmour) {
    damage = Math.max(0, damage - 5);
  }

  return damage;
}

export function simulateSingleRaid(setup: RaidSetup): SimulationResult {
  const { boss, heroes } = setup;

  // Calculate final stats for all heroes
  const heroStats = heroes.map(h => calculateFinalStats(h));

  // Initialize combat state
  const state: CombatState = {
    heroHealths: [heroStats[0].maxHealth, heroStats[1].maxHealth, heroStats[2].maxHealth],
    bossHealth: boss.health,
    round: 0,
    firstAttackUsed: [false, false, false],
  };

  const damageDealtTotal = 0;
  const damageTakenTotal: [number, number, number] = [0, 0, 0];

  // Combat loop
  while (state.bossHealth > 0 && state.heroHealths.some(h => h > 0)) {
    state.round++;

    // Calculate initiatives
    const heroInitiatives = heroStats.map(s => calculateInitiative(s.combat));
    const bossInitiative = calculateInitiative(boss.combat / 3);

    // Create turn order
    const turns: Array<{ type: 'hero' | 'boss', index?: number, initiative: number }> = [
      ...heroInitiatives.map((init, i) => ({ type: 'hero' as const, index: i, initiative: init })),
      { type: 'boss' as const, initiative: bossInitiative },
    ];

    // Sort by initiative (highest first)
    turns.sort((a, b) => b.initiative - a.initiative);

    // Execute turns
    for (const turn of turns) {
      // Skip if entity is dead
      if (turn.type === 'hero' && state.heroHealths[turn.index!] <= 0) continue;
      if (turn.type === 'boss' && state.bossHealth <= 0) break;

      if (turn.type === 'hero') {
        const heroIndex = turn.index!;
        const hero = heroes[heroIndex];
        const stats = heroStats[heroIndex];

        // Hero attacks boss
        const hits = calculateHitChance(stats.combat, state.bossHealth);
        const isFirstAttack = !state.firstAttackUsed[heroIndex];

        // Apply Sacred Evasion to first boss attack (handled in boss turn)

        const damage = calculateDamage(hero, stats, !hits, isFirstAttack, state.round);
        state.bossHealth -= damage;
        state.firstAttackUsed[heroIndex] = true;

        if (state.bossHealth <= 0) break; // Boss defeated

      } else {
        // Boss attacks
        const attackPattern = boss.attackPattern[(state.round - 1) % boss.attackPattern.length];

        if (attackPattern === 'melee') {
          // Single target - attack hero with lowest health
          const aliveHeroes = state.heroHealths
            .map((h, i) => ({ health: h, index: i }))
            .filter(h => h.health > 0);

          if (aliveHeroes.length === 0) break;

          const target = aliveHeroes.reduce((prev, curr) =>
            curr.health < prev.health ? curr : prev
          );

          const hero = heroes[target.index];
          const heroHealth = state.heroHealths[target.index];
          const hits = calculateHitChance(boss.combat / 3, heroHealth);

          let damage = calculateBossDamage(boss, 'melee', hero, !hits);

          // Apply Sacred Evasion (50% reduction on first attack)
          if (hero.vitalityTalents.sacredEvasion && state.round === 1) {
            damage = Math.floor(damage * 0.5);
          }

          state.heroHealths[target.index] -= damage;
          damageTakenTotal[target.index] += damage;

        } else {
          // AOE - hits all heroes
          for (let i = 0; i < 3; i++) {
            if (state.heroHealths[i] <= 0) continue;

            const hero = heroes[i];
            const heroHealth = state.heroHealths[i];

            // AOE hit chance calculated against sum of all hero health / 3
            const totalHeroHealth = state.heroHealths.reduce((sum, h) => sum + Math.max(0, h), 0);
            const hits = calculateHitChance(boss.combat / 3, totalHeroHealth / 3);

            let damage = calculateBossDamage(boss, 'aoe', hero, !hits);

            // Apply Sacred Evasion (50% reduction on first attack)
            if (hero.vitalityTalents.sacredEvasion && state.round === 1) {
              damage = Math.floor(damage * 0.5);
            }

            state.heroHealths[i] -= damage;
            damageTakenTotal[i] += damage;
          }
        }
      }
    }

    // Apply environmental damage at end of round
    for (let i = 0; i < 3; i++) {
      if (state.heroHealths[i] > 0) {
        const envDamage = calculateEnvironmentalDamage(boss, heroes[i]);
        state.heroHealths[i] -= envDamage;
        damageTakenTotal[i] += envDamage;
      }
    }

    // Safety check - prevent infinite loops
    if (state.round > 100) break;
  }

  const victory = state.bossHealth <= 0;
  const heroDeaths: [boolean, boolean, boolean] = [
    state.heroHealths[0] <= 0,
    state.heroHealths[1] <= 0,
    state.heroHealths[2] <= 0,
  ];

  return {
    victory,
    roundsToVictory: victory ? state.round : 0,
    heroDeaths,
    damageDealt: boss.health - Math.max(0, state.bossHealth),
    damageTaken: damageTakenTotal,
  };
}
