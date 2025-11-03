'use client';

import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import { useEffect, useState } from 'react';
import { fetchWalletNFTs } from '@/lib/fetchNFTs';
import { HeroNFT } from '@/lib/types';
import { NFTCard } from './NFTCard';

export const NFTGallery = () => {
  const { connection } = useConnection();
  const { publicKey, connected } = useWallet();
  const [nfts, setNfts] = useState<HeroNFT[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadNFTs = async () => {
      if (!connected || !publicKey) {
        setNfts([]);
        setError(null);
        return;
      }

      setLoading(true);
      setError(null);

      try {
        const fetchedNFTs = await fetchWalletNFTs(
          publicKey.toString(),
          connection
        );
        setNfts(fetchedNFTs);
      } catch (err) {
        console.error('Error loading NFTs:', err);
        setError('Failed to load NFTs. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    loadNFTs();
  }, [connected, publicKey, connection]);

  if (!connected) {
    return (
      <div className="text-center py-16">
        <div className="bg-gray-800 inline-block p-8 rounded-lg border border-gray-700">
          <h2 className="text-2xl font-bold text-white mb-2">
            Connect Your Wallet
          </h2>
          <p className="text-gray-400">
            Connect your wallet to view your Hero NFTs
          </p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="text-center py-16">
        <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500"></div>
        <p className="text-gray-400 mt-4">Loading your Hero NFTs...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-16">
        <div className="bg-red-900/20 border border-red-700 inline-block p-8 rounded-lg">
          <h2 className="text-xl font-bold text-red-400 mb-2">Error</h2>
          <p className="text-gray-300">{error}</p>
        </div>
      </div>
    );
  }

  if (nfts.length === 0) {
    return (
      <div className="text-center py-16">
        <div className="bg-gray-800 inline-block p-8 rounded-lg border border-gray-700">
          <h2 className="text-2xl font-bold text-white mb-2">
            No NFTs Found
          </h2>
          <p className="text-gray-400">
            This wallet doesn&apos;t have any NFTs yet
          </p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-white">
          Your Hero Collection ({nfts.length})
        </h2>
        <p className="text-gray-400">
          Connected to {publicKey?.toString().slice(0, 4)}...
          {publicKey?.toString().slice(-4)}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {nfts.map((nft) => (
          <NFTCard key={nft.mint} nft={nft} />
        ))}
      </div>
    </div>
  );
};
