import { WalletConnectButton } from '@/components/WalletConnectButton';
import { NFTGallery } from '@/components/NFTGallery';

export default function Home() {
  return (
    <div className="min-h-screen p-8 bg-gradient-to-b from-gray-900 to-black">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <WalletConnectButton />
        </div>

        <header className="text-center mb-12">
          <h1 className="text-5xl font-bold bg-gradient-to-r from-purple-400 to-pink-600 bg-clip-text text-transparent mb-4">
            DeFi Dungeons
          </h1>
          <p className="text-gray-400 text-lg">
            Discover and manage your Hero NFTs on Solana
          </p>
        </header>

        <main>
          <NFTGallery />
        </main>
      </div>
    </div>
  );
}
