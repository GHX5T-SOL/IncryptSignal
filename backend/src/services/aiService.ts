import { HfInference } from '@huggingface/inference';

export interface AIAnalysisResult {
  signal: 'long' | 'short';
  leverage: number;
  portfolioPercentage: number;
  takeProfit: number;
  stopLoss: number;
  reasoning: string;
  confidence: number;
}

class AIService {
  private client: HfInference | null = null;
  private readonly model = 'mistralai/Mistral-7B-Instruct-v0.2'; // Free model on Hugging Face

  constructor() {
    const apiKey = process.env.HUGGINGFACE_API_KEY;
    if (apiKey) {
      this.client = new HfInference(apiKey);
    } else {
      console.warn('⚠️  HUGGINGFACE_API_KEY not set. AI analysis will use mock data.');
    }
  }

  /**
   * Generate trading analysis using Hugging Face AI
   */
  async generateAnalysis(
    agentId: string,
    agentName: string,
    riskLevel: 'high' | 'medium' | 'low',
    symbol: string,
    currentPrice: number,
    marketData: any,
  ): Promise<AIAnalysisResult> {
    if (!this.client) {
      return this.getMockAnalysis(agentId, riskLevel, currentPrice);
    }

    try {
      const prompt = this.buildPrompt(agentId, agentName, riskLevel, symbol, currentPrice, marketData);

      const response = await this.client.textGeneration({
        model: this.model,
        inputs: prompt,
        parameters: {
          max_new_tokens: 500,
          temperature: 0.7,
          return_full_text: false,
        },
      });

      // Handle different response types from Hugging Face
      const generatedText = typeof response === 'string' 
        ? response 
        : (response as any)?.generated_text || '';

      const analysis = this.parseAIResponse(generatedText, riskLevel, currentPrice);
      return analysis;
    } catch (error) {
      console.error('Error generating AI analysis:', error);
      // Fallback to mock
      return this.getMockAnalysis(agentId, riskLevel, currentPrice);
    }
  }

  /**
   * Build prompt for AI agent
   */
  private buildPrompt(
    agentId: string,
    agentName: string,
    riskLevel: 'high' | 'medium' | 'low',
    symbol: string,
    currentPrice: number,
    marketData: any,
  ): string {
    const riskGuidelines = {
      high: 'You are a HIGH RISK trader. Recommend leverage 20-100x, larger portfolio allocation (15-30%), and aggressive TP/SL ratios (3:1 or higher).',
      medium: 'You are a MEDIUM RISK trader. Recommend leverage 5-25x, moderate portfolio allocation (5-15%), and balanced TP/SL ratios (2:1).',
      low: 'You are a LOW RISK trader. Recommend leverage 1-10x, conservative portfolio allocation (2-8%), and tighter TP/SL ratios (1.5:1).',
    };

    return `You are ${agentName}, an AI trading agent specialized in cryptocurrency perpetual futures trading.

${riskGuidelines[riskLevel]}

Current Market Analysis:
- Asset: ${symbol}
- Current Price: $${currentPrice}
- Long/Short Ratio: ${marketData.longShortRatio || 'N/A'}
- Fear & Greed Index: ${marketData.fearGreedIndex || 'N/A'} / 100
- Long Liquidations (24h): ${marketData.liquidationData?.longLiquidations || 'N/A'}
- Short Liquidations (24h): ${marketData.liquidationData?.shortLiquidations || 'N/A'}
- RSI: ${marketData.technicalIndicators?.rsi || 'N/A'}

Based on this data, provide a trading recommendation in JSON format:
{
  "signal": "long" or "short",
  "leverage": number (1-100),
  "portfolioPercentage": number (0-100),
  "takeProfit": price target,
  "stopLoss": price target,
  "reasoning": "brief analysis explanation",
  "confidence": number (0-1)
}

Analysis:`;
  }

