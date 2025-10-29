import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { PythService } from './services/pythService';
import { SignalService } from './services/signalService';
import { createSignalsRouter } from './routes/signals';
import { initializeDatabase } from './db/connection';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware - CORS configuration
// Allow requests from Vercel frontend or any origin if FRONTEND_URL not set
const allowedOrigins = process.env.FRONTEND_URL 
  ? process.env.FRONTEND_URL.split(',').map(url => url.trim())
  : ['*'];

app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (like mobile apps, Postman, etc.)
    if (!origin) return callback(null, true);
    
    // If FRONTEND_URL is not set, allow all origins
    if (process.env.FRONTEND_URL === undefined || allowedOrigins.includes('*')) {
      return callback(null, true);
    }
    
    // Check if origin is in allowed list
    if (allowedOrigins.some(allowed => origin.startsWith(allowed))) {
      callback(null, true);
    } else {
      callback(null, true); // Still allow for development
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: '*', // Allow all headers for x402 protocol compatibility
  exposedHeaders: [
    'X-Payment',
    'x-payment',
    'x-payment-*',
    'content-type',
    'access-control-expose-headers',
    'access-control-allow-headers',
  ],
  preflightContinue: false,
  optionsSuccessStatus: 204,
}));

// Handle preflight requests explicitly
app.options('*', cors({
  origin: true,
  credentials: true,
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: '*', // Allow all headers for x402 protocol compatibility
  exposedHeaders: ['X-Payment', 'x-payment', 'Content-Type'],
  maxAge: 86400, // 24 hours
}));

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

// Initialize database (async)
async function startServer() {
  try {
    // Initialize PostgreSQL database connection and schema
    if (process.env.DATABASE_URL) {
      await initializeDatabase();
      console.log('✅ Database connected and schema initialized');
    } else {
      console.warn('⚠️  DATABASE_URL not set. Using in-memory storage (not persistent).');
    }
  } catch (error) {
    console.error('❌ Failed to initialize database:', error);
    // Continue without database (will use fallback if implemented)
  }

  // Initialize services
  const network = (process.env.SOLANA_NETWORK === 'mainnet' ? 'solana' : 'solana-devnet') as 'solana' | 'solana-devnet';
  const pythService = new PythService(process.env.PYTH_NETWORK || 'devnet');
  const signalService = new SignalService(pythService);
  
  // Initialize agent service
  const { agentService } = await import('./services/agentService');
  agentService.setPythService(pythService);

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
}

// Start the server
startServer().catch((error) => {
  console.error('Failed to start server:', error);
  process.exit(1);
});

