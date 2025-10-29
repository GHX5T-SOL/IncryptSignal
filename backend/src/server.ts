import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { PythService } from './services/pythService';
import { SignalService } from './services/signalService';
import { createSignalsRouter } from './routes/signals';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({
    success: true,
    data: {
      status: 'healthy',
      timestamp: new Date().toISOString(),
      service: 'IncryptSignal Backend',
    },
  });
});

// Initialize services
const network = (process.env.SOLANA_NETWORK === 'mainnet' ? 'solana' : 'solana-devnet') as 'solana' | 'solana-devnet';
const pythService = new PythService(process.env.PYTH_NETWORK || 'devnet');
const signalService = new SignalService(pythService);

// x402 Configuration
const x402Config = {
  network,
  treasuryAddress: process.env.TREASURY_WALLET_ADDRESS || '',
  facilitatorUrl: process.env.FACILITATOR_URL || 'https://facilitator.payai.network',
  usdcMint: process.env.USDC_MINT_ADDRESS || '4zMMC9srt5Ri5X14GAgXhaHii3GnPAEERYPJgZJDncDU',
  signalPrice: process.env.SIGNAL_PRICE_MICRO_USDC || '10000', // $0.01 USDC
};

// Validate configuration
if (!x402Config.treasuryAddress) {
  console.warn('⚠️  TREASURY_WALLET_ADDRESS not set. Payment receiving address required.');
}

// Routes
const signalsRouter = createSignalsRouter(signalService, x402Config);
app.use('/', signalsRouter);

// Error handling middleware
app.use((err: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('Unhandled error:', err);
  res.status(500).json({
    success: false,
    error: 'Internal server error',
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 IncryptSignal Backend running on port ${PORT}`);
  console.log(`📍 Network: ${network}`);
  console.log(`💰 Signal price: ${parseInt(x402Config.signalPrice) / 1000000} USDC`);
  console.log(`🏦 Treasury: ${x402Config.treasuryAddress || '⚠️  NOT SET'}`);
});

