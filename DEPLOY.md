# Deployment Guide

## Vercel Deployment

This project is configured for deployment on Vercel with separate configurations for backend and frontend.

### Setup Steps

1. **Install Vercel CLI** (if not already installed):
   ```bash
   npm i -g vercel
   ```

2. **Deploy Backend**:
   ```bash
   cd backend
   vercel
   ```
   - Follow the prompts
   - Set environment variables in Vercel dashboard:
     - `SOLANA_NETWORK=devnet`
     - `USDC_MINT_ADDRESS=4zMMC9srt5Ri5X14GAgXhaHii3GnPAEERYPJgZJDncDU`
     - `TREASURY_WALLET_ADDRESS=<your-treasury-address>`
     - `FACILITATOR_URL=https://facilitator.payai.network`
     - `PYTH_NETWORK=devnet`
     - `SIGNAL_PRICE_MICRO_USDC=10000`

3. **Deploy Frontend**:
   ```bash
   cd frontend
   vercel
   ```
   - Follow the prompts
   - Set environment variables:
     - `REACT_APP_API_URL=<your-backend-url>`
     - `REACT_APP_NETWORK=devnet`

### GitHub Repository

To push to GitHub:

1. **Create a new repository on GitHub** (or use an existing one)

2. **Add remote and push**:
   ```bash
   git remote add origin https://github.com/YOUR_USERNAME/incryptsignal.git
   git branch -M main
   git push -u origin main
   ```

   Replace `YOUR_USERNAME` with your GitHub username.

3. **If repository already exists with content**, you may need to pull first:
   ```bash
   git pull origin main --allow-unrelated-histories
   git push -u origin main
   ```

## Environment Variables for Vercel

Make sure to set all required environment variables in the Vercel dashboard for both backend and frontend projects.

