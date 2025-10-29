# 🚀 IncryptSignal

<div align="center">

![Solana](https://img.shields.io/badge/Solana-Ready-brightgreen)
![x402](https://img.shields.io/badge/x402-Protocol-blue)
![TypeScript](https://img.shields.io/badge/TypeScript-Ready-blue)
![License](https://img.shields.io/badge/License-Proprietary-red)

**AI-Powered Trading Signals for Leveraged Perpetual Trading on Solana**

[Features](#-features) • [Setup](#-setup) • [Demo](#-demo) • [Architecture](#-architecture)

</div>

---

## 🔮 Overview

IncryptSignal is a production-ready AI trading platform that provides real-time trading signals for leveraged perpetual trading of cryptocurrency assets. Our platform features three specialized AI agents (Zyra, Aria, and Nova) trained with real-time market data, technical analysis, and fundamental insights to deliver precise trading recommendations.

### Key Features

- ✅ **Three AI Trading Agents**: Zyra (High Risk), Aria (Medium Risk), Nova (Low Risk)
- ✅ **Real-Time Analysis**: Comprehensive technical and fundamental analysis
- ✅ **Market Data Integration**: Long/short ratios, liquidation heatmaps, fear & greed index
- ✅ **Leverage Recommendations**: Precise leverage suggestions up to 100x with liquidation warnings
- ✅ **Micropayments**: Sub-cent USDC payments via x402 protocol on Solana
- ✅ **Gasless Transactions**: Powered by PayAI facilitator for seamless UX
- ✅ **Trustless Receipts**: On-chain verification of all signal deliveries
- ✅ **Reputation System**: Agent performance tracking and leaderboards
- ✅ **Cyberpunk UI**: Futuristic design with liquid glass and holographic elements

---

## 🎯 Features

### AI Trading Agents

- **Zyra** - The High Risk Trader
  - Aggressive entries with high leverage opportunities (20-100x)
  - Larger portfolio allocation (15-30%)
  - Higher risk-reward ratios (3:1+)
  - Perfect for experienced traders seeking maximum returns

- **Aria** - The Medium Risk Trader
  - Balanced approach with optimal risk-reward ratios
  - Moderate leverage (5-25x) and portfolio allocation (5-15%)
  - Suitable for most traders looking for steady growth

- **Nova** - The Low Risk Trader
  - Conservative strategy with tighter stops
  - Lower leverage (1-10x) and portfolio allocation (2-8%)
  - Ideal for risk-averse traders prioritizing capital preservation

### Trading Signals Include

- **Direction**: Long or Short recommendation
- **Leverage**: Precise leverage recommendation (1x-100x)
- **Portfolio Allocation**: Recommended percentage of portfolio to allocate
- **Take Profit Target**: AI-calculated profit target
- **Stop Loss Level**: Risk management stop loss
- **Liquidation Warning**: Calculated liquidation price based on leverage
- **Analysis**: AI-generated reasoning based on market conditions

### Market Data Sources

- Pyth Network for real-time price feeds
- CoinGlass for liquidation data and long/short ratios
- Alternative.me for Fear & Greed Index
- Technical indicators (RSI, MACD) calculated from price history
- AI analysis powered by Hugging Face Inference API

---

## 🏗️ Architecture

```
┌─────────────┐      ┌──────────────┐      ┌─────────────────┐
│   Frontend  │─────>│   Backend    │─────>│  x402 Facilitator│
│   (React)   │      │  (Express)   │      │  (PayAI Network) │
│             │      │              │      │                 │
│  - Home     │      │  - Agents    │      │  - Gasless Tx   │
│  - Arena    │      │  - Signals   │      │  - Payment Ver. │
│  - Wallet   │      │  - AI Service │      │                 │
└─────────────┘      └──────────────┘      └─────────────────┘
                            │
                            ├──> Pyth Network (Price Feeds)
                            ├──> Market Data APIs (Long/Short, Liquidation)
                            ├──> Hugging Face (AI Analysis)
                            └──> PostgreSQL (Storage)
```

---

## 📦 Tech Stack

### Frontend
- **React 18** with TypeScript
- **Tailwind CSS** with custom cyberpunk theme
- **Framer Motion** for animations
- **Solana Wallet Adapter** for wallet integration
- **PayAI x402 Client** for payment handling
- **React Router** for navigation

### Backend
- **Node.js** with Express and TypeScript
- **PostgreSQL** for persistent storage
- **Pyth Network** for oracle price feeds
- **Hugging Face Inference API** for AI analysis
- **PayAI x402 Server** for payment protection
- **Market Data APIs** (CoinGlass, Alternative.me)

---

## 🚀 Setup

### Prerequisites

- Node.js 18+ and npm
- PostgreSQL database (or Railway managed)
- Solana wallet (Phantom, Solflare)
- Devnet SOL and USDC for testing
- Hugging Face API key (free tier available)

### Backend Setup

```bash
cd backend
npm install
cp .env.example .env
# Edit .env with your configuration
npm run build
npm start
```

### Frontend Setup

```bash
cd frontend
npm install --legacy-peer-deps
cp .env.example .env
# Edit .env with your API URL
npm start
```

### Environment Variables

#### Backend (.env)
```env
# Solana Configuration
SOLANA_NETWORK=devnet
RPC_URL=https://api.devnet.solana.com
USDC_MINT_ADDRESS=4zMMC9srt5Ri5X14GAgXhaHii3GnPAEERYPJgZJDncDU
TREASURY_WALLET_ADDRESS=your_treasury_address
FACILITATOR_URL=https://facilitator.payai.network

# Database
DATABASE_URL=postgresql://user:pass@host:port/db

# AI Service
HUGGINGFACE_API_KEY=your_huggingface_api_key

# Server
PORT=3001
```

#### Frontend (.env)
```env
REACT_APP_API_URL=http://localhost:3001
REACT_APP_NETWORK=devnet
```

---

## 🎨 UI Features

- **Animated Starfield**: 3D particle background effect
- **Liquid Glass Cards**: Holographic glass morphism effects
- **Neon Accents**: Cyan and magenta color scheme
- **Responsive Design**: Mobile and desktop optimized
- **Agent Videos**: Auto-playing, looping video backgrounds with image fallback

---

## 📊 Trading Assets

Currently supported:
- **BTC/USD**
- **ETH/USD**
- **SOL/USD**

*More assets coming soon!*

---

## 🔐 Security

- All payments verified on-chain via x402 protocol
- Trustless receipt hashing stored in PostgreSQL
- Reputation tracking prevents abuse
- CORS configured for secure API access

---

## 🌐 Deployment

### Railway (Recommended)

Backend and database can be deployed on Railway:
1. Connect your GitHub repository
2. Add PostgreSQL service
3. Set environment variables
4. Deploy

### Vercel

Frontend can be deployed on Vercel:
1. Connect your GitHub repository
2. Set environment variables
3. Deploy

See `DEPLOYMENT_GUIDE.md` for detailed instructions.

---

## 📞 Contact

- **X (Twitter)**: [@Incrypt_defi](https://x.com/Incrypt_defi)
- **Email**: incryptinvestments@protonmail.com

For questions, support, or collaboration inquiries, please reach out via email or X.

---

## 📝 License

**Proprietary License - All Rights Reserved**

Copyright (c) 2025 IncryptSignal. All Rights Reserved. This software is proprietary and confidential. Unauthorized use is strictly prohibited.

See [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgments

- **Solana Foundation** for the x402 protocol
- **PayAI Network** for x402 implementation
- **Pyth Network** for oracle price feeds
- **Hugging Face** for AI inference capabilities

---

<div align="center">

**Built with ❤️ for the future of decentralized trading**

</div>
