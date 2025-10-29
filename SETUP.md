# IncryptSignal Setup Guide

## Quick Start

### 1. Prerequisites

- Node.js (LTS or later)
- npm or yarn
- A Solana wallet (Phantom, Solflare, etc.)

### 2. Clone and Install

```bash
# Clone the repository
git clone <repository-url>
cd incryptsignal

# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install
```

### 3. Generate Treasury Wallet

The treasury wallet is where payments are sent. Generate one:

```bash
cd backend
npx tsx src/utils/generateTreasury.ts
```

This will:
- Generate a new Solana keypair
- Save it to `treasury-wallet.json` (NEVER commit this!)
- Print the public key to add to your `.env` file

### 4. Configure Environment

#### Backend Configuration

Create `backend/.env`:

```bash
cd backend
cp .env.example .env
```

Edit `.env` with your values:

```env
SOLANA_NETWORK=devnet
RPC_URL=https://api.devnet.solana.com
USDC_MINT_ADDRESS=4zMMC9srt5Ri5X14GAgXhaHii3GnPAEERYPJgZJDncDU
TREASURY_WALLET_ADDRESS=<your-generated-public-key>
FACILITATOR_URL=https://facilitator.payai.network
PYTH_NETWORK=devnet
PORT=3001
SIGNAL_PRICE_MICRO_USDC=10000
```

#### Frontend Configuration

Create `frontend/.env.local`:

```bash
cd frontend
cp .env.example .env.local
```

Edit `.env.local`:

```env
REACT_APP_API_URL=http://localhost:3001
REACT_APP_NETWORK=devnet
```

### 5. Fund Your Test Wallet

Before testing, you'll need:

1. **Devnet SOL** - For wallet transactions
   - Use Solana faucet: https://faucet.solana.com/
   - Or CLI: `solana airdrop 1 <your-wallet-address> --url devnet`

2. **Devnet USDC** - For signal payments
   - Use Circle faucet: https://faucet.circle.com/
   - Select "Solana Devnet"
   - Enter your wallet address

### 6. Start the Application

#### Terminal 1: Backend

```bash
cd backend
npm run dev
```

Backend will run on http://localhost:3001

#### Terminal 2: Frontend

```bash
cd frontend
npm start
```

Frontend will open at http://localhost:3000

### 7. Test the Application

1. Open http://localhost:3000 in your browser
2. Connect your Solana wallet (Phantom, etc.)
3. Select a trading pair (e.g., BTC/USD)
4. Click "Get Signal"
5. Approve the USDC payment transaction
6. View your trading signal!

## Troubleshooting

### Backend won't start

- Check that `.env` file exists and has all required variables
- Verify `TREASURY_WALLET_ADDRESS` is set
- Check that port 3001 is available

### Payment fails

- Ensure your wallet has USDC on Devnet
- Check that you have some SOL for gas (though PayAI facilitator handles this)
- Verify `FACILITATOR_URL` is correct

### No signals received

- Check backend logs for errors
- Verify Pyth Network is accessible
- Check that trading pair symbol is correct

### Frontend can't connect to backend

- Verify backend is running on port 3001
- Check `REACT_APP_API_URL` in `.env.local`
- Check browser console for CORS errors

## Production Deployment

For production deployment:

1. Change `SOLANA_NETWORK=mainnet` in backend `.env`
2. Update `USDC_MINT_ADDRESS` to mainnet USDC: `EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v`
3. Update frontend `.env.local` with production API URL
4. Build frontend: `npm run build`
5. Deploy backend and frontend to your hosting platform

## Security Notes

- ⚠️  NEVER commit `.env` files
- ⚠️  NEVER commit `treasury-wallet.json` or any keypair files
- ⚠️  Use environment variables for all sensitive data
- ⚠️  In production, use secure key management (Vault, AWS Secrets Manager, etc.)

