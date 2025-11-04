'use client';

import { BaseStats } from '@/lib/simulator/types';

interface StatsInputProps {
  stats: BaseStats;
  onChange: (stats: BaseStats) => void;
}

export const StatsInput = ({ stats, onChange }: StatsInputProps) => {
  const handleChange = (stat: keyof BaseStats, value: number) => {
    const clamped = Math.max(1, Math.min(150, value));
    onChange({ ...stats, [stat]: clamped });
  };

  const statFields: Array<{ key: keyof BaseStats; label: string; color: string }> = [
    { key: 'combat', label: 'Combat', color: 'text-red-400' },
    { key: 'vitality', label: 'Vitality', color: 'text-green-400' },
    { key: 'fortune', label: 'Fortune', color: 'text-yellow-400' },
    { key: 'luck', label: 'Luck', color: 'text-purple-400' },
  ];

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-amber-400">Base Stats</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {statFields.map(({ key, label, color }) => (
          <div key={key} className="space-y-2">
            <label className={`block text-sm font-medium ${color}`}>
              {label} <span className="text-gray-400 text-xs">(1-150)</span>
            </label>
            <div className="flex items-center gap-2">
              <input
                type="range"
                min="1"
                max="150"
                value={stats[key]}
                onChange={(e) => handleChange(key, parseInt(e.target.value))}
                className="flex-1 h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-amber-500"
              />
              <input
                type="number"
                min="1"
                max="150"
                value={stats[key]}
                onChange={(e) => handleChange(key, parseInt(e.target.value) || 1)}
                className="w-20 px-3 py-2 bg-gray-800 border border-gray-600 rounded text-white text-center"
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
