'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Hero, HeroClass, UniqueItem } from '@/lib/simulator/types';
import { saveHero, generateHeroId } from '@/lib/heroStorage';
import { StatsInput } from './StatsInput';
import { EquipmentInput } from './EquipmentInput';
import { TalentTreeInput } from './TalentTreeInput';

interface HeroFormProps {
  initialHero?: Hero;
  mode: 'create' | 'edit';
}

const defaultHero: Omit<Hero, 'id'> = {
  name: '',
  class: 'Warrior',
  position: 1,
  baseStats: { combat: 50, vitality: 50, fortune: 50, luck: 50 },
  equipmentBonuses: { combat: 0, vitality: 0, fortune: 0, luck: 0, damage: 0 },
  talents: { combat: 0, vitality: 0, fortune: 0, luck: 0 },
  combatTalents: {
    battleTempered: false,
    mythicForce: false,
    classSynergy: false,
    openersEdge: false,
    relentlessForce: false,
  },
  vitalityTalents: {
    bulwarkVitality: false,
    secondWind: false,
    environmentalArmour: false,
    fortifiedStance: false,
    sacredEvasion: false,
  },
  uniqueItem: null,
};

export const HeroForm = ({ initialHero, mode }: HeroFormProps) => {
  const router = useRouter();
  const [hero, setHero] = useState<Hero>(
    initialHero || { ...defaultHero, id: generateHeroId() }
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!hero.name.trim()) {
      alert('Please enter a hero name');
      return;
    }

    saveHero(hero);
    router.push('/heroes');
  };

  const heroClasses: HeroClass[] = ['Warrior', 'Mage', 'Marksman', 'Priest'];
  const uniqueItems: (UniqueItem)[] = [null, 'Golden Heart', 'Horse Mount', 'Four-Leaf Clover', 'Harp', 'Warhorn'];

  return (
    <form onSubmit={handleSubmit} className="max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-900/50 to-amber-900/50 p-6 rounded-lg border border-amber-700/30">
        <h2 className="text-3xl font-bold text-amber-400">
          {mode === 'create' ? 'Create New Hero' : 'Edit Hero'}
        </h2>
        <p className="text-gray-300 mt-2">
          Build your hero with custom stats, equipment, and talents
        </p>
      </div>

      {/* Basic Info */}
      <div className="bg-gray-800/70 p-6 rounded-lg border border-gray-700 space-y-4">
        <h3 className="text-lg font-semibold text-amber-400">Basic Information</h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-300">
              Hero Name <span className="text-red-400">*</span>
            </label>
            <input
              type="text"
              value={hero.name}
              onChange={(e) => setHero({ ...hero, name: e.target.value })}
              className="w-full px-4 py-2 bg-gray-900 border border-gray-600 rounded text-white placeholder-gray-500"
              placeholder="Enter hero name"
              required
            />
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-300">Class</label>
            <select
              value={hero.class}
              onChange={(e) => setHero({ ...hero, class: e.target.value as HeroClass })}
              className="w-full px-4 py-2 bg-gray-900 border border-gray-600 rounded text-white"
            >
              {heroClasses.map((cls) => (
                <option key={cls} value={cls}>
                  {cls}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-300">
              Position in Party
            </label>
            <select
              value={hero.position}
              onChange={(e) =>
                setHero({ ...hero, position: parseInt(e.target.value) as 1 | 2 | 3 })
              }
              className="w-full px-4 py-2 bg-gray-900 border border-gray-600 rounded text-white"
            >
              <option value={1}>Position 1 (Tank - +15 Vitality)</option>
              <option value={2}>Position 2 (DPS - +15 Combat)</option>
              <option value={3}>Position 3 (Support - +10 Fortune & Luck)</option>
            </select>
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-300">Unique Item</label>
            <select
              value={hero.uniqueItem || ''}
              onChange={(e) =>
                setHero({ ...hero, uniqueItem: (e.target.value || null) as UniqueItem })
              }
              className="w-full px-4 py-2 bg-gray-900 border border-gray-600 rounded text-white"
            >
              <option value="">None</option>
              {uniqueItems.filter(Boolean).map((item) => (
                <option key={item} value={item!}>
                  {item}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Base Stats */}
      <div className="bg-gray-800/70 p-6 rounded-lg border border-gray-700">
        <StatsInput
          stats={hero.baseStats}
          onChange={(baseStats) => setHero({ ...hero, baseStats })}
        />
      </div>

      {/* Equipment Bonuses */}
      <div className="bg-gray-800/70 p-6 rounded-lg border border-gray-700">
        <EquipmentInput
          bonuses={hero.equipmentBonuses}
          onChange={(equipmentBonuses) => setHero({ ...hero, equipmentBonuses })}
        />
      </div>

      {/* Talent Trees */}
      <div className="bg-gray-800/70 p-6 rounded-lg border border-gray-700">
        <TalentTreeInput
          allocation={hero.talents}
          combatTalents={hero.combatTalents}
          vitalityTalents={hero.vitalityTalents}
          onAllocationChange={(talents) => setHero({ ...hero, talents })}
          onCombatTalentsChange={(combatTalents) => setHero({ ...hero, combatTalents })}
          onVitalityTalentsChange={(vitalityTalents) => setHero({ ...hero, vitalityTalents })}
        />
      </div>

      {/* Actions */}
      <div className="flex gap-4 justify-end">
        <button
          type="button"
          onClick={() => router.push('/heroes')}
          className="px-6 py-3 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="px-6 py-3 bg-gradient-to-r from-purple-600 to-amber-600 hover:from-purple-700 hover:to-amber-700 text-white rounded-lg font-semibold transition-colors"
        >
          {mode === 'create' ? 'Create Hero' : 'Save Changes'}
        </button>
      </div>
    </form>
  );
};
