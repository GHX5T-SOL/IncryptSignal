import React, { useState } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { useX402Client } from '../hooks/useX402Client';
import { useNavigate } from 'react-router-dom';
import { AgentCard, AgentStats } from './AgentCard';
import { MOCK_AGENTS } from '../data/agents';
import { Starfield } from './Starfield';
import { WalletButton } from './WalletButton';
import { Footer } from './Footer';
import { SignalResult } from './SignalResult';
import { motion } from 'framer-motion';

const TRADING_PAIRS = ['BTC/USD', 'ETH/USD', 'SOL/USD'];

export interface EnhancedTradingSignal {
  agentId: string;
  agentName: string;
  signal: 'long' | 'short';
  currentPrice: number;
  leverage: number;
  liquidationLevel: number;
  portfolioPercentage: number;
  takeProfit: number;
  stopLoss: number;
  reasoning: string;
  confidence: number;
  timestamp: number;
  symbol: string;
}

export const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const { connected } = useWallet();
  const x402Client = useX402Client();
  const [selectedAgent, setSelectedAgent] = useState<string | null>(null);
  const [selectedAsset, setSelectedAsset] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [signal, setSignal] = useState<EnhancedTradingSignal | null>(null);
  const [receiptHash, setReceiptHash] = useState<string | null>(null);
  const [transactionSignature, setTransactionSignature] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleRequestSignal = async () => {
    if (!connected || !x402Client) {
      setError('Please connect your wallet first');
      return;
    }

    if (!selectedAgent) {
      setError('Please select an AI agent');
      return;
    }

    if (!selectedAsset) {
      setError('Please select a trading pair');
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
        body: JSON.stringify({ 
          symbol: selectedAsset,
          agentId: selectedAgent,
        }),
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
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-b from-[#0a0a0a] via-[#1a1a2e] to-[#0a0a0a]">
      <Starfield />
      <div className="relative z-10">
        {/* Wallet Button */}
        <div className="fixed top-2 right-2 sm:top-4 sm:right-4 z-50">
          <WalletButton />
        </div>

        {/* Header with Back to Home */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 pt-6 sm:pt-8 pb-4">
          <div className="flex items-center justify-between mb-6 sm:mb-8">
            <motion.button
              onClick={() => navigate('/')}
              className="text-neon-cyan hover:text-neon-magenta transition-colors duration-300 flex items-center gap-2 text-sm sm:text-base"
              whileHover={{ x: -5 }}
            >
              <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              <span className="hidden sm:inline">Back to Home</span>
              <span className="sm:hidden">Back</span>
            </motion.button>
            <img 
              src="/logo.png" 
              alt="IncryptSignal Logo" 
              className="h-8 w-8 sm:h-12 sm:w-12 object-contain"
            />
          </div>

          <motion.div
            className="text-center mb-8 sm:mb-12"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold cyberpunk-gradient mb-3 sm:mb-4">
              THE ARENA
            </h1>
            <p className="text-base sm:text-lg md:text-xl text-gray-300 px-4">
              Select your AI agent and trading pair to get real-time signals
            </p>
          </motion.div>
        </div>

        {/* Main Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 pb-8 sm:pb-12 space-y-8 sm:space-y-12">
          {/* Agent Selection */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <h2 className="text-2xl sm:text-3xl font-bold text-neon-magenta mb-4 sm:mb-6 font-cyberpunk px-2">
              Select Your AI Agent
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 mb-6 sm:mb-8">
              {MOCK_AGENTS.map((agent) => (
                <AgentCard
                  key={agent.agentId}
                  agent={agent}
                  isSelected={selectedAgent === agent.agentId}
                  onSelect={setSelectedAgent}
                />
              ))}
            </div>
          </motion.section>

          {/* Asset Selection & Request */}
          {connected && (
            <motion.section
              className="liquid-glass rounded-lg p-4 sm:p-6 md:p-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <h2 className="text-xl sm:text-2xl font-bold text-neon-cyan mb-4 sm:mb-6 font-cyberpunk">
                Request Trading Signal
              </h2>
              
              <div className="space-y-6">
                {/* Asset Selection */}
                <div>
                  <label className="block text-gray-300 mb-2 font-semibold">
                    Select Trading Pair
                  </label>
                  <select
                    value={selectedAsset}
                    onChange={(e) => setSelectedAsset(e.target.value)}
                    className="w-full bg-dark-panel border-2 border-neon-cyan rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-neon-magenta"
                  >
                    <option value="">Choose an asset...</option>
                    {TRADING_PAIRS.map((pair) => (
                      <option key={pair} value={pair}>
                        {pair}
                      </option>
                    ))}
                  </select>
                  <p className="text-gray-400 text-sm mt-2">
                    More assets coming soon
                  </p>
                </div>

                {/* Request Button */}
                <button
                  onClick={handleRequestSignal}
                  disabled={!selectedAgent || !selectedAsset || isLoading}
                  className="cyberpunk-button w-full py-3 sm:py-4 text-base sm:text-lg disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? 'Processing...' : 'Request Signal'}
                </button>

                {/* Error Display */}
                {error && (
                  <motion.div
                    className="liquid-glass rounded-lg p-4 border-2 border-red-500"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                  >
                    <p className="text-red-400">{error}</p>
                  </motion.div>
                )}
              </div>
            </motion.section>
          )}

          {/* Signal Result */}
          {signal && (
            <SignalResult
              signal={signal}
              receiptHash={receiptHash}
              transactionSignature={transactionSignature}
            />
          )}

          {/* Connect Wallet Prompt */}
          {!connected && (
            <motion.div
              className="liquid-glass rounded-lg p-8 text-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <p className="text-neon-cyan neon-glow text-xl mb-4">
                Connect your wallet to start receiving trading signals
              </p>
            </motion.div>
          )}

          {/* Footer */}
          <Footer />
        </div>
      </div>
    </div>
  );
};
