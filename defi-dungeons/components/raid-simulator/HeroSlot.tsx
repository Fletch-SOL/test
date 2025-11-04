'use client';

import { Hero } from '@/lib/simulator/types';
import { calculateFinalStats } from '@/lib/simulator/statCalculator';

interface HeroSlotProps {
  position: 1 | 2 | 3;
  selectedHero: Hero | null;
  availableHeroes: Hero[];
  onSelect: (hero: Hero | null) => void;
}

const POSITION_INFO = {
  1: {
    name: 'Tank',
    bonus: '+15 Vitality',
    description: 'Frontline defender',
    color: 'text-green-400',
  },
  2: {
    name: 'DPS',
    bonus: '+15 Combat',
    description: 'Main damage dealer',
    color: 'text-red-400',
  },
  3: {
    name: 'Support',
    bonus: '+10 Fortune & Luck',
    description: 'Utility specialist',
    color: 'text-purple-400',
  },
};

export const HeroSlot = ({ position, selectedHero, availableHeroes, onSelect }: HeroSlotProps) => {
  const posInfo = POSITION_INFO[position];
  const stats = selectedHero ? calculateFinalStats(selectedHero) : null;

  const getClassColor = (heroClass: string) => {
    const colors = {
      Warrior: 'text-red-400',
      Mage: 'text-blue-400',
      Marksman: 'text-green-400',
      Priest: 'text-yellow-400',
    };
    return colors[heroClass as keyof typeof colors] || 'text-gray-400';
  };

  return (
    <div className="bg-gray-800/70 rounded-lg border border-gray-700 p-5">
      {/* Position Header */}
      <div className="mb-4 pb-3 border-b border-gray-700">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-bold text-white">
              Position {position}: <span className={posInfo.color}>{posInfo.name}</span>
            </h3>
            <p className="text-xs text-gray-400">{posInfo.description}</p>
          </div>
          <div className="text-right">
            <div className="text-xs text-gray-400">Bonus</div>
            <div className={`text-sm font-semibold ${posInfo.color}`}>{posInfo.bonus}</div>
          </div>
        </div>
      </div>

      {/* Hero Selection */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-300 mb-2">Select Hero</label>
        <select
          value={selectedHero?.id || ''}
          onChange={(e) => {
            const hero = availableHeroes.find((h) => h.id === e.target.value) || null;
            onSelect(hero);
          }}
          className="w-full px-4 py-2 bg-gray-900 border border-gray-600 rounded text-white"
        >
          <option value="">-- Empty Slot --</option>
          {availableHeroes.map((hero) => (
            <option key={hero.id} value={hero.id}>
              {hero.name} ({hero.class})
            </option>
          ))}
        </select>
      </div>

      {/* Selected Hero Stats */}
      {selectedHero && stats ? (
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <div className="text-white font-bold">{selectedHero.name}</div>
            <span className={`text-sm ${getClassColor(selectedHero.class)}`}>
              {selectedHero.class}
            </span>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="bg-gray-900/50 p-3 rounded">
              <div className="text-xs text-gray-400">Combat</div>
              <div className="text-lg font-bold text-red-400">{stats.combat}</div>
            </div>
            <div className="bg-gray-900/50 p-3 rounded">
              <div className="text-xs text-gray-400">Vitality</div>
              <div className="text-lg font-bold text-green-400">{stats.vitality}</div>
            </div>
            <div className="bg-gray-900/50 p-3 rounded">
              <div className="text-xs text-gray-400">Fortune</div>
              <div className="text-lg font-bold text-yellow-400">{stats.fortune}</div>
            </div>
            <div className="bg-gray-900/50 p-3 rounded">
              <div className="text-xs text-gray-400">Luck</div>
              <div className="text-lg font-bold text-purple-400">{stats.luck}</div>
            </div>
          </div>

          {stats.damage > 0 && (
            <div className="bg-amber-900/20 border border-amber-700/30 p-2 rounded">
              <div className="text-xs text-amber-400">
                Bonus Damage: <span className="font-bold">+{stats.damage}</span>
              </div>
            </div>
          )}

          {selectedHero.uniqueItem && (
            <div className="bg-purple-900/20 border border-purple-700/30 p-2 rounded">
              <div className="text-xs text-purple-400">
                Unique Item: <span className="font-bold">{selectedHero.uniqueItem}</span>
              </div>
            </div>
          )}

          {/* Active Talents Count */}
          <div className="flex gap-2 text-xs">
            {Object.values(selectedHero.combatTalents).filter(Boolean).length > 0 && (
              <span className="px-2 py-1 bg-red-900/30 text-red-400 rounded">
                {Object.values(selectedHero.combatTalents).filter(Boolean).length} Combat
              </span>
            )}
            {Object.values(selectedHero.vitalityTalents).filter(Boolean).length > 0 && (
              <span className="px-2 py-1 bg-green-900/30 text-green-400 rounded">
                {Object.values(selectedHero.vitalityTalents).filter(Boolean).length} Vitality
              </span>
            )}
          </div>
        </div>
      ) : (
        <div className="text-center py-8 text-gray-500">
          <div className="text-4xl mb-2">⚔️</div>
          <div className="text-sm">No hero selected</div>
        </div>
      )}
    </div>
  );
};
