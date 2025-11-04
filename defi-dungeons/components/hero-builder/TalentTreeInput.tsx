'use client';

import { TalentAllocation, CombatTalents, VitalityTalents } from '@/lib/simulator/types';
import { useState } from 'react';

interface TalentTreeInputProps {
  allocation: TalentAllocation;
  combatTalents: CombatTalents;
  vitalityTalents: VitalityTalents;
  onAllocationChange: (allocation: TalentAllocation) => void;
  onCombatTalentsChange: (talents: CombatTalents) => void;
  onVitalityTalentsChange: (talents: VitalityTalents) => void;
}

export const TalentTreeInput = ({
  allocation,
  combatTalents,
  vitalityTalents,
  onAllocationChange,
  onCombatTalentsChange,
  onVitalityTalentsChange,
}: TalentTreeInputProps) => {
  const totalPoints = Object.values(allocation).reduce((sum, val) => sum + val, 0);
  const maxPoints = 8;

  const handleAllocationChange = (tree: keyof TalentAllocation, value: number) => {
    const clamped = Math.max(0, Math.min(5, value));
    const newAllocation = { ...allocation, [tree]: clamped };
    const newTotal = Object.values(newAllocation).reduce((sum, val) => sum + val, 0);

    if (newTotal <= maxPoints) {
      onAllocationChange(newAllocation);
    }
  };

  const combatTalentsList = [
    { key: 'battleTempered' as const, name: 'Battle Tempered', tier: 1, desc: '+5 Combat' },
    { key: 'mythicForce' as const, name: 'Mythic Force', tier: 2, desc: '+25 Combat (Dungeons only)' },
    { key: 'classSynergy' as const, name: 'Class Synergy', tier: 3, desc: 'Double class bonus' },
    { key: 'openersEdge' as const, name: "Opener's Edge", tier: 4, desc: 'First attack +15% damage' },
    { key: 'relentlessForce' as const, name: 'Relentless Force', tier: 5, desc: 'All attacks +20 damage' },
  ];

  const vitalityTalentsList = [
    { key: 'bulwarkVitality' as const, name: 'Bulwark Vitality', tier: 1, desc: '+5 Vitality' },
    { key: 'secondWind' as const, name: 'Second Wind', tier: 2, desc: 'Restore 10 HP after each boss' },
    { key: 'environmentalArmour' as const, name: 'Environmental Armour', tier: 3, desc: '-5 environmental damage' },
    { key: 'fortifiedStance' as const, name: 'Fortified Stance', tier: 4, desc: '-5 from all boss attacks' },
    { key: 'sacredEvasion' as const, name: 'Sacred Evasion', tier: 5, desc: 'First boss attack 50% reduced' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-amber-400">Talent Trees</h3>
        <div className="text-sm">
          <span className="text-gray-400">Points Used: </span>
          <span className={totalPoints > maxPoints ? 'text-red-400' : 'text-green-400'}>
            {totalPoints}/{maxPoints}
          </span>
        </div>
      </div>

      {/* Point Allocation */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 bg-gray-800/50 rounded-lg border border-gray-700">
        {(['combat', 'vitality', 'fortune', 'luck'] as const).map((tree) => (
          <div key={tree} className="space-y-2">
            <label className="block text-sm font-medium text-gray-300 capitalize">
              {tree}
            </label>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => handleAllocationChange(tree, allocation[tree] - 1)}
                className="w-8 h-8 bg-gray-700 hover:bg-gray-600 rounded text-white"
                disabled={allocation[tree] === 0}
              >
                -
              </button>
              <span className="w-8 text-center text-white font-bold">{allocation[tree]}</span>
              <button
                type="button"
                onClick={() => handleAllocationChange(tree, allocation[tree] + 1)}
                className="w-8 h-8 bg-gray-700 hover:bg-gray-600 rounded text-white"
                disabled={allocation[tree] === 5 || totalPoints >= maxPoints}
              >
                +
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Combat Talents */}
      <div className="space-y-3">
        <h4 className="font-semibold text-red-400">Combat Talents</h4>
        <div className="space-y-2">
          {combatTalentsList.map(({ key, name, tier, desc }) => {
            const isUnlocked = allocation.combat >= tier;
            return (
              <label
                key={key}
                className={`flex items-center gap-3 p-3 rounded-lg border ${
                  isUnlocked
                    ? 'bg-gray-800 border-gray-600 cursor-pointer hover:bg-gray-750'
                    : 'bg-gray-900 border-gray-700 opacity-50 cursor-not-allowed'
                }`}
              >
                <input
                  type="checkbox"
                  checked={combatTalents[key]}
                  onChange={(e) =>
                    onCombatTalentsChange({ ...combatTalents, [key]: e.target.checked })
                  }
                  disabled={!isUnlocked}
                  className="w-5 h-5 rounded accent-red-500"
                />
                <div className="flex-1">
                  <div className="font-medium text-white">
                    {name} <span className="text-xs text-gray-400">(Tier {tier})</span>
                  </div>
                  <div className="text-sm text-gray-400">{desc}</div>
                </div>
              </label>
            );
          })}
        </div>
      </div>

      {/* Vitality Talents */}
      <div className="space-y-3">
        <h4 className="font-semibold text-green-400">Vitality Talents</h4>
        <div className="space-y-2">
          {vitalityTalentsList.map(({ key, name, tier, desc }) => {
            const isUnlocked = allocation.vitality >= tier;
            return (
              <label
                key={key}
                className={`flex items-center gap-3 p-3 rounded-lg border ${
                  isUnlocked
                    ? 'bg-gray-800 border-gray-600 cursor-pointer hover:bg-gray-750'
                    : 'bg-gray-900 border-gray-700 opacity-50 cursor-not-allowed'
                }`}
              >
                <input
                  type="checkbox"
                  checked={vitalityTalents[key]}
                  onChange={(e) =>
                    onVitalityTalentsChange({ ...vitalityTalents, [key]: e.target.checked })
                  }
                  disabled={!isUnlocked}
                  className="w-5 h-5 rounded accent-green-500"
                />
                <div className="flex-1">
                  <div className="font-medium text-white">
                    {name} <span className="text-xs text-gray-400">(Tier {tier})</span>
                  </div>
                  <div className="text-sm text-gray-400">{desc}</div>
                </div>
              </label>
            );
          })}
        </div>
      </div>
    </div>
  );
};
