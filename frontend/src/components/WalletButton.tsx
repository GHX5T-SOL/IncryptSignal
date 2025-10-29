import React from 'react';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import '@solana/wallet-adapter-react-ui/styles.css';

export const WalletButton: React.FC = () => {
  return (
    <div className="fixed top-2 right-2 sm:top-4 sm:right-4 z-50">
      <div className="holographic rounded-lg p-1">
        <WalletMultiButton className="!bg-dark-panel !text-neon-cyan hover:!text-neon-magenta !border !border-neon-cyan hover:!border-neon-magenta !transition-all !duration-300 !text-xs sm:!text-sm" />
      </div>
    </div>
  );
};

