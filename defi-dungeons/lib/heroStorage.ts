// heroStorage.ts - LocalStorage utility for hero management

import { Hero } from './simulator/types';

const STORAGE_KEY = 'defi_dungeons_heroes';

export function saveHero(hero: Hero): void {
  const heroes = getAllHeroes();
  const existingIndex = heroes.findIndex(h => h.id === hero.id);

  if (existingIndex >= 0) {
    heroes[existingIndex] = hero;
  } else {
    heroes.push(hero);
  }

  localStorage.setItem(STORAGE_KEY, JSON.stringify(heroes));
}

export function getAllHeroes(): Hero[] {
  if (typeof window === 'undefined') return [];

  const stored = localStorage.getItem(STORAGE_KEY);
  if (!stored) return [];

  try {
    return JSON.parse(stored);
  } catch {
    return [];
  }
}

export function getHeroById(id: string): Hero | null {
  const heroes = getAllHeroes();
  return heroes.find(h => h.id === id) || null;
}

export function deleteHero(id: string): void {
  const heroes = getAllHeroes();
  const filtered = heroes.filter(h => h.id !== id);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
}

export function generateHeroId(): string {
  return `hero_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}
