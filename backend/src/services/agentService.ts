import { aiService, AIAnalysisResult } from './aiService';
import { marketDataService, MarketData } from './marketDataService';
import { PythService } from './pythService';

export interface Agent {
  agentId: string;
  agentName: string;
  riskLevel: 'high' | 'medium' | 'low';
}

export const AGENTS: Agent[] = [
  { agentId: 'zyra', agentName: 'Zyra', riskLevel: 'high' },
  { agentId: 'aria', agentName: 'Aria', riskLevel: 'medium' },
  { agentId: 'nova', agentName: 'Nova', riskLevel: 'low' },
];

export interface AgentSignal {
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

class AgentService {
  private pythService: PythService | null = null;

  setPythService(pythService: PythService) {
    this.pythService = pythService;
  }

  /**
   * Generate trading signal using specified agent
   */
  async generateAgentSignal(
    agentId: string,
    symbol: string,
  ): Promise<AgentSignal | null> {
    if (!this.pythService) {
      throw new Error('PythService not initialized');
    }

    const agent = AGENTS.find((a) => a.agentId === agentId);
    if (!agent) {
      throw new Error(`Agent ${agentId} not found`);
    }

    // Get current price
    const priceData = await this.pythService.getPrice(symbol);
    if (!priceData) {
      throw new Error(`Failed to get price for ${symbol}`);
    }

    const currentPrice = priceData.price;

    // Get market data
    const marketData = await marketDataService.getMarketData(symbol);

    // Get AI analysis
    const aiAnalysis = await aiService.generateAnalysis(
      agent.agentId,
      agent.agentName,
      agent.riskLevel,
      symbol,
      currentPrice,
      marketData,
    );

    // Calculate liquidation level based on leverage and signal direction
    const liquidationLevel = this.calculateLiquidationLevel(
      currentPrice,
      aiAnalysis.leverage,
      aiAnalysis.signal === 'short',
    );

    return {
      agentId: agent.agentId,
      agentName: agent.agentName,
      signal: aiAnalysis.signal,
      currentPrice,
      leverage: aiAnalysis.leverage,
      liquidationLevel,
      portfolioPercentage: aiAnalysis.portfolioPercentage,
      takeProfit: aiAnalysis.takeProfit,
      stopLoss: aiAnalysis.stopLoss,
      reasoning: aiAnalysis.reasoning,
      confidence: aiAnalysis.confidence,
      timestamp: Date.now(),
      symbol,
    };
  }

  /**
   * Calculate liquidation level based on leverage and position
   */
  private calculateLiquidationLevel(
    entryPrice: number,
    leverage: number,
    isShort: boolean,
  ): number {
    // Simplified liquidation calculation
    // For long: liquidation = entry * (1 - 1/leverage * 0.9) // 90% of max loss
    // For short: liquidation = entry * (1 + 1/leverage * 0.9)
    const marginRatio = 0.9 / leverage;

    if (isShort) {
      return entryPrice * (1 + marginRatio);
    } else {
      return entryPrice * (1 - marginRatio);
    }
  }

  /**
   * Get agent by ID
   */
  getAgent(agentId: string): Agent | undefined {
    return AGENTS.find((a) => a.agentId === agentId);
  }

  /**
   * Get all agents
   */
  getAllAgents(): Agent[] {
    return AGENTS;
  }
}

export const agentService = new AgentService();

