import { HeroForm } from '@/components/hero-builder/HeroForm';

export default function NewHeroPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black p-8">
      <HeroForm mode="create" />
    </div>
  );
}