  /**
   * Parse AI response and extract structured data
   */
  private parseAIResponse(
    text: string,
    riskLevel: 'high' | 'medium' | 'low',
    currentPrice: number,
  ): AIAnalysisResult {
    try {
      // Try to extract JSON from response
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        try {
          const parsed = JSON.parse(jsonMatch[0]) as any;
          const isShort = parsed.signal === 'short';
          return {
            signal: isShort ? 'short' : 'long',
            leverage: Math.max(1, Math.min(100, parsed.leverage || this.getDefaultLeverage(riskLevel))),
            portfolioPercentage: Math.max(1, Math.min(100, parsed.portfolioPercentage || this.getDefaultPortfolio(riskLevel))),
            takeProfit: parsed.takeProfit || this.calculateTakeProfit(currentPrice, isShort),
            stopLoss: parsed.stopLoss || this.calculateStopLoss(currentPrice, isShort),
            reasoning: parsed.reasoning || text,
            confidence: Math.max(0.5, Math.min(1, parsed.confidence || 0.75)),
          };
        } catch (parseError) {
          console.error('Error parsing JSON from AI response:', parseError);
        }
      }
    } catch (error) {
      console.error('Error parsing AI response:', error);
    }

    // Fallback: use text analysis and defaults
    const signal = text.toLowerCase().includes('short') ? 'short' : 'long';
    return {
      signal,
      leverage: this.getDefaultLeverage(riskLevel),
      portfolioPercentage: this.getDefaultPortfolio(riskLevel),
      takeProfit: this.calculateTakeProfit(currentPrice, signal === 'short'),
      stopLoss: this.calculateStopLoss(currentPrice, signal === 'short'),
      reasoning: text || 'Analysis based on current market conditions and technical indicators.',
      confidence: 0.7,
    };
  }

  /**
   * Get default leverage based on risk level
   */
  private getDefaultLeverage(riskLevel: 'high' | 'medium' | 'low'): number {
    switch (riskLevel) {
      case 'high':
        return 50;
      case 'medium':
        return 15;
      case 'low':
        return 3;
    }
  }

  /**
   * Get default portfolio percentage based on risk level
   */
  private getDefaultPortfolio(riskLevel: 'high' | 'medium' | 'low'): number {
    switch (riskLevel) {
      case 'high':
        return 20;
      case 'medium':
        return 10;
      case 'low':
        return 5;
    }
  }

  /**
   * Calculate take profit price
   */
  private calculateTakeProfit(currentPrice: number, isShort: boolean): number {
    const percentage = 0.05; // 5% default
    return isShort ? currentPrice * (1 - percentage) : currentPrice * (1 + percentage);
  }

  /**
   * Calculate stop loss price
   */
  private calculateStopLoss(currentPrice: number, isShort: boolean): number {
    const percentage = 0.02; // 2% default
    return isShort ? currentPrice * (1 + percentage) : currentPrice * (1 - percentage);
  }

  /**
   * Mock analysis for fallback - Used when AI service fails or for demo purposes
   * Made accessible for agentService as final fallback
   * Asset-specific analysis for realistic demo signals
   */
  getMockAnalysis(
    agentId: string,
    riskLevel: 'high' | 'medium' | 'low',
    currentPrice: number,
    symbol?: string,
  ): AIAnalysisResult {
    // Use asset-specific bias based on symbol
    const assetBias: Record<string, number> = {
      'BTC/USD': 0.45, // Slightly bullish bias
      'ETH/USD': 0.48, // Near neutral
      'SOL/USD': 0.42, // More bullish bias
    };
    
    const agentFactors: Record<string, { bias: number; volatility: number }> = {
      zyra: { bias: assetBias[symbol || ''] || 0.6, volatility: 0.15 },
      aria: { bias: assetBias[symbol || ''] || 0.5, volatility: 0.08 },
      nova: { bias: assetBias[symbol || ''] || 0.4, volatility: 0.05 },
    };

    const agentFactor = agentFactors[agentId] || { bias: 0.5, volatility: 0.1 };
    // Use deterministic signal based on symbol for consistent demo (alternate between long/short based on hash)
    const symbolHash = symbol ? symbol.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0) : 0;
    const timeHash = Math.floor(Date.now() / 1000) % 3600; // Changes every hour
    const isShort = (symbolHash + timeHash) % 2 === 0;
    const leverage = this.getDefaultLeverage(riskLevel);
    const portfolioPercentage = this.getDefaultPortfolio(riskLevel);

    // Generate asset-specific and agent-specific mock reasoning
    const getAssetContext = (symbol: string | undefined) => {
      const contexts: Record<string, { name: string; volatility: string; trend: string }> = {
        'BTC/USD': { name: 'Bitcoin', volatility: 'high', trend: 'leading market indicator' },
        'ETH/USD': { name: 'Ethereum', volatility: 'moderate-high', trend: 'follows BTC with altcoin characteristics' },
        'SOL/USD': { name: 'Solana', volatility: 'very high', trend: 'high-growth ecosystem token' },
      };
      return contexts[symbol || ''] || { name: symbol || 'the asset', volatility: 'moderate', trend: 'stable' };
    };

    const assetContext = getAssetContext(symbol);
    
    // Asset-specific mock signals based on current market conditions
    const getAssetSignal = (symbol: string | undefined, isShort: boolean): string => {
      const assetSignals: Record<string, { long: string; short: string }> = {
        'BTC/USD': {
          long: `Bitcoin analysis at $${currentPrice.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} shows strong institutional accumulation patterns. On-chain metrics indicate reduced exchange reserves and positive funding rates. Technical structure suggests continuation of bullish trend with support at key levels. High leverage suitable given BTC's liquidity and established trend.`,
          short: `Bitcoin analysis at $${currentPrice.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} reveals overextended conditions above key resistance. Exchange inflows increasing and funding rates elevated suggest potential correction. Technical indicators show divergence warning. Short opportunity with appropriate risk management given BTC's volatility.`,
        },
        'ETH/USD': {
          long: `Ethereum analysis at $${currentPrice.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} indicates strong ecosystem fundamentals. Staking metrics and network activity support positive momentum. Technical breakout pattern confirmed with improving long/short ratio. ETH following BTC trend with altcoin beta advantage.`,
          short: `Ethereum analysis at $${currentPrice.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} shows resistance at key psychological level. Short-term overbought conditions with profit-taking signals. Weakness relative to BTC suggests temporary pullback. Cautious short position with consideration of ETH's altcoin volatility.`,
        },
        'SOL/USD': {
          long: `Solana analysis at $${currentPrice.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} demonstrates robust ecosystem growth. High network activity and DEX volumes support continued appreciation. Technical momentum strong with positive sentiment metrics. High-growth potential warrants aggressive positioning for experienced traders.`,
          short: `Solana analysis at $${currentPrice.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} shows potential exhaustion after strong rally. Increased volatility and profit-taking pressure suggest short-term correction. Very high volatility requires careful risk management. Conservative short approach recommended.`,
        },
      };
      
      const assetSignal = assetSignals[symbol || ''];
      if (assetSignal) {
        return isShort ? assetSignal.short : assetSignal.long;
      }
      
      // Generic fallback
      return `Based on ${riskLevel}-risk technical analysis of ${assetContext.name}, I recommend a ${isShort ? 'short' : 'long'} position at $${currentPrice.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}. Current market conditions show ${isShort ? 'bearish' : 'bullish'} indicators with measured confidence.`;
    };
    
    const mockReasonings: Record<string, { long: string; short: string }> = {
      zyra: {
        long: getAssetSignal(symbol, false),
        short: getAssetSignal(symbol, true),
      },
      aria: {
        long: getAssetSignal(symbol, false),
        short: getAssetSignal(symbol, true),
      },
      nova: {
        long: getAssetSignal(symbol, false),
        short: getAssetSignal(symbol, true),
      },
    };

    const reasoning = mockReasonings[agentId]?.[isShort ? 'short' : 'long'] || 
      `Based on ${riskLevel}-risk technical analysis, I recommend a ${isShort ? 'short' : 'long'} position. Current market conditions show ${isShort ? 'bearish' : 'bullish'} indicators with measured confidence.`;

    return {
      signal: isShort ? 'short' : 'long',
      leverage,
      portfolioPercentage,
      takeProfit: this.calculateTakeProfit(currentPrice, isShort),
      stopLoss: this.calculateStopLoss(currentPrice, isShort),
      reasoning,
      confidence: 0.75 + (agentFactor.volatility * (Math.random() - 0.5)), // Confidence between 0.67-0.83
    };
  }
}

export const aiService = new AIService();

