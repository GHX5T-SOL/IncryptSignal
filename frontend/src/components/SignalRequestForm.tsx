import React, { useState } from 'react';
import { motion } from 'framer-motion';

interface SignalRequestFormProps {
  onRequestSignal: (symbol: string) => Promise<void>;
  isLoading: boolean;
}

export const SignalRequestForm: React.FC<SignalRequestFormProps> = ({
  onRequestSignal,
  isLoading,
}) => {
  const [symbol, setSymbol] = useState('BTC/USD');
  const availablePairs = ['BTC/USD', 'ETH/USD', 'SOL/USD'];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (symbol && !isLoading) {
      await onRequestSignal(symbol);
    }
  };

  return (
    <motion.form
      onSubmit={handleSubmit}
      className="holographic rounded-lg p-6 space-y-4"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div>
        <label className="block text-neon-cyan mb-2 neon-glow font-bold">
          Trading Pair
        </label>
        <select
          value={symbol}
          onChange={(e) => setSymbol(e.target.value)}
          className="w-full bg-dark-panel border border-neon-cyan rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-neon-cyan focus:border-transparent hover:border-neon-magenta transition-all"
          disabled={isLoading}
        >
          {availablePairs.map((pair) => (
            <option key={pair} value={pair} className="bg-dark-panel">
              {pair}
            </option>
          ))}
        </select>
      </div>

      <motion.button
        type="submit"
        disabled={isLoading || !symbol}
        className="w-full bg-gradient-to-r from-neon-cyan to-neon-magenta text-black font-bold py-3 px-6 rounded-lg hover:shadow-neon-cyan transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed glitch"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        {isLoading ? (
          <span className="flex items-center justify-center">
            <span className="animate-spin mr-2">⚡</span>
            Processing Payment...
          </span>
        ) : (
          <span className="flex items-center justify-center">
            <span className="mr-2">🔮</span>
            Get Signal ($0.01 USDC)
          </span>
        )}
      </motion.button>

      <p className="text-xs text-gray-400 text-center">
        Payment will be processed automatically via x402 protocol
      </p>
    </motion.form>
  );
};

