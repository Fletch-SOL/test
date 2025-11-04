'use client';

interface EquipmentBonuses {
  combat: number;
  vitality: number;
  fortune: number;
  luck: number;
  damage: number;
}

interface EquipmentInputProps {
  bonuses: EquipmentBonuses;
  onChange: (bonuses: EquipmentBonuses) => void;
}

export const EquipmentInput = ({ bonuses, onChange }: EquipmentInputProps) => {
  const handleChange = (key: keyof EquipmentBonuses, value: number) => {
    const clamped = Math.max(0, Math.min(999, value));
    onChange({ ...bonuses, [key]: clamped });
  };

  const fields: Array<{ key: keyof EquipmentBonuses; label: string }> = [
    { key: 'combat', label: 'Combat' },
    { key: 'vitality', label: 'Vitality' },
    { key: 'fortune', label: 'Fortune' },
    { key: 'luck', label: 'Luck' },
    { key: 'damage', label: 'Damage' },
  ];

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-amber-400">Equipment Bonuses</h3>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {fields.map(({ key, label }) => (
          <div key={key} className="space-y-2">
            <label className="block text-sm font-medium text-gray-300">
              +{label}
            </label>
            <input
              type="number"
              min="0"
              max="999"
              value={bonuses[key]}
              onChange={(e) => handleChange(key, parseInt(e.target.value) || 0)}
              className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded text-white"
            />
          </div>
        ))}
      </div>
    </div>
  );
};
