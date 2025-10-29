import { useMemo } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { createX402Client } from '@payai/x402-solana/client';

export function useX402Client() {
  const wallet = useWallet();

  const x402Client = useMemo(() => {
    if (!wallet.publicKey || !wallet.signTransaction) {
      return null;
    }

    // Create wallet adapter interface for PayAI
    const walletAdapter = {
      address: wallet.publicKey.toBase58(),
      signTransaction: wallet.signTransaction,
    };

    try {
      return createX402Client({
        wallet: walletAdapter as any,
        network: (process.env.REACT_APP_NETWORK === 'mainnet' ? 'solana' : 'solana-devnet') as 'solana' | 'solana-devnet',
        maxPaymentAmount: BigInt(1_000_000_000), // Max 1000 USDC
      });
    } catch (error) {
      console.error('Error creating x402 client:', error);
      return null;
    }
  }, [wallet.publicKey, wallet.signTransaction]);

  return x402Client;
}

