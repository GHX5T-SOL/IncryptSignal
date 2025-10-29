export interface AgentReputation {
  agentId: string;
  successes: number;
  failures: number;
  totalRequests: number;
  reputationScore: number;
  lastActivity: number;
}

class ReputationService {
  // In-memory storage for demo (in production, use database or on-chain)
  private reputations: Map<string, AgentReputation> = new Map();

  /**
   * Update reputation after signal delivery
   */
  updateReputation(agentId: string, success: boolean): AgentReputation {
    let reputation = this.reputations.get(agentId);

    if (!reputation) {
      reputation = {
        agentId,
        successes: 0,
        failures: 0,
        totalRequests: 0,
        reputationScore: 0.5, // Start with neutral score
        lastActivity: Date.now(),
      };
    }

    reputation.totalRequests += 1;
    if (success) {
      reputation.successes += 1;
    } else {
      reputation.failures += 1;
    }

    // Calculate reputation score (success rate)
    reputation.reputationScore = reputation.successes / reputation.totalRequests;
    reputation.lastActivity = Date.now();

    this.reputations.set(agentId, reputation);
    return reputation;
  }

  /**
   * Get reputation for an agent
   */
  getReputation(agentId: string): AgentReputation | null {
    return this.reputations.get(agentId) || null;
  }

  /**
   * Get leaderboard (top agents by reputation score)
   */
  getLeaderboard(limit: number = 10): AgentReputation[] {
    const allReputations = Array.from(this.reputations.values());
    
    return allReputations
      .sort((a, b) => {
        // Sort by reputation score, then by total requests
        if (b.reputationScore !== a.reputationScore) {
          return b.reputationScore - a.reputationScore;
        }
        return b.totalRequests - a.totalRequests;
      })
      .slice(0, limit);
  }

  /**
   * Get all reputations
   */
  getAllReputations(): AgentReputation[] {
    return Array.from(this.reputations.values());
  }
}

export const reputationService = new ReputationService();

