import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Starfield } from './Starfield';
import { Footer } from './Footer';

export const HomePage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-b from-[#0a0a0a] via-[#1a1a2e] to-[#0a0a0a]">
      <Starfield />
      
      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 md:px-8 py-12 md:py-20">
        {/* Header */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <div className="flex items-center justify-center gap-4 mb-6">
            <img
              src="/logo.png"
              alt="IncryptSignal Logo"
              className="h-20 w-20 object-contain"
            />
            <h1 className="text-6xl md:text-7xl font-bold cyberpunk-gradient">
              INCryptSignal
            </h1>
          </div>
          <p className="text-xl md:text-2xl text-gray-300 neon-glow mb-4">
            AI-Powered Trading Signals for Leveraged Perpetual Trading
          </p>
          <p className="text-base md:text-lg text-gray-400 max-w-2xl mx-auto">
            Advanced AI agents trained with real-time market data, technical analysis, and fundamental insights
          </p>
        </motion.div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          <motion.div
            className="liquid-glass rounded-lg p-6 hover:scale-105 transition-transform duration-300"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
          >
            <div className="text-4xl mb-4">🤖</div>
            <h3 className="text-2xl font-bold text-neon-magenta mb-3">
              AI Trading Agents
            </h3>
            <p className="text-gray-300 leading-relaxed">
              Three specialized AI agents: Zyra (High Risk), Aria (Medium Risk), and Nova (Low Risk). Each trained with access to real-time news feeds, price charts, and market indicators.
            </p>
          </motion.div>

          <motion.div
            className="liquid-glass rounded-lg p-6 hover:scale-105 transition-transform duration-300"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
          >
            <div className="text-4xl mb-4">📊</div>
            <h3 className="text-2xl font-bold text-neon-cyan mb-3">
              Real-Time Analysis
            </h3>
            <p className="text-gray-300 leading-relaxed">
              Comprehensive technical and fundamental analysis including RSI, MACD, long/short ratios, liquidation heatmaps, and fear & greed indices.
            </p>
          </motion.div>

          <motion.div
            className="liquid-glass rounded-lg p-6 hover:scale-105 transition-transform duration-300"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.6 }}
          >
            <div className="text-4xl mb-4">⚡</div>
            <h3 className="text-2xl font-bold text-neon-magenta mb-3">
              Leverage Trading
            </h3>
            <p className="text-gray-300 leading-relaxed">
              Get precise leverage recommendations (up to 100x), liquidation levels, portfolio allocation, take profit and stop loss targets with AI-generated reasoning.
            </p>
          </motion.div>
        </div>

        {/* How It Works */}
        <motion.div
          className="liquid-glass rounded-lg p-8 md:p-12 mb-16"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8, duration: 0.6 }}
        >
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-8 cyberpunk-gradient">
            How It Works
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-neon-magenta to-neon-cyan flex items-center justify-center text-2xl font-bold">
                1
              </div>
              <h4 className="text-xl font-semibold text-neon-cyan mb-2">Choose Agent</h4>
              <p className="text-gray-300 text-sm">
                Select from Zyra, Aria, or Nova based on your risk tolerance
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-neon-magenta to-neon-cyan flex items-center justify-center text-2xl font-bold">
                2
              </div>
              <h4 className="text-xl font-semibold text-neon-cyan mb-2">Select Asset</h4>
              <p className="text-gray-300 text-sm">
                Choose BTC/USD, ETH/USD, or SOL/USD
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-neon-magenta to-neon-cyan flex items-center justify-center text-2xl font-bold">
                3
              </div>
              <h4 className="text-xl font-semibold text-neon-cyan mb-2">Pay & Analyze</h4>
              <p className="text-gray-300 text-sm">
                Make micropayment via Solana x402 protocol
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-neon-magenta to-neon-cyan flex items-center justify-center text-2xl font-bold">
                4
              </div>
              <h4 className="text-xl font-semibold text-neon-cyan mb-2">Get Signal</h4>
              <p className="text-gray-300 text-sm">
                Receive AI-generated trading signal with full analysis
              </p>
            </div>
          </div>
        </motion.div>

        {/* CTA Button */}
        <motion.div
          className="text-center"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 1, duration: 0.6 }}
        >
          <button
            onClick={() => navigate('/arena')}
            className="cyberpunk-button text-2xl md:text-3xl px-12 py-6 rounded-lg font-bold neon-pulse"
          >
            Enter the Arena
          </button>
        </motion.div>

        {/* Footer */}
        <div className="mt-24">
          <Footer />
        </div>
      </div>
    </div>
  );
};

