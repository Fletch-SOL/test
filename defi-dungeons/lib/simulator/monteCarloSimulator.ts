// monteCarloSimulator.ts - Run multiple simulations and aggregate results

import { RaidSetup, AggregatedResults } from './types';
import { simulateSingleRaid } from './combatSimulator';

export function runMonteCarloSimulation(
  setup: RaidSetup,
  iterations: number = 10000
): AggregatedResults {
  let wins = 0;
  let totalRounds = 0;
  const deaths = [0, 0, 0];
  let totalDamageDealt = 0;
  const totalDamageTaken = [0, 0, 0];

  for (let i = 0; i < iterations; i++) {
    const result = simulateSingleRaid(setup);

    if (result.victory) {
      wins++;
      totalRounds += result.roundsToVictory;
    }

    // Count deaths
    result.heroDeaths.forEach((died, index) => {
      if (died) deaths[index]++;
    });

    totalDamageDealt += result.damageDealt;
    result.damageTaken.forEach((dmg, index) => {
      totalDamageTaken[index] += dmg;
    });
  }

  return {
    winRate: (wins / iterations) * 100,
    averageRounds: wins > 0 ? totalRounds / wins : 0,
    deathRates: deaths.map(d => (d / iterations) * 100) as [number, number, number],
    averageDamageDealt: totalDamageDealt / iterations,
    averageDamageTaken: totalDamageTaken.map(d => d / iterations) as [number, number, number],
  };
}
