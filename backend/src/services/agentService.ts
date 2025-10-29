import { aiService, AIAnalysisResult } from './aiService.js';
import { marketDataService, MarketData } from './marketDataService.js';
import { PythService } from './pythService.js';

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

  /**
   * Generate mock signal for demo purposes (always works)
   */
  async generateMockSignal(
    agentId: string,
    symbol: string,
  ): Promise<AgentSignal | null> {
    const agent = AGENTS.find((a) => a.agentId === agentId);
    if (!agent) {
      throw new Error(`Agent ${agentId} not found`);
    }

    // Get current price with fallback
    let currentPrice: number;
    try {
      if (this.pythService) {
        const priceData = await this.pythService.getPrice(symbol);
        currentPrice = priceData?.price || this.getMockPrice(symbol);
      } else {
        currentPrice = this.getMockPrice(symbol);
      }
    } catch (error) {
      console.error('Error getting price, using mock:', error);
      currentPrice = this.getMockPrice(symbol);
    }

    // Get mock market data with asset-specific values
    const marketData = await marketDataService.getMarketData(symbol).catch(() => 
      this.getAssetSpecificMarketData(symbol)
    );

    // Get mock AI analysis (always works)
    const aiAnalysis = await aiService.generateAnalysis(
      agent.agentId,
      agent.agentName,
      agent.riskLevel,
      symbol,
      currentPrice,
      marketData,
    ).catch(() => {
      // If even mock fails, return basic defaults
      return aiService.getMockAnalysis(agent.agentId, agent.riskLevel, currentPrice, symbol);
    });

    // Calculate liquidation level
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
   * Get mock price for symbol (fallback)
   * Using current market prices for realistic demo
   */
  private getMockPrice(symbol: string): number {
    const mockPrices: Record<string, number> = {
      'BTC/USD': 110691.00,
      'ETH/USD': 3913.14,
      'SOL/USD': 192.97,
    };
    return mockPrices[symbol] || 1000;
  }

  /**
   * Get asset-specific market data for more realistic mock signals
   */
  private getAssetSpecificMarketData(symbol: string): any {
    const assetData: Record<string, any> = {
      'BTC/USD': {
        longShortRatio: 1.15,
        fearGreedIndex: 62,
        liquidationData: {
          longLiquidations: 12500000,
          shortLiquidations: 9800000,
        },
        technicalIndicators: {
          rsi: 58,
          macd: {
            macd: 120.5,
            signal: 98.3,
            histogram: 22.2,
          },
        },
      },
      'ETH/USD': {
        longShortRatio: 1.22,
        fearGreedIndex: 65,
        liquidationData: {
          longLiquidations: 8500000,
          shortLiquidations: 7200000,
        },
        technicalIndicators: {
          rsi: 54,
          macd: {
            macd: 15.8,
            signal: 12.4,
            histogram: 3.4,
          },
        },
      },
      'SOL/USD': {
        longShortRatio: 1.35,
        fearGreedIndex: 68,
        liquidationData: {
          longLiquidations: 4200000,
          shortLiquidations: 3100000,
        },
        technicalIndicators: {
          rsi: 61,
          macd: {
            macd: 2.8,
            signal: 2.1,
            histogram: 0.7,
          },
        },
      },
    };
    return assetData[symbol] || marketDataService.getMockMarketData();
  }
}

export const agentService = new AgentService();

