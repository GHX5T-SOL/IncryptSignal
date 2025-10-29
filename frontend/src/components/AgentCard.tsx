import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';

export interface AgentStats {
  agentId: string;
  agentName: string;
  riskLevel: 'high' | 'medium' | 'low';
  tradingStyle: string;
  roi7d: number;
  roi30d: number;
  roi90d: number;
  maxDrawdown: number;
  avgGainPerTrade: number;
  avgLossPerTrade: number;
  biggestWin: number;
  biggestLoss: number;
}

interface AgentCardProps {
  agent: AgentStats;
  isSelected: boolean;
  onSelect: (agentId: string) => void;
}

export const AgentCard: React.FC<AgentCardProps> = ({ agent, isSelected, onSelect }) => {
  const [videoError, setVideoError] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    // Ensure video plays and loops
    if (videoRef.current && !videoError) {
      videoRef.current.play().catch(() => {
        // Auto-play failed, will try again on user interaction
      });
    }
  }, [videoError]);

  const handleVideoError = () => {
    setVideoError(true);
  };

  const riskColors = {
    high: 'text-red-400 border-red-500',
    medium: 'text-yellow-400 border-yellow-500',
    low: 'text-green-400 border-green-500',
  };

  const riskBadges = {
    high: 'HIGH RISK',
    medium: 'MEDIUM RISK',
    low: 'LOW RISK',
  };

  return (
    <motion.div
      className={`holographic-card rounded-lg overflow-hidden cursor-pointer transition-all duration-300 ${
        isSelected ? 'ring-4 ring-neon-magenta scale-105' : 'hover:scale-102'
      }`}
      onClick={() => onSelect(agent.agentId)}
      whileHover={{ y: -5 }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      {/* Video/Image Header */}
      <div className="relative w-full h-48 bg-black overflow-hidden">
        {!videoError ? (
          <video
            ref={videoRef}
            className="w-full h-full object-cover object-top"
            autoPlay
            loop
            muted
            playsInline
            preload="auto"
            onError={handleVideoError}
          >
            <source src={`/trading agent's media/${agent.agentId}.mp4`} type="video/mp4" />
          </video>
        ) : (
          <img
            src={`/trading agent's media/${agent.agentId}.png`}
            alt={agent.agentName}
            className="w-full h-full object-cover object-top"
            onError={() => console.error(`Failed to load image for ${agent.agentId}`)}
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent" />
        <div className="absolute top-4 left-4">
          <span className={`px-3 py-1 rounded-full text-xs font-bold border-2 ${riskColors[agent.riskLevel]}`}>
            {riskBadges[agent.riskLevel]}
          </span>
        </div>
      </div>

      {/* Agent Info */}
      <div className="p-6">
        <h3 className="text-2xl font-bold text-neon-magenta mb-2 font-cyberpunk">
          {agent.agentName}
        </h3>
        <p className="text-gray-300 text-sm mb-4">{agent.tradingStyle}</p>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="liquid-glass rounded p-3">
            <p className="text-xs text-gray-400 mb-1">7D ROI</p>
            <p className={`text-lg font-bold ${agent.roi7d >= 0 ? 'text-green-400' : 'text-red-400'}`}>
              {agent.roi7d >= 0 ? '+' : ''}{agent.roi7d.toFixed(2)}%
            </p>
          </div>
          <div className="liquid-glass rounded p-3">
            <p className="text-xs text-gray-400 mb-1">30D ROI</p>
            <p className={`text-lg font-bold ${agent.roi30d >= 0 ? 'text-green-400' : 'text-red-400'}`}>
              {agent.roi30d >= 0 ? '+' : ''}{agent.roi30d.toFixed(2)}%
            </p>
          </div>
          <div className="liquid-glass rounded p-3">
            <p className="text-xs text-gray-400 mb-1">90D ROI</p>
            <p className={`text-lg font-bold ${agent.roi90d >= 0 ? 'text-green-400' : 'text-red-400'}`}>
              {agent.roi90d >= 0 ? '+' : ''}{agent.roi90d.toFixed(2)}%
            </p>
          </div>
          <div className="liquid-glass rounded p-3">
            <p className="text-xs text-gray-400 mb-1">Max Drawdown</p>
            <p className="text-lg font-bold text-red-400">
              {agent.maxDrawdown.toFixed(2)}%
            </p>
          </div>
        </div>

        {/* Additional Stats */}
        <div className="space-y-2 text-xs text-gray-400">
          <div className="flex justify-between">
            <span>Avg Gain:</span>
            <span className="text-green-400 font-semibold">+{agent.avgGainPerTrade.toFixed(2)}%</span>
          </div>
          <div className="flex justify-between">
            <span>Avg Loss:</span>
            <span className="text-red-400 font-semibold">{agent.avgLossPerTrade.toFixed(2)}%</span>
          </div>
          <div className="flex justify-between">
            <span>Biggest Win:</span>
            <span className="text-green-400 font-semibold">+{agent.biggestWin.toFixed(2)}%</span>
          </div>
          <div className="flex justify-between">
            <span>Biggest Loss:</span>
            <span className="text-red-400 font-semibold">{agent.biggestLoss.toFixed(2)}%</span>
          </div>
        </div>

        {isSelected && (
          <motion.div
            className="mt-4 text-center py-2 bg-gradient-to-r from-neon-magenta to-neon-cyan rounded"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <span className="text-black font-bold">SELECTED</span>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
};

