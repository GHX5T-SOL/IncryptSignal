import { pool } from '../db/connection';

export interface AgentReputation {
  agentId: string;
  successes: number;
  failures: number;
  totalRequests: number;
  reputationScore: number;
  lastActivity: number;
}

class ReputationService {
  /**
   * Update reputation after signal delivery in PostgreSQL database
   */
  async updateReputation(agentId: string, success: boolean): Promise<AgentReputation> {
    const now = Date.now();

    try {
      // Try to get existing reputation
      const existingResult = await pool.query(
        `SELECT * FROM reputation WHERE agent_id = $1`,
        [agentId]
      );

      let reputation: AgentReputation;

      if (existingResult.rows.length === 0) {
        // Create new reputation record
        reputation = {
          agentId,
          successes: success ? 1 : 0,
          failures: success ? 0 : 1,
          totalRequests: 1,
          reputationScore: success ? 1.0 : 0.0,
          lastActivity: now,
        };

        await pool.query(
          `INSERT INTO reputation (agent_id, successes, failures, total_requests, reputation_score, last_activity, created_at, updated_at)
           VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
          [
            agentId,
            reputation.successes,
            reputation.failures,
            reputation.totalRequests,
            reputation.reputationScore,
            now,
            now,
            now,
          ]
        );
      } else {
        // Update existing reputation
        const row = existingResult.rows[0];
        const newSuccesses = row.successes + (success ? 1 : 0);
        const newFailures = row.failures + (success ? 0 : 1);
        const newTotalRequests = row.total_requests + 1;
        const newReputationScore = newSuccesses / newTotalRequests;

        reputation = {
          agentId,
          successes: newSuccesses,
          failures: newFailures,
          totalRequests: newTotalRequests,
          reputationScore: newReputationScore,
          lastActivity: now,
        };

        await pool.query(
          `UPDATE reputation 
           SET successes = $1, failures = $2, total_requests = $3, reputation_score = $4, last_activity = $5, updated_at = $6
           WHERE agent_id = $7`,
          [
            reputation.successes,
            reputation.failures,
            reputation.totalRequests,
            reputation.reputationScore,
            now,
            now,
            agentId,
          ]
        );
      }

      return reputation;
    } catch (error) {
      console.error('Error updating reputation in database:', error);
      // Return a default reputation if database fails
      return {
        agentId,
        successes: success ? 1 : 0,
        failures: success ? 0 : 1,
        totalRequests: 1,
        reputationScore: success ? 1.0 : 0.0,
        lastActivity: now,
      };
    }
  }

  /**
   * Get reputation for an agent from PostgreSQL database
   */
  async getReputation(agentId: string): Promise<AgentReputation | null> {
    try {
      const result = await pool.query(
        `SELECT * FROM reputation WHERE agent_id = $1`,
        [agentId]
      );

      if (result.rows.length === 0) {
        return null;
      }

      const row = result.rows[0];
      return {
        agentId: row.agent_id,
        successes: row.successes,
        failures: row.failures,
        totalRequests: row.total_requests,
        reputationScore: parseFloat(row.reputation_score),
        lastActivity: row.last_activity,
      };
    } catch (error) {
      console.error('Error getting reputation from database:', error);
      return null;
    }
  }

  /**
   * Get leaderboard (top agents by reputation score) from PostgreSQL database
   */
  async getLeaderboard(limit: number = 10): Promise<AgentReputation[]> {
    try {
      const result = await pool.query(
        `SELECT * FROM reputation 
         ORDER BY reputation_score DESC, total_requests DESC
         LIMIT $1`,
        [limit]
      );

      return result.rows.map((row) => ({
        agentId: row.agent_id,
        successes: row.successes,
        failures: row.failures,
        totalRequests: row.total_requests,
        reputationScore: parseFloat(row.reputation_score),
        lastActivity: row.last_activity,
      }));
    } catch (error) {
      console.error('Error getting leaderboard from database:', error);
      return [];
    }
  }

  /**
   * Get all reputations from PostgreSQL database
   */
  async getAllReputations(limit: number = 100): Promise<AgentReputation[]> {
    try {
      const result = await pool.query(
        `SELECT * FROM reputation 
         ORDER BY reputation_score DESC, total_requests DESC
         LIMIT $1`,
        [limit]
      );

      return result.rows.map((row) => ({
        agentId: row.agent_id,
        successes: row.successes,
        failures: row.failures,
        totalRequests: row.total_requests,
        reputationScore: parseFloat(row.reputation_score),
        lastActivity: row.last_activity,
      }));
    } catch (error) {
      console.error('Error getting all reputations from database:', error);
      return [];
    }
  }
}

export const reputationService = new ReputationService();
