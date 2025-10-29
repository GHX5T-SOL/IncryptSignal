import { PythService } from './pythService';

export interface TradingSignal {
  signal: 'long' | 'short' | 'neutral';
  confidence: number;
  price: number;
  priceDelta: number | null;
  previousPrice: number | null;
  symbol: string;
  timestamp: number;
  reasoning: string;
}

export class SignalService {
  private pythService: PythService;

  constructor(pythService: PythService) {
    this.pythService = pythService;
  }

  /**
   * Generate trading signal based on price delta
   * Negative delta = long signal (price dropped, good time to buy)
   * Positive delta = short signal (price rose, good time to sell)
   */
  async generateSignal(symbol: string): Promise<TradingSignal | null> {
    try {
      const priceDeltaData = await this.pythService.getPriceDelta(symbol);

      if (!priceDeltaData) {
        return null;
      }

      const { delta, current, previous } = priceDeltaData;

      // Calculate confidence based on magnitude of delta
      const absDelta = Math.abs(delta);
      const confidence = Math.min(0.95, 0.5 + (absDelta / current) * 10);

      // Generate signal based on delta direction
      let signal: 'long' | 'short' | 'neutral';
      let reasoning: string;

      if (delta < -0.01) {
        // Significant negative delta - price dropped
        signal = 'long';
        reasoning = `Price decreased by ${delta.toFixed(4)}, suggesting a potential upward correction. Consider long position.`;
      } else if (delta > 0.01) {
        // Significant positive delta - price rose
        signal = 'short';
        reasoning = `Price increased by ${delta.toFixed(4)}, suggesting a potential downward correction. Consider short position.`;
      } else {
        // Small delta - neutral
        signal = 'neutral';
        reasoning = `Price movement is minimal (${delta.toFixed(4)}), market is relatively stable.`;
      }

      return {
        signal,
        confidence: Math.max(0.5, confidence),
        price: current,
        priceDelta: delta,
        previousPrice: previous,
        symbol,
        timestamp: Date.now(),
        reasoning,
      };
    } catch (error) {
      console.error(`Error generating signal for ${symbol}:`, error);
      return null;
    }
  }

  /**
   * Validate trading pair symbol
   */
  isValidSymbol(symbol: string): boolean {
    const availablePairs = this.pythService.getAvailablePairs();
    return availablePairs.includes(symbol);
  }
}

