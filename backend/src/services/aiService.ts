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

      const analysis = this.parseAIResponse(response.generated_text || '', riskLevel, currentPrice);
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
        const parsed = JSON.parse(jsonMatch[0]);
        return {
          signal: parsed.signal === 'short' ? 'short' : 'long',
          leverage: Math.max(1, Math.min(100, parsed.leverage || this.getDefaultLeverage(riskLevel))),
          portfolioPercentage: Math.max(1, Math.min(100, parsed.portfolioPercentage || this.getDefaultPortfolio(riskLevel))),
          takeProfit: parsed.takeProfit || this.calculateTakeProfit(currentPrice, parsed.signal === 'short'),
          stopLoss: parsed.stopLoss || this.calculateStopLoss(currentPrice, parsed.signal === 'short'),
          reasoning: parsed.reasoning || text,
          confidence: Math.max(0.5, Math.min(1, parsed.confidence || 0.75)),
        };
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
   * Mock analysis for fallback
   */
  private getMockAnalysis(
    agentId: string,
    riskLevel: 'high' | 'medium' | 'low',
    currentPrice: number,
  ): AIAnalysisResult {
    const isShort = Math.random() > 0.5;
    const leverage = this.getDefaultLeverage(riskLevel);
    const portfolioPercentage = this.getDefaultPortfolio(riskLevel);

    return {
      signal: isShort ? 'short' : 'long',
      leverage,
      portfolioPercentage,
      takeProfit: this.calculateTakeProfit(currentPrice, isShort),
      stopLoss: this.calculateStopLoss(currentPrice, isShort),
      reasoning: `Based on technical analysis and market sentiment, I recommend a ${isShort ? 'short' : 'long'} position. The current market conditions suggest ${isShort ? 'downward' : 'upward'} momentum with moderate confidence.`,
      confidence: 0.72,
    };
  }
}

export const aiService = new AIService();

