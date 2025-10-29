import React from 'react';
import { motion } from 'framer-motion';
import { EnhancedTradingSignal } from './Dashboard';

interface SignalResultProps {
  signal: EnhancedTradingSignal;
  receiptHash?: string | null;
  transactionSignature?: string | null;
}

export const SignalResult: React.FC<SignalResultProps> = ({
  signal,
  receiptHash,
  transactionSignature,
}) => {
  const isLong = signal.signal === 'long';
  const signalColor = isLong ? 'text-green-400' : 'text-red-400';
  const signalBg = isLong ? 'bg-green-500/20' : 'bg-red-500/20';
  const signalBorder = isLong ? 'border-green-500' : 'border-red-500';

  return (
    <motion.div
      className="holographic-card rounded-lg p-8 space-y-6"
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
    >
      {/* Header */}
      <div className="text-center">
        <div className="flex items-center justify-center gap-4 mb-4">
          <div className={`px-6 py-3 rounded-lg ${signalBg} border-2 ${signalBorder}`}>
            <h2 className={`text-4xl font-bold ${signalColor} font-cyberpunk`}>
              {signal.signal.toUpperCase()}
            </h2>
          </div>
        </div>
        <p className="text-gray-300">
          {signal.agentName} • {signal.symbol} • {new Date(signal.timestamp).toLocaleString()}
        </p>
        <p className="text-neon-cyan text-sm mt-2">
          Confidence: {(signal.confidence * 100).toFixed(1)}%
        </p>
      </div>

      {/* Key Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="liquid-glass rounded-lg p-4">
          <p className="text-xs text-gray-400 mb-2">Current Price</p>
          <p className="text-2xl font-bold text-white">${signal.currentPrice.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
        </div>

        <div className="liquid-glass rounded-lg p-4">
          <p className="text-xs text-gray-400 mb-2">Recommended Leverage</p>
          <p className="text-2xl font-bold text-neon-magenta">{signal.leverage}x</p>
        </div>

        <div className="liquid-glass rounded-lg p-4">
          <p className="text-xs text-gray-400 mb-2">Portfolio Allocation</p>
          <p className="text-2xl font-bold text-neon-cyan">{signal.portfolioPercentage}%</p>
        </div>

        <div className="liquid-glass rounded-lg p-4">
          <p className="text-xs text-gray-400 mb-2">Liquidation Level</p>
          <p className="text-2xl font-bold text-red-400">${signal.liquidationLevel.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
        </div>
      </div>

      {/* Take Profit & Stop Loss */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className={`liquid-glass rounded-lg p-6 border-2 border-green-500`}>
          <div className="flex items-center gap-3 mb-2">
            <span className="text-2xl">🎯</span>
            <h3 className="text-xl font-bold text-green-400">Take Profit</h3>
          </div>
          <p className="text-3xl font-bold text-green-400">
            ${signal.takeProfit.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </p>
          <p className="text-gray-400 text-sm mt-2">
            {((signal.takeProfit / signal.currentPrice - 1) * 100).toFixed(2)}% from entry
          </p>
        </div>

        <div className={`liquid-glass rounded-lg p-6 border-2 border-red-500`}>
          <div className="flex items-center gap-3 mb-2">
            <span className="text-2xl">🛑</span>
            <h3 className="text-xl font-bold text-red-400">Stop Loss</h3>
          </div>
          <p className="text-3xl font-bold text-red-400">
            ${signal.stopLoss.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </p>
          <p className="text-gray-400 text-sm mt-2">
            {((signal.stopLoss / signal.currentPrice - 1) * 100).toFixed(2)}% from entry
          </p>
        </div>
      </div>

      {/* Analysis & Reasoning */}
      <div className="liquid-glass rounded-lg p-6">
        <h3 className="text-xl font-bold text-neon-cyan mb-4 font-cyberpunk">
          AI Analysis & Reasoning
        </h3>
        <div className="prose prose-invert max-w-none">
          <p className="text-gray-300 leading-relaxed whitespace-pre-wrap">
            {signal.reasoning}
          </p>
        </div>
      </div>

      {/* Receipt Info */}
      {(receiptHash || transactionSignature) && (
        <div className="liquid-glass rounded-lg p-4 border border-neon-cyan">
          <h4 className="text-sm font-semibold text-neon-cyan mb-2">Transaction Receipt</h4>
          <div className="space-y-2 text-xs">
            {receiptHash && (
              <div>
                <span className="text-gray-400">Receipt Hash: </span>
                <code className="text-neon-magenta">{receiptHash}</code>
              </div>
            )}
            {transactionSignature && (
              <div>
                <span className="text-gray-400">Transaction: </span>
                <a
                  href={`https://solscan.io/tx/${transactionSignature}?cluster=devnet`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-neon-cyan hover:text-neon-magenta underline break-all"
                >
                  {transactionSignature.slice(0, 20)}...
                </a>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Warning */}
      <div className="liquid-glass rounded-lg p-4 border-2 border-yellow-500 bg-yellow-500/10">
        <p className="text-yellow-400 text-sm">
          ⚠️ <strong>Risk Warning:</strong> Leveraged trading carries significant risk. The liquidation level shown is based on current market conditions and may change. Trade responsibly and only risk what you can afford to lose.
        </p>
      </div>
    </motion.div>
  );
};

