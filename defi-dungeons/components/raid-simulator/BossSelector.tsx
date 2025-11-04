'use client';

import { Boss, BossName } from '@/lib/simulator/types';
import { BOSSES } from '@/lib/simulator/bossData';

interface BossSelectorProps {
  selectedBoss: Boss | null;
  onSelect: (boss: Boss) => void;
}

export const BossSelector = ({ selectedBoss, onSelect }: BossSelectorProps) => {
  const bosses = Object.values(BOSSES);

  const getBossColor = (bossName: BossName) => {
    const colors = {
      Blackmaw: 'from-green-900 to-green-950',
      'Sir Malic': 'from-blue-900 to-blue-950',
      Hexarion: 'from-purple-900 to-purple-950',
    };
    return colors[bossName];
  };

  const getDifficultyLabel = (bossName: BossName) => {
    const labels = {
      Blackmaw: 'Easy',
      'Sir Malic': 'Medium',
      Hexarion: 'Hard',
    };
    return labels[bossName];
  };

  const getDifficultyColor = (bossName: BossName) => {
    const colors = {
      Blackmaw: 'text-green-400',
      'Sir Malic': 'text-yellow-400',
      Hexarion: 'text-red-400',
    };
    return colors[bossName];
  };

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold text-amber-400">Select Boss</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {bosses.map((boss) => {
          const isSelected = selectedBoss?.name === boss.name;
          return (
            <button
              key={boss.name}
              onClick={() => onSelect(boss)}
              className={`p-6 rounded-lg border-2 transition-all ${
                isSelected
                  ? 'border-amber-500 ring-2 ring-amber-500/50 scale-105'
                  : 'border-gray-700 hover:border-gray-600'
              } bg-gradient-to-br ${getBossColor(boss.name)}`}
            >
              <div className="text-center">
                <h3 className="text-xl font-bold text-white mb-2">{boss.name}</h3>
                <div
                  className={`text-sm font-semibold mb-4 ${getDifficultyColor(boss.name)}`}
                >
                  {getDifficultyLabel(boss.name)}
                </div>

                <div className="space-y-2 text-sm text-gray-300">
                  <div className="flex justify-between">
                    <span>Combat:</span>
                    <span className="text-red-400 font-bold">{boss.combat * 3}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Health:</span>
                    <span className="text-green-400 font-bold">{boss.health * 3}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Env. Damage:</span>
                    <span className="text-yellow-400 font-bold">{boss.environmentalDamage}</span>
                  </div>
                </div>

                <div className="mt-4 pt-4 border-t border-gray-700">
                  <div className="text-xs text-gray-400 mb-1">Attack Pattern</div>
                  <div className="flex justify-center gap-1">
                    {boss.attackPattern.map((attack, idx) => (
                      <span
                        key={idx}
                        className={`px-2 py-1 rounded text-xs font-semibold ${
                          attack === 'melee'
                            ? 'bg-red-900/50 text-red-300'
                            : 'bg-purple-900/50 text-purple-300'
                        }`}
                      >
                        {attack === 'melee' ? 'Melee' : 'AOE'}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};
