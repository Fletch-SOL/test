'use client';

import { useWallet } from '@solana/wallet-adapter-react';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';

export const WalletConnectButton = () => {
  return (
    <div className="flex justify-end">
      <WalletMultiButton className="!bg-purple-600 hover:!bg-purple-700 transition-colors" />
    </div>
  );
};
