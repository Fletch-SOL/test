'use client';

import { AggregatedResults } from '@/lib/simulator/types';
import { Hero } from '@/lib/simulator/types';

interface SimulationResultsProps {
  results: AggregatedResults;
  heroes: [Hero, Hero, Hero];
}

export const SimulationResults = ({ results, heroes }: SimulationResultsProps) => {
  const getWinRateColor = (rate: number) => {
    if (rate >= 90) return 'text-green-400';
    if (rate >= 70) return 'text-yellow-400';
    if (rate >= 50) return 'text-orange-400';
    return 'text-red-400';
  };

  const getDeathRiskColor = (rate: number) => {
    if (rate <= 10) return 'text-green-400';
    if (rate <= 30) return 'text-yellow-400';
    if (rate <= 50) return 'text-orange-400';
    return 'text-red-400';
  };

  const getRiskLabel = (rate: number) => {
    if (rate <= 10) return 'Very Low';
    if (rate <= 30) return 'Low';
    if (rate <= 50) return 'Moderate';
    if (rate <= 70) return 'High';
    return 'Very High';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-900/50 to-amber-900/50 p-6 rounded-lg border border-amber-700/30">
        <h2 className="text-3xl font-bold text-amber-400 mb-2">Simulation Results</h2>
        <p className="text-gray-300">Based on 10,000 Monte Carlo simulations</p>
      </div>

      {/* Win Rate - Big Display */}
      <div className="bg-gray-800/70 p-8 rounded-lg border-2 border-gray-700 text-center">
        <div className="text-sm text-gray-400 uppercase tracking-wide mb-2">Overall Win Rate</div>
        <div className={`text-7xl font-bold mb-4 ${getWinRateColor(results.winRate)}`}>
          {results.winRate.toFixed(2)}%
        </div>
        {results.winRate >= 90 && (
          <div className="text-green-400 text-lg">Excellent! Very high chance of victory</div>
        )}
        {results.winRate >= 70 && results.winRate < 90 && (
          <div className="text-yellow-400 text-lg">Good! Strong chance of victory</div>
        )}
        {results.winRate >= 50 && results.winRate < 70 && (
          <div className="text-orange-400 text-lg">Fair chance of victory</div>
        )}
        {results.winRate < 50 && (
          <div className="text-red-400 text-lg">Low chance - consider stronger heroes</div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Combat Stats */}
        <div className="bg-gray-800/70 p-6 rounded-lg border border-gray-700">
          <h3 className="text-xl font-bold text-amber-400 mb-4">Combat Statistics</h3>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between items-center mb-1">
                <span className="text-gray-300">Average Rounds to Victory</span>
                <span className="text-white font-bold text-lg">
                  {results.averageRounds.toFixed(1)}
                </span>
              </div>
              <div className="h-2 bg-gray-700 rounded overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-amber-500 to-amber-600"
                  style={{ width: `${Math.min((results.averageRounds / 20) * 100, 100)}%` }}
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-1">
                <span className="text-gray-300">Average Damage Dealt</span>
                <span className="text-red-400 font-bold text-lg">
                  {results.averageDamageDealt.toFixed(0)}
                </span>
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-1">
                <span className="text-gray-300">Total Damage Taken (Party)</span>
                <span className="text-green-400 font-bold text-lg">
                  {results.averageDamageTaken.reduce((sum, dmg) => sum + dmg, 0).toFixed(0)}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Hero Death Risks */}
        <div className="bg-gray-800/70 p-6 rounded-lg border border-gray-700">
          <h3 className="text-xl font-bold text-amber-400 mb-4">Hero Survival Analysis</h3>
          <div className="space-y-4">
            {heroes.map((hero, idx) => (
              <div key={hero.id} className="space-y-2">
                <div className="flex justify-between items-center">
                  <div>
                    <div className="text-white font-semibold">{hero.name}</div>
                    <div className="text-xs text-gray-400">Position {idx + 1}</div>
                  </div>
                  <div className="text-right">
                    <div className={`text-lg font-bold ${getDeathRiskColor(results.deathRates[idx])}`}>
                      {results.deathRates[idx].toFixed(1)}%
                    </div>
                    <div className="text-xs text-gray-400">
                      {getRiskLabel(results.deathRates[idx])} Risk
                    </div>
                  </div>
                </div>
                <div className="h-2 bg-gray-700 rounded overflow-hidden">
                  <div
                    className={`h-full ${
                      results.deathRates[idx] <= 30
                        ? 'bg-green-500'
                        : results.deathRates[idx] <= 50
                        ? 'bg-yellow-500'
                        : 'bg-red-500'
                    }`}
                    style={{ width: `${results.deathRates[idx]}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Detailed Damage Breakdown */}
      <div className="bg-gray-800/70 p-6 rounded-lg border border-gray-700">
        <h3 className="text-xl font-bold text-amber-400 mb-4">Damage Taken by Hero</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {heroes.map((hero, idx) => (
            <div key={hero.id} className="bg-gray-900/50 p-4 rounded-lg">
              <div className="text-white font-semibold mb-2">{hero.name}</div>
              <div className="flex items-baseline gap-2">
                <div className="text-2xl font-bold text-red-400">
                  {results.averageDamageTaken[idx].toFixed(0)}
                </div>
                <div className="text-sm text-gray-400">avg damage</div>
              </div>
              <div className="mt-2 text-xs text-gray-400">
                {((results.averageDamageTaken[idx] / results.averageDamageTaken.reduce((sum, d) => sum + d, 0)) * 100).toFixed(1)}% of total
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recommendations */}
      <div className="bg-blue-900/20 border border-blue-700/30 p-6 rounded-lg">
        <h3 className="text-lg font-bold text-blue-400 mb-3">💡 Recommendations</h3>
        <ul className="space-y-2 text-sm text-gray-300">
          {results.winRate < 50 && (
            <li>• Consider upgrading your heroes&apos; stats or equipment before attempting this raid</li>
          )}
          {results.deathRates[0] > 70 && (
            <li>• Position 1 (Tank) has very high death risk - increase Vitality or add defensive talents</li>
          )}
          {results.deathRates[1] > 70 && (
            <li>• Position 2 (DPS) is dying too often - consider more balanced stats</li>
          )}
          {results.deathRates[2] > 70 && (
            <li>• Position 3 (Support) needs better survivability</li>
          )}
          {results.averageRounds > 15 && (
            <li>• Combat is lasting too long - increase Combat stats or damage bonuses</li>
          )}
          {results.winRate >= 90 && (
            <li>• Excellent team composition! Your party is well-prepared for this raid</li>
          )}
        </ul>
      </div>
    </div>
  );
};
