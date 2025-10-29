import React, { useState } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { useX402Client } from '../hooks/useX402Client';
import { SignalRequestForm } from './SignalRequestForm';
import { SignalCard, TradingSignal } from './SignalCard';
import { ReputationLeaderboard } from './ReputationLeaderboard';
import { motion } from 'framer-motion';

export const Dashboard: React.FC = () => {
  const { connected } = useWallet();
  const x402Client = useX402Client();
  const [isLoading, setIsLoading] = useState(false);
  const [signal, setSignal] = useState<TradingSignal | null>(null);
  const [receiptHash, setReceiptHash] = useState<string | null>(null);
  const [transactionSignature, setTransactionSignature] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleRequestSignal = async (symbol: string) => {
    if (!connected || !x402Client) {
      setError('Please connect your wallet first');
      return;
    }

    setIsLoading(true);
    setError(null);
    setSignal(null);

    try {
      const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:3001';
      
      // Use x402 client to make payment-protected request
      const response = await x402Client.fetch(`${apiUrl}/api/signals`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ symbol }),
      });

      if (!response.ok) {
        throw new Error(`Request failed: ${response.status}`);
      }

      const data = await response.json();

      if (data.success && data.data) {
        setSignal(data.data.signal);
        setReceiptHash(data.data.receipt?.hash || null);
        setTransactionSignature(data.data.receipt?.transactionSignature || null);
      } else {
        throw new Error(data.error || 'Unknown error');
      }
    } catch (err: any) {
      console.error('Error requesting signal:', err);
      setError(err.message || 'Failed to request signal. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-dark-bg p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <motion.div
          className="text-center"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="flex items-center justify-center gap-4 mb-4">
            <img 
              src={`${process.env.PUBLIC_URL || ''}/logo.png`} 
              alt="IncryptSignal Logo" 
              className="h-16 w-16 object-contain"
            />
            <h1 className="text-5xl font-bold neon-glow">
              INCryptSignal
            </h1>
          </div>
          <p className="text-xl text-gray-400">
            Trustless AI Agent Trading Signals on Solana
          </p>
        </motion.div>

        {!connected && (
          <motion.div
            className="holographic rounded-lg p-6 text-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <p className="text-neon-cyan neon-glow text-xl">
              Connect your wallet to start receiving trading signals
            </p>
          </motion.div>
        )}

        {connected && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Signal Request Section */}
            <div className="space-y-6">
              <SignalRequestForm
                onRequestSignal={handleRequestSignal}
                isLoading={isLoading}
              />

              {error && (
                <motion.div
                  className="holographic rounded-lg p-4 border border-red-500"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                >
                  <p className="text-red-400">{error}</p>
                </motion.div>
              )}

              {signal && (
                <SignalCard
                  signal={signal}
                  receiptHash={receiptHash || undefined}
                  transactionSignature={transactionSignature || undefined}
                />
              )}
            </div>

            {/* Leaderboard Section */}
            <div>
              <ReputationLeaderboard />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

