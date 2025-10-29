import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

interface AgentReputation {
  agentId: string;
  successes: number;
  failures: number;
  totalRequests: number;
  reputationScore: number;
  lastActivity: number;
}

export const ReputationLeaderboard: React.FC = () => {
  const [leaderboard, setLeaderboard] = useState<AgentReputation[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLeaderboard();
    const interval = setInterval(fetchLeaderboard, 10000); // Refresh every 10s
    return () => clearInterval(interval);
  }, []);

  const fetchLeaderboard = async () => {
    try {
      const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:3001';
      const response = await fetch(`${apiUrl}/api/reputation/leaderboard?limit=10`);
      const data = await response.json();
      
      if (data.success) {
        setLeaderboard(data.data);
      }
    } catch (error) {
      console.error('Error fetching leaderboard:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="holographic rounded-lg p-6">
        <div className="text-center text-neon-cyan">Loading leaderboard...</div>
      </div>
    );
  }

  return (
    <motion.div
      className="holographic rounded-lg p-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <h2 className="text-2xl font-bold text-neon-cyan neon-glow mb-4">
        Agent Reputation Leaderboard
      </h2>

      {leaderboard.length === 0 ? (
        <div className="text-center text-gray-400 py-8">
          No agent activity yet
        </div>
      ) : (
        <div className="space-y-2">
          {leaderboard.map((agent, index) => (
            <motion.div
              key={agent.agentId}
              className="flex items-center justify-between p-4 bg-dark-panel rounded-lg border border-neon-cyan/30 hover:border-neon-cyan transition-all"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <div className="flex items-center space-x-4">
                <div className="text-2xl font-bold text-neon-cyan w-8">
                  #{index + 1}
                </div>
                <div>
                  <div className="text-sm font-mono text-gray-400">
                    {agent.agentId.slice(0, 8)}...{agent.agentId.slice(-8)}
                  </div>
                  <div className="text-xs text-gray-500">
                    {agent.totalRequests} requests
                  </div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-lg font-bold text-neon-cyan">
                  {(agent.reputationScore * 100).toFixed(1)}%
                </div>
                <div className="text-xs text-gray-400">
                  {agent.successes} success / {agent.failures} fail
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </motion.div>
  );
};

