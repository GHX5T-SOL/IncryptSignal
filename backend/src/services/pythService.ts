import { Connection, clusterApiUrl } from '@solana/web3.js';
import { PythHttpClient, getPythProgramKeyForCluster } from '@pythnetwork/client';

export interface PriceData {
  price: number;
  timestamp: number;
  symbol: string;
}

interface PriceHistory {
  [symbol: string]: {
    current: PriceData | null;
    previous: PriceData | null;
  };
}

export class PythService {
  private client: PythHttpClient;
  private connection: Connection;
  private priceHistory: PriceHistory = {};

  constructor(network: string = 'devnet') {
    const rpcUrl = network === 'devnet' 
      ? 'https://api.devnet.solana.com'
      : clusterApiUrl(network as 'mainnet-beta');
    
    this.connection = new Connection(rpcUrl, 'confirmed');
    const pythPublicKey = getPythProgramKeyForCluster(network);
    this.client = new PythHttpClient(this.connection, pythPublicKey);
  }

  /**
   * Get current price for a trading pair
   */
  async getPrice(symbol: string): Promise<PriceData | null> {
    try {
      const data = await this.client.getData();
      const priceFeed = data.productPrice.get(symbol);

      if (!priceFeed || !priceFeed.price) {
        return null;
      }

      const priceData: PriceData = {
        price: priceFeed.price,
        timestamp: Date.now(),
        symbol,
      };

      // Update price history
      this.updatePriceHistory(symbol, priceData);

      return priceData;
    } catch (error) {
      console.error(`Error fetching price for ${symbol}:`, error);
      return null;
    }
  }

  /**
   * Calculate price delta for a symbol
   */
  async getPriceDelta(symbol: string): Promise<{ delta: number; current: number; previous: number | null } | null> {
    const current = await this.getPrice(symbol);
    if (!current) {
      return null;
    }

    const history = this.priceHistory[symbol];
    const previous = history?.previous;

    if (!previous) {
      // First price fetch, no delta available
      return {
        delta: 0,
        current: current.price,
        previous: null,
      };
    }

    return {
      delta: current.price - previous.price,
      current: current.price,
      previous: previous.price,
    };
  }

  /**
   * Update price history for delta calculation
   */
  private updatePriceHistory(symbol: string, newPrice: PriceData): void {
    if (!this.priceHistory[symbol]) {
      this.priceHistory[symbol] = {
        current: null,
        previous: null,
      };
    }

    const history = this.priceHistory[symbol];
    
    // Move current to previous
    history.previous = history.current;
    // Set new current
    history.current = newPrice;
  }

  /**
   * Get available trading pairs
   */
  getAvailablePairs(): string[] {
    return ['BTC/USD', 'ETH/USD', 'SOL/USD', 'USDC/USD'];
  }
}

