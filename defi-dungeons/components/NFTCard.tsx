'use client';

import { HeroNFT } from '@/lib/types';
import Image from 'next/image';

interface NFTCardProps {
  nft: HeroNFT;
}

export const NFTCard = ({ nft }: NFTCardProps) => {
  return (
    <div className="bg-gray-800 rounded-lg overflow-hidden shadow-lg hover:shadow-2xl transition-shadow border border-gray-700">
      <div className="relative w-full h-64 bg-gray-900">
        {nft.image ? (
          <Image
            src={nft.image}
            alt={nft.name}
            fill
            className="object-cover"
            unoptimized // For IPFS and external images
          />
        ) : (
          <div className="flex items-center justify-center h-full text-gray-500">
            No Image
          </div>
        )}
      </div>

      <div className="p-4">
        <h3 className="text-xl font-bold text-white mb-2">{nft.name}</h3>

        {nft.description && (
          <p className="text-gray-400 text-sm mb-3 line-clamp-2">
            {nft.description}
          </p>
        )}

        {nft.attributes && nft.attributes.length > 0 && (
          <div className="space-y-1">
            <h4 className="text-sm font-semibold text-gray-300">Attributes:</h4>
            <div className="flex flex-wrap gap-2">
              {nft.attributes.slice(0, 3).map((attr, index) => (
                <div
                  key={index}
                  className="bg-gray-700 px-2 py-1 rounded text-xs"
                >
                  <span className="text-gray-400">{attr.trait_type}:</span>{' '}
                  <span className="text-white font-semibold">{attr.value}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="mt-3 pt-3 border-t border-gray-700">
          <p className="text-xs text-gray-500 truncate">
            Mint: {nft.mint}
          </p>
        </div>
      </div>
    </div>
  );
};
