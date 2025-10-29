export interface MarketData {
  longShortRatio: number | null;
  fearGreedIndex: number | null;
  liquidationData: {
    longLiquidations: number;
    shortLiquidations: number;
  } | null;
  technicalIndicators: {
    rsi: number | null;
    macd: {
      macd: number;
      signal: number;
      histogram: number;
    } | null;
  };
}

class MarketDataService {
  private cache: Map<string, { data: MarketData; timestamp: number }> = new Map();
  private readonly CACHE_TTL = 5 * 60 * 1000; // 5 minutes

  /**
   * Get comprehensive market data for a symbol
   */
  async getMarketData(symbol: string): Promise<MarketData> {
    // Check cache
    const cached = this.cache.get(symbol);
    if (cached && Date.now() - cached.timestamp < this.CACHE_TTL) {
      return cached.data;
    }

    try {
      // Fetch all data in parallel
      const [longShortRatio, fearGreedIndex, liquidationData, technicalIndicators] = await Promise.allSettled([
        this.getLongShortRatio(symbol),
        this.getFearGreedIndex(),
        this.getLiquidationData(symbol),
        this.getTechnicalIndicators(symbol),
      ]);

      const data: MarketData = {
        longShortRatio: longShortRatio.status === 'fulfilled' ? longShortRatio.value : null,
        fearGreedIndex: fearGreedIndex.status === 'fulfilled' ? fearGreedIndex.value : null,
        liquidationData: liquidationData.status === 'fulfilled' ? liquidationData.value : null,
        technicalIndicators: technicalIndicators.status === 'fulfilled' ? technicalIndicators.value : {
          rsi: null,
          macd: null,
        },
      };

      // Cache the result
      this.cache.set(symbol, { data, timestamp: Date.now() });

      return data;
    } catch (error) {
      console.error('Error fetching market data:', error);
      // Return fallback mock data
      return this.getMockMarketData();
    }
  }

  /**
   * Get long/short ratio from Binance (free, no API key needed)
   */
  private async getLongShortRatio(symbol: string): Promise<number | null> {
    try {
      // Binance doesn't have direct long/short ratio endpoint
      // Using CoinGlass API which is free
      const coinSymbol = symbol.split('/')[0].toLowerCase(); // BTC, ETH, SOL
      const response = await fetch(`https://open-api.coinglass.com/public/v2/indicator/long_short_account?symbol=${coinSymbol}&time_type=1h`, {
        headers: {
          'Accept': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`CoinGlass API error: ${response.status}`);
      }

      const data = await response.json() as any;
      if (data?.data && Array.isArray(data.data) && data.data.length > 0) {
        const latest = data.data[data.data.length - 1] as any;
        return latest?.longShortRatio || null;
      }
      return null;
    } catch (error) {
      console.error('Error fetching long/short ratio:', error);
      return null;
    }
  }

  /**
   * Get Fear & Greed Index from Alternative.me (free, no API key)
   */
  private async getFearGreedIndex(): Promise<number | null> {
    try {
      const response = await fetch('https://api.alternative.me/fng/', {
        headers: {
          'Accept': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`Fear & Greed API error: ${response.status}`);
      }

      const data = await response.json() as any;
      if (data?.data && Array.isArray(data.data) && data.data.length > 0) {
        return parseInt(data.data[0].value as string, 10);
      }
      return null;
    } catch (error) {
      console.error('Error fetching fear & greed index:', error);
      return null;
    }
  }

  /**
   * Get liquidation data from CoinGlass (free tier)
   */
  private async getLiquidationData(symbol: string): Promise<{ longLiquidations: number; shortLiquidations: number } | null> {
    try {
      const coinSymbol = symbol.split('/')[0].toLowerCase();
      const response = await fetch(`https://open-api.coinglass.com/public/v2/liquidation_chart?symbol=${coinSymbol}&time_type=1h`, {
        headers: {
          'Accept': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`CoinGlass liquidation API error: ${response.status}`);
      }

      const data = await response.json() as any;
      if (data?.data && Array.isArray(data.data) && data.data.length > 0) {
        const latest = data.data[data.data.length - 1] as any;
        return {
          longLiquidations: latest?.longLiquidations || 0,
          shortLiquidations: latest?.shortLiquidations || 0,
        };
      }
      return null;
    } catch (error) {
      console.error('Error fetching liquidation data:', error);
      return null;
    }
  }

  /**
   * Calculate technical indicators from price history
   * This is a simplified version - in production, use a proper technical analysis library
   */
  private async getTechnicalIndicators(symbol: string): Promise<{
    rsi: number | null;
    macd: { macd: number; signal: number; histogram: number } | null;
  }> {
    // This would need price history data
    // For now, return null and calculate in agentService if needed
    return {
      rsi: null,
      macd: null,
    };
  }

  /**
   * Mock market data for fallback
   */
  private getMockMarketData(): MarketData {
    return {
      longShortRatio: 1.2, // Slightly more longs than shorts
      fearGreedIndex: 55, // Neutral
      liquidationData: {
        longLiquidations: 1000000,
        shortLiquidations: 800000,
      },
      technicalIndicators: {
        rsi: 52,
        macd: {
          macd: 0.5,
          signal: 0.3,
          histogram: 0.2,
        },
      },
    };
  }
}

export const marketDataService = new MarketDataService();

