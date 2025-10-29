import React from 'react';
import { motion } from 'framer-motion';

export interface TradingSignal {
  signal: 'long' | 'short' | 'neutral';
  confidence: number;
  price: number;
  priceDelta: number | null;
  previousPrice: number | null;
  symbol: string;
  timestamp: number;
  reasoning: string;
}

interface SignalCardProps {
  signal: TradingSignal;
  receiptHash?: string;
  transactionSignature?: string;
}

export const SignalCard: React.FC<SignalCardProps> = ({
  signal,
  receiptHash,
  transactionSignature,
}) => {
  const getSignalColor = () => {
    if (signal.signal === 'long') return 'neon-cyan';
    if (signal.signal === 'short') return 'neon-magenta';
    return 'gray-400';
  };

  const getSignalIcon = () => {
    if (signal.signal === 'long') return '📈';
    if (signal.signal === 'short') return '📉';
    return '➡️';
  };

  return (
    <motion.div
      className="holographic rounded-lg p-6 space-y-4 glitch"
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      whileHover={{ scale: 1.02 }}
    >
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-2xl font-bold text-neon-cyan neon-glow">
            {signal.symbol}
          </h3>
          <p className="text-sm text-gray-400 mt-1">
            {new Date(signal.timestamp).toLocaleString()}
          </p>
        </div>
        <div className={`text-4xl ${getSignalColor() === 'neon-cyan' ? 'neon-glow' : 'neon-magenta'}`}>
          {getSignalIcon()}
        </div>
      </div>

      <div className="flex items-center space-x-4">
        <div className="flex-1">
          <div className="text-sm text-gray-400">Signal</div>
          <div className={`text-2xl font-bold ${
            getSignalColor() === 'neon-cyan' ? 'text-neon-cyan' : 
            getSignalColor() === 'neon-magenta' ? 'text-neon-magenta' : 
            'text-gray-400'
          }`}>
            {signal.signal.toUpperCase()}
          </div>
        </div>
        <div className="flex-1">
          <div className="text-sm text-gray-400">Confidence</div>
          <div className="text-2xl font-bold text-neon-cyan">
            {(signal.confidence * 100).toFixed(1)}%
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 pt-4 border-t border-neon-cyan/30">
        <div>
          <div className="text-sm text-gray-400">Current Price</div>
          <div className="text-lg font-bold text-neon-cyan">
            ${signal.price.toFixed(2)}
          </div>
        </div>
        {signal.priceDelta !== null && (
          <div>
            <div className="text-sm text-gray-400">Delta</div>
            <div
              className={`text-lg font-bold ${
                signal.priceDelta < 0 ? 'text-neon-cyan' : 'text-neon-magenta'
              }`}
            >
              {signal.priceDelta > 0 ? '+' : ''}
              {signal.priceDelta.toFixed(4)}
            </div>
          </div>
        )}
      </div>

      <div className="pt-4 border-t border-neon-cyan/30">
        <div className="text-sm text-gray-400 mb-2">Reasoning</div>
        <p className="text-sm text-gray-300">{signal.reasoning}</p>
      </div>

      {receiptHash && (
        <div className="pt-4 border-t border-neon-cyan/30">
          <div className="text-xs text-gray-400 mb-1">Receipt Hash</div>
          <div className="text-xs font-mono text-neon-cyan break-all">
            {receiptHash}
          </div>
        </div>
      )}

      {transactionSignature && (
        <div className="pt-2">
          <div className="text-xs text-gray-400 mb-1">Transaction</div>
          <a
            href={`https://solscan.io/tx/${transactionSignature}?cluster=devnet`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs font-mono text-neon-magenta hover:underline break-all"
          >
            {transactionSignature.slice(0, 20)}...
          </a>
        </div>
      )}
    </motion.div>
  );
};

