'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Navigation } from '@/components/Navigation';
import { BossSelector } from '@/components/raid-simulator/BossSelector';
import { HeroSlot } from '@/components/raid-simulator/HeroSlot';
import { SimulationResults } from '@/components/raid-simulator/SimulationResults';
import { Boss, Hero, AggregatedResults } from '@/lib/simulator/types';
import { getAllHeroes } from '@/lib/heroStorage';
import { runMonteCarloSimulation } from '@/lib/simulator/monteCarloSimulator';
import { generateTestHeroes } from '@/lib/testHeroGenerator';

export default function SimulatorPage() {
  const [availableHeroes, setAvailableHeroes] = useState<Hero[]>([]);
  const [selectedBoss, setSelectedBoss] = useState<Boss | null>(null);
  const [selectedHeroes, setSelectedHeroes] = useState<[Hero | null, Hero | null, Hero | null]>([
    null,
    null,
    null,
  ]);
  const [results, setResults] = useState<AggregatedResults | null>(null);
  const [isSimulating, setIsSimulating] = useState(false);
  const [simulationProgress, setSimulationProgress] = useState(0);

  useEffect(() => {
    loadHeroes();
  }, []);

  const loadHeroes = () => {
    const heroes = getAllHeroes();
    setAvailableHeroes(heroes);
  };

  const handleHeroSelect = (position: 0 | 1 | 2, hero: Hero | null) => {
    const newSelection: [Hero | null, Hero | null, Hero | null] = [...selectedHeroes];

    // If assigning a hero, update their position
    if (hero) {
      // Create a new hero object with updated position
      const heroWithPosition: Hero = {
        ...hero,
        position: (position + 1) as 1 | 2 | 3,
      };
      newSelection[position] = heroWithPosition;
    } else {
      newSelection[position] = null;
    }

    setSelectedHeroes(newSelection);
  };

  const canRunSimulation = () => {
    return (
      selectedBoss !== null &&
      selectedHeroes[0] !== null &&
      selectedHeroes[1] !== null &&
      selectedHeroes[2] !== null
    );
  };

  const runSimulation = async () => {
    if (!canRunSimulation()) return;

    setIsSimulating(true);
    setSimulationProgress(0);
    setResults(null);

    // Simulate progress
    const progressInterval = setInterval(() => {
      setSimulationProgress((prev) => {
        if (prev >= 95) {
          clearInterval(progressInterval);
          return 95;
        }
        return prev + 5;
      });
    }, 100);

    // Run simulation in a setTimeout to allow UI to update
    setTimeout(() => {
      const simulationResults = runMonteCarloSimulation(
        {
          boss: selectedBoss!,
          heroes: selectedHeroes as [Hero, Hero, Hero],
        },
        10000
      );

      clearInterval(progressInterval);
      setSimulationProgress(100);
      setResults(simulationResults);

      setTimeout(() => {
        setIsSimulating(false);
        setSimulationProgress(0);
      }, 500);
    }, 50);
  };

  // Get available heroes for each slot (excluding already selected heroes)
  const getAvailableHeroesForSlot = (slotIndex: number): Hero[] => {
    const selectedIds = selectedHeroes
      .map((h, idx) => (idx !== slotIndex && h ? h.id : null))
      .filter(Boolean);
    return availableHeroes.filter((h) => !selectedIds.includes(h.id));
  };

  const handleCreateTestHeroes = () => {
    generateTestHeroes();
    loadHeroes();
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black p-8">
      <div className="max-w-7xl mx-auto">
        {/* Navigation */}
        <div className="mb-8">
          <Navigation />
        </div>

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-amber-400 mb-2">Raid Simulator</h1>
          <p className="text-gray-400">
            Select a boss and your party composition to run a Monte Carlo simulation
          </p>
        </div>

        {/* No Heroes Warning */}
        {availableHeroes.length === 0 && (
          <div className="bg-gradient-to-r from-purple-900/30 to-blue-900/30 border-2 border-purple-500/50 p-8 rounded-lg mb-8">
            <div className="text-center">
              <div className="text-5xl mb-4">⚔️</div>
              <h3 className="text-2xl font-bold text-purple-400 mb-3">No Heroes Available</h3>
              <p className="text-gray-300 mb-6">
                You need heroes to run raid simulations. Get started quickly with test heroes or
                create your own!
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
                Test heroes include: Tank Warrior, DPS Mage, Support Marksman, Healer Priest, and
                Berserker
              </p>
            </div>
          </div>
        )}

        {availableHeroes.length < 3 && availableHeroes.length > 0 && (
          <div className="bg-gradient-to-r from-yellow-900/30 to-orange-900/30 border-2 border-yellow-500/50 p-8 rounded-lg mb-8">
            <div className="text-center">
              <div className="text-4xl mb-3">⚠️</div>
              <h3 className="text-xl font-bold text-yellow-400 mb-2">Need More Heroes</h3>
              <p className="text-gray-300 mb-6">
                You have {availableHeroes.length} hero(s). You need at least 3 heroes to run a raid
                simulation.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button
                  onClick={handleCreateTestHeroes}
                  className="px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white rounded-lg font-semibold transition-all transform hover:scale-105"
                >
                  ⚡ Add Test Heroes
                </button>
                <Link
                  href="/heroes/new"
                  className="px-6 py-3 bg-gradient-to-r from-purple-600 to-amber-600 hover:from-purple-700 hover:to-amber-700 text-white rounded-lg font-semibold transition-all transform hover:scale-105"
                >
                  🛠️ Create Custom Hero
                </Link>
              </div>
            </div>
          </div>
        )}

        {availableHeroes.length >= 3 && (
          <>
            {/* Boss Selection */}
            <div className="mb-8 bg-gray-800/70 p-6 rounded-lg border border-gray-700">
              <BossSelector selectedBoss={selectedBoss} onSelect={setSelectedBoss} />
            </div>

            {/* Party Composition */}
            <div className="mb-8 bg-gray-800/70 p-6 rounded-lg border border-gray-700">
              <h2 className="text-2xl font-bold text-amber-400 mb-6">Party Composition</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <HeroSlot
                  position={1}
                  selectedHero={selectedHeroes[0]}
                  availableHeroes={getAvailableHeroesForSlot(0)}
                  onSelect={(hero) => handleHeroSelect(0, hero)}
                />
                <HeroSlot
                  position={2}
                  selectedHero={selectedHeroes[1]}
                  availableHeroes={getAvailableHeroesForSlot(1)}
                  onSelect={(hero) => handleHeroSelect(1, hero)}
                />
                <HeroSlot
                  position={3}
                  selectedHero={selectedHeroes[2]}
                  availableHeroes={getAvailableHeroesForSlot(2)}
                  onSelect={(hero) => handleHeroSelect(2, hero)}
                />
              </div>
            </div>

            {/* Run Simulation Button */}
            <div className="mb-8 text-center">
              <button
                onClick={runSimulation}
                disabled={!canRunSimulation() || isSimulating}
                className={`px-12 py-4 rounded-lg font-bold text-lg transition-all ${
                  canRunSimulation() && !isSimulating
                    ? 'bg-gradient-to-r from-purple-600 to-amber-600 hover:from-purple-700 hover:to-amber-700 text-white shadow-lg hover:shadow-xl transform hover:scale-105'
                    : 'bg-gray-700 text-gray-400 cursor-not-allowed'
                }`}
              >
                {isSimulating ? (
                  <span className="flex items-center gap-3">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    Running Simulation... {simulationProgress}%
                  </span>
                ) : (
                  'Run 10,000 Simulations'
                )}
              </button>

              {!canRunSimulation() && !isSimulating && (
                <p className="text-gray-400 mt-3 text-sm">
                  Please select a boss and fill all 3 hero slots to run the simulation
                </p>
              )}
            </div>

            {/* Progress Bar */}
            {isSimulating && (
              <div className="mb-8">
                <div className="h-3 bg-gray-700 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-purple-500 to-amber-500 transition-all duration-300"
                    style={{ width: `${simulationProgress}%` }}
                  />
                </div>
              </div>
            )}

            {/* Results */}
            {results && selectedHeroes[0] && selectedHeroes[1] && selectedHeroes[2] && (
              <div className="mb-8">
                <SimulationResults
                  results={results}
                  heroes={[selectedHeroes[0], selectedHeroes[1], selectedHeroes[2]]}
                />
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
