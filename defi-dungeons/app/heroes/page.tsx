'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Hero } from '@/lib/simulator/types';
import { getAllHeroes, deleteHero } from '@/lib/heroStorage';
import { calculateFinalStats } from '@/lib/simulator/statCalculator';
import { Navigation } from '@/components/Navigation';
import { generateTestHeroes } from '@/lib/testHeroGenerator';

export default function HeroesPage() {
  const [heroes, setHeroes] = useState<Hero[]>([]);
  const [selectedHero, setSelectedHero] = useState<Hero | null>(null);

  useEffect(() => {
    loadHeroes();
  }, []);

  const loadHeroes = () => {
    setHeroes(getAllHeroes());
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this hero?')) {
      deleteHero(id);
      loadHeroes();
      if (selectedHero?.id === id) {
        setSelectedHero(null);
      }
    }
  };

  const handleCreateTestHeroes = () => {
    generateTestHeroes();
    loadHeroes();
  };

  const getClassColor = (heroClass: string) => {
    const colors = {
      Warrior: 'text-red-400',
      Mage: 'text-blue-400',
      Marksman: 'text-green-400',
      Priest: 'text-yellow-400',
    };
    return colors[heroClass as keyof typeof colors] || 'text-gray-400';
  };

  const getClassBg = (heroClass: string) => {
    const colors = {
      Warrior: 'bg-red-900/20 border-red-700/30',
      Mage: 'bg-blue-900/20 border-blue-700/30',
      Marksman: 'bg-green-900/20 border-green-700/30',
      Priest: 'bg-yellow-900/20 border-yellow-700/30',
    };
    return colors[heroClass as keyof typeof colors] || 'bg-gray-900/20 border-gray-700/30';
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black p-8">
      <div className="max-w-7xl mx-auto">
        {/* Navigation */}
        <div className="mb-8">
          <Navigation />
        </div>

        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold text-amber-400 mb-2">My Heroes</h1>
            <p className="text-gray-400">Manage your hero roster</p>
          </div>
          <Link
            href="/heroes/new"
            className="px-6 py-3 bg-gradient-to-r from-purple-600 to-amber-600 hover:from-purple-700 hover:to-amber-700 text-white rounded-lg font-semibold transition-colors"
          >
            + Create New Hero
          </Link>
        </div>

        {heroes.length === 0 ? (
          <div className="text-center py-16">
            <div className="bg-gradient-to-r from-purple-900/30 to-blue-900/30 border-2 border-purple-500/50 p-12 rounded-lg inline-block">
              <div className="text-5xl mb-4">⚔️</div>
              <h2 className="text-2xl font-bold text-purple-400 mb-4">No Heroes Yet</h2>
              <p className="text-gray-300 mb-6 max-w-md">
                Create your first heroes to start building your roster. Use test heroes for quick
                testing or build custom heroes with your own stats!
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button
                  onClick={handleCreateTestHeroes}
                  className="px-8 py-4 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white rounded-lg font-bold text-lg transition-all transform hover:scale-105 shadow-lg"
                >
                  ⚡ Create 5 Test Heroes
                </button>
                <Link
                  href="/heroes/new"
                  className="px-8 py-4 bg-gradient-to-r from-purple-600 to-amber-600 hover:from-purple-700 hover:to-amber-700 text-white rounded-lg font-bold text-lg transition-all transform hover:scale-105 shadow-lg"
                >
                  🛠️ Build Custom Hero
                </Link>
              </div>
              <p className="text-sm text-gray-400 mt-4">
                Test heroes: Thorin (Tank), Lyra (Mage), Silvanus (Marksman), Aldric (Priest),
                Grimnar (Berserker)
              </p>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Hero List */}
            <div className="lg:col-span-2 space-y-4">
              {heroes.map((hero) => {
                const stats = calculateFinalStats(hero);
                return (
                  <div
                    key={hero.id}
                    className={`p-6 rounded-lg border cursor-pointer transition-all ${
                      selectedHero?.id === hero.id
                        ? 'bg-gray-700/50 border-amber-500 ring-2 ring-amber-500/50'
                        : 'bg-gray-800/70 border-gray-700 hover:border-gray-600'
                    }`}
                    onClick={() => setSelectedHero(hero)}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-xl font-bold text-white">{hero.name}</h3>
                          <span
                            className={`px-3 py-1 rounded-full text-sm font-semibold ${getClassBg(
                              hero.class
                            )} ${getClassColor(hero.class)}`}
                          >
                            {hero.class}
                          </span>
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
                          <div>
                            <div className="text-xs text-gray-400">Combat</div>
                            <div className="text-lg font-bold text-red-400">{stats.combat}</div>
                          </div>
                          <div>
                            <div className="text-xs text-gray-400">Vitality</div>
                            <div className="text-lg font-bold text-green-400">
                              {stats.vitality}
                            </div>
                          </div>
                          <div>
                            <div className="text-xs text-gray-400">Fortune</div>
                            <div className="text-lg font-bold text-yellow-400">
                              {stats.fortune}
                            </div>
                          </div>
                          <div>
                            <div className="text-xs text-gray-400">Luck</div>
                            <div className="text-lg font-bold text-purple-400">{stats.luck}</div>
                          </div>
                        </div>

                        <div className="mt-3 flex items-center gap-4 text-sm text-gray-400">
                          <span>Position {hero.position}</span>
                          {hero.uniqueItem && (
                            <span className="text-amber-400">• {hero.uniqueItem}</span>
                          )}
                        </div>
                      </div>

                      <div className="flex gap-2">
                        <Link
                          href={`/heroes/${hero.id}/edit`}
                          className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded transition-colors"
                          onClick={(e) => e.stopPropagation()}
                        >
                          Edit
                        </Link>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDelete(hero.id);
                          }}
                          className="px-4 py-2 bg-red-900/50 hover:bg-red-800/50 text-red-400 rounded transition-colors"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Hero Details Sidebar */}
            <div className="lg:col-span-1">
              {selectedHero ? (
                <div className="bg-gray-800/70 p-6 rounded-lg border border-gray-700 sticky top-8">
                  <h3 className="text-xl font-bold text-amber-400 mb-4">Hero Details</h3>

                  <div className="space-y-4">
                    <div>
                      <h4 className="text-sm font-semibold text-gray-400 mb-2">Base Stats</h4>
                      <div className="space-y-1 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-300">Combat:</span>
                          <span className="text-white">{selectedHero.baseStats.combat}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-300">Vitality:</span>
                          <span className="text-white">{selectedHero.baseStats.vitality}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-300">Fortune:</span>
                          <span className="text-white">{selectedHero.baseStats.fortune}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-300">Luck:</span>
                          <span className="text-white">{selectedHero.baseStats.luck}</span>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h4 className="text-sm font-semibold text-gray-400 mb-2">
                        Equipment Bonuses
                      </h4>
                      <div className="space-y-1 text-sm">
                        {Object.entries(selectedHero.equipmentBonuses).map(([key, value]) => (
                          <div key={key} className="flex justify-between">
                            <span className="text-gray-300 capitalize">{key}:</span>
                            <span className="text-green-400">+{value}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h4 className="text-sm font-semibold text-gray-400 mb-2">
                        Active Talents
                      </h4>
                      <div className="space-y-1 text-sm">
                        {Object.entries(selectedHero.combatTalents)
                          .filter(([_, active]) => active)
                          .map(([talent]) => (
                            <div key={talent} className="text-red-400">
                              • {talent.replace(/([A-Z])/g, ' $1').trim()}
                            </div>
                          ))}
                        {Object.entries(selectedHero.vitalityTalents)
                          .filter(([_, active]) => active)
                          .map(([talent]) => (
                            <div key={talent} className="text-green-400">
                              • {talent.replace(/([A-Z])/g, ' $1').trim()}
                            </div>
                          ))}
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="bg-gray-800/70 p-6 rounded-lg border border-gray-700 text-center text-gray-400">
                  Select a hero to view details
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
