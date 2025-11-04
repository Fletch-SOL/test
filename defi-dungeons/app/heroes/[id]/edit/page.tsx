'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { HeroForm } from '@/components/hero-builder/HeroForm';
import { getHeroById } from '@/lib/heroStorage';
import { Hero } from '@/lib/simulator/types';

export default function EditHeroPage() {
  const params = useParams();
  const router = useRouter();
  const [hero, setHero] = useState<Hero | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const heroId = params.id as string;
    const foundHero = getHeroById(heroId);

    if (!foundHero) {
      router.push('/heroes');
      return;
    }

    setHero(foundHero);
    setLoading(false);
  }, [params.id, router]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black p-8 flex items-center justify-center">
        <div className="text-white">Loading...</div>
      </div>
    );
  }

  if (!hero) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black p-8">
      <HeroForm mode="edit" initialHero={hero} />
    </div>
  );
}
