'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export const Navigation = () => {
  const pathname = usePathname();

  const links = [
    { href: '/', label: 'NFT Gallery' },
    { href: '/heroes', label: 'My Heroes' },
  ];

  return (
    <nav className="flex gap-4">
      {links.map(({ href, label }) => (
        <Link
          key={href}
          href={href}
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
            pathname === href
              ? 'bg-amber-600 text-white'
              : 'bg-gray-800 text-gray-300 hover:bg-gray-700 hover:text-white'
          }`}
        >
          {label}
        </Link>
      ))}
    </nav>
  );
};
