# 🚀 IncryptSignal

<div align="center">

![Solana](https://img.shields.io/badge/Solana-Ready-brightgreen)
![x402](https://img.shields.io/badge/x402-Protocol-blue)
![TypeScript](https://img.shields.io/badge/TypeScript-Ready-blue)
![License](https://img.shields.io/badge/License-MIT-yellow)

**Trustless AI Agent Application for Real-Time Trading Signals with Micropayments**

*Built for Solana x402 Hackathon*

[Features](#-features) • [Setup](#-setup) • [Demo](#-demo) • [Architecture](#-architecture)

</div>

---

## 🔮 Overview

IncryptSignal is a trustless AI agent application that provides real-time trading signals derived from oracle price deltas via micropayments in USDC on Solana. Users or agents pay sub-cent fees (~$0.01) per signal using the x402 protocol with gasless transactions powered by Kora.

### Key Features

- ✅ **Real-Time Signals**: Oracle price deltas from Pyth Network
- ✅ **Micropayments**: Sub-cent USDC payments via x402 protocol
- ✅ **Gasless Transactions**: Powered by PayAI facilitator
- ✅ **Trustless Receipts**: On-chain verification of signal deliveries
- ✅ **Reputation System**: Agent scoring based on successful deliveries
- ✅ **Cyberpunk UI**: Futuristic Ghost in the Shell inspired design

---

## 🎯 Hackathon Track Alignment

This project fits multiple Solana x402 Hackathon tracks:

- **x402 Agent Application**: Real AI use cases for autonomous agents
- **Trustless Agent Implementation**: Identity, reputation, and validation systems
- **x402 API Integration**: Agent-to-agent communication & micropayments

---

## 🏗️ Architecture

```
┌─────────────┐      ┌──────────────┐      ┌─────────────────┐
│   Client    │─────>│   Backend    │─────>│  x402 Facilitator│
│  (React)    │      │  (Express)   │      │  (PayAI Network) │
└─────────────┘      └──────────────┘      └─────────────────┘
                            │                        │
                            │                        │
                            ▼                        ▼
                     ┌──────────────┐      ┌─────────────────┐
                     │ Pyth Network │      │  Solana Devnet  │
                     │  (Oracle)    │      │  (Blockchain)   │
                     └──────────────┘      └─────────────────┘
```

### Payment Flow

1. Client requests signal → Backend returns 402 Payment Required
2. Client creates USDC payment transaction
3. Payment sent to Facilitator for verification & settlement
4. Transaction confirmed on-chain (~400ms finality)
5. Backend delivers signal with trustless receipt hash

---

## ✨ Features

### Trading Signals
- Real-time price delta analysis from Pyth Network
- Long/Short signal generation based on price movements
- Confidence scoring and market data

### Micropayments
- ~$0.01 USDC per signal (10000 micro-units)
- Gasless transactions via PayAI facilitator
- Instant settlement with ~400ms finality

### Trustless Receipts
- Cryptographic hashing of transaction signatures
- On-chain verification capability
- Transparent payment history

### Reputation System
- Track agent performance metrics
- Success/failure rate tracking
- Leaderboard system for top agents

### Cyberpunk UI
- Dark theme with neon cyan/magenta accents
- Holographic card effects
- Glitch animations and liquid glass styling
- Responsive design

---

## 🚀 Setup

### Prerequisites

- Node.js (LTS or later)
- npm or yarn
- Solana CLI (for Devnet testing)
- A Solana wallet (Phantom, etc.)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd incryptsignal
   ```

2. **Install backend dependencies**
   ```bash
   cd backend
   npm install
   ```

3. **Install frontend dependencies**
   ```bash
   cd ../frontend
   npm install
   ```

4. **Configure environment variables**

   Backend `.env`:
   ```env
   SOLANA_NETWORK=devnet
   USDC_MINT_ADDRESS=4zMMC9srt5Ri5X14GAgXhaHii3GnPAEERYPJgZJDncDU
   TREASURY_WALLET_ADDRESS=<your-treasury-address>
   FACILITATOR_URL=https://facilitator.payai.network
   RPC_URL=https://api.devnet.solana.com
   PYTH_NETWORK=devnet
   PORT=3001
   ```

   Frontend `.env.local`:
   ```env
   REACT_APP_API_URL=http://localhost:3001
   REACT_APP_NETWORK=devnet
   ```

5. **Start the backend server**
   ```bash
   cd backend
   npm run dev
   ```

6. **Start the frontend**
   ```bash
   cd frontend
   npm start
   ```

7. **Access the application**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:3001

---

## 🎬 Demo

### Demo Video
[Watch the 3-minute demo video](https://youtube.com/watch?v=...) *(Link to be updated)*

### Quick Start Demo

1. **Connect Wallet**: Click the wallet button in the top-right corner
2. **Request Signal**: Enter a trading pair (e.g., BTC/USD) and click "Get Signal"
3. **Pay**: Approve the USDC payment transaction
4. **Receive**: View your trading signal with holographic display
5. **Verify**: Check the receipt hash for on-chain verification

---

## 📁 Project Structure

```
incryptsignal/
├── backend/
│   ├── src/
│   │   ├── server.ts              # Express server
│   │   ├── routes/
│   │   │   └── signals.ts          # Signal endpoints
│   │   ├── services/
│   │   │   ├── pythService.ts     # Pyth Network integration
│   │   │   ├── signalService.ts   # Signal generation
│   │   │   ├── reputationService.ts # Reputation tracking
│   │   │   └── receiptService.ts  # Receipt hashing
│   │   └── middleware/
│   │       └── x402.ts            # x402 payment middleware
│   ├── package.json
│   └── tsconfig.json
├── frontend/
│   ├── src/
│   │   ├── App.tsx
│   │   ├── components/
│   │   │   ├── WalletButton.tsx
│   │   │   ├── SignalRequestForm.tsx
│   │   │   ├── SignalCard.tsx
│   │   │   ├── ReputationLeaderboard.tsx
│   │   │   └── Dashboard.tsx
│   │   ├── hooks/
│   │   │   └── useX402Client.ts
│   │   └── styles/
│   ├── package.json
│   └── tailwind.config.js
├── .gitignore
├── LICENSE
└── README.md
```

---

## 🔧 API Endpoints

### Protected Endpoints (Require x402 Payment)

- `POST /api/signals` - Request trading signal
  - Body: `{ symbol: "BTC/USD" }`
  - Payment: 0.01 USDC
  - Response: `{ signal: "long" | "short", confidence: number, price: number, delta: number }`

### Public Endpoints

- `GET /health` - Health check
- `GET /api/receipt/:hash` - Verify receipt hash
- `GET /api/reputation` - Get reputation data
- `GET /api/reputation/leaderboard` - Get leaderboard

---

## 🛠️ Tech Stack

### Backend
- **Express.js** - Web framework
- **TypeScript** - Type safety
- **@payai/x402-solana** - x402 protocol integration
- **@solana/web3.js** - Solana blockchain interaction
- **@pythnetwork/pyth-sdk-solana** - Oracle price feeds

### Frontend
- **React** - UI framework
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **Framer Motion** - Animations
- **@solana/wallet-adapter-react** - Wallet integration
- **@payai/x402-solana/client** - x402 client

---

## 📝 License

MIT License - See [LICENSE](LICENSE) file for details

---

## 🤝 Contributing

This is a hackathon submission. Contributions are welcome for future development!

---

## 🙏 Acknowledgments

- Solana Foundation for the x402 protocol
- PayAI Network for facilitator infrastructure
- Pyth Network for oracle price feeds
- The Solana developer community

---

<div align="center">

**Built with ❤️ for Solana x402 Hackathon**

</div>

