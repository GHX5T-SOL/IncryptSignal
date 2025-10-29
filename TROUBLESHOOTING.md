# Payment Flow Troubleshooting Guide

## ✅ Current Configuration Status

### Frontend (Vercel)
- ✅ Configured for Devnet (`REACT_APP_NETWORK=devnet`)
- ✅ Uses `https://api.devnet.solana.com` RPC endpoint
- ✅ x402 client configured for `solana-devnet`

### Backend (Railway)
- ✅ Configured for Devnet (`SOLANA_NETWORK=devnet`)
- ✅ CORS fixed to allow all x402 headers
- ✅ Uses Devnet USDC mint: `4zMMC9srt5Ri5X14GAgXhaHii3GnPAEERYPJgZJDncDU`

### Your Wallet
- ✅ Connected to `https://api.devnet.solana.com` (Devnet)

---

## 🔍 Important: Devnet vs Testnet Tokens

**You mentioned having "testnet solana and testnet USDC"** - but your backend is on **Devnet**.

**Solana has 3 separate networks:**
1. **Devnet** - For development (what we're using)
2. **Testnet** - For testing (different from Devnet)
3. **Mainnet** - Production

**If you have Testnet tokens, they won't work with Devnet!**

### ✅ You Need Devnet Tokens:

1. **Devnet SOL:**
   - Get from: https://faucet.solana.com
   - Request 2-5 SOL
   - Make sure wallet is on Devnet before requesting

2. **Devnet USDC:**
   - Get from: https://faucet.circle.com
   - Select "Solana Devnet"
   - Request USDC for your Devnet wallet address
   - **Important:** Testnet USDC ≠ Devnet USDC

3. **Verify Tokens:**
   - Open your wallet
   - Confirm you see:
     - SOL (Devnet) - balance > 0
     - USDC (Devnet) - balance > 0.01 (enough for payment)
   - Make sure they say "Devnet" not "Testnet"

---

## 🔧 CORS Fix - Deployment Status

### Backend Changes (Already Committed):
- ✅ CORS now allows all headers for x402 protocol
- ✅ Explicit OPTIONS handler added
- ✅ CORS headers added to 402 responses

### Action Required:
1. **Check Railway Backend Deployment:**
   - Go to Railway → Your Backend Service
   - Check if latest deployment is active
   - Look for commit: "Fix CORS configuration for x402 payment protocol"
   - If not deployed, click "Redeploy"

2. **Verify Backend is Running:**
   ```bash
   curl https://incryptsignal-production.up.railway.app/health
   ```
   Should return: `{"success":true,...}`

---

## 🧪 Testing Payment Flow Step-by-Step

### Step 1: Verify Setup
- [ ] Wallet connected to Devnet RPC (`https://api.devnet.solana.com`)
- [ ] Wallet has Devnet SOL (for gas fees)
- [ ] Wallet has Devnet USDC (at least 0.01 USDC)
- [ ] Frontend URL: `https://incrypt-signal.vercel.app`
- [ ] Backend URL: `https://incryptsignal-production.up.railway.app`

### Step 2: Test Connection
1. Open your Vercel frontend
2. Open Browser DevTools (F12) → **Console** tab
3. Connect your wallet
4. Check console for:
   - ✅ No connection errors
   - ✅ Wallet adapter connected
   - ✅ Network shows "devnet"

### Step 3: Test Payment Flow
1. Select a trading pair (e.g., BTC/USD)
2. Click "Get Signal"
3. **Expected behavior:**
   - ✅ No CORS errors in console
   - ✅ Wallet popup appears
   - ✅ Transaction shows payment to treasury
   - ✅ You approve transaction
   - ✅ Signal is delivered

### Step 4: Check for Errors

**In Browser Console, look for:**

✅ **Good Signs:**
- `POST .../api/signals 402 (Payment Required)` - Normal initial response
- `POST .../api/signals 200 (OK)` - Payment successful
- No CORS errors

❌ **Errors to Watch:**
- `CORS policy` errors → Backend not redeployed or CORS misconfigured
- `Failed to fetch` → Network issue or backend down
- `Invalid payment` → Payment transaction issue
- `Transaction failed` → Wallet transaction error (check wallet for details)

---

## 🚨 Common Issues & Solutions

### Issue 1: "Failed to fetch" with CORS Error

**Cause:** Backend CORS not deployed or misconfigured

**Solution:**
1. Check Railway backend logs
2. Verify backend was redeployed after latest commit
3. Ensure `FRONTEND_URL` in Railway includes your Vercel URL: `https://incrypt-signal.vercel.app`
4. Redeploy backend

### Issue 2: Payment Transaction Fails in Wallet

**Possible Causes:**
1. **Insufficient SOL for gas:**
   - Need SOL for transaction fees
   - Get more Devnet SOL from faucet

2. **Insufficient USDC:**
   - Need at least 0.01 USDC for payment
   - Get Devnet USDC from Circle faucet

3. **Wrong Network:**
   - Wallet must be on Devnet (not Testnet or Mainnet)
   - Verify in wallet settings

4. **Transaction Rejected:**
   - Check wallet for specific error message
   - May be due to slippage or insufficient balance

### Issue 3: Wallet Shows "Testnet" but Needs Devnet

**Solution:**
1. In Phantom: Settings → Developer Mode → Enable "Testnet Mode" (this enables Devnet)
2. Settings → Change Network → Select "Devnet"
3. In Solflare: Settings → Network → Select "Devnet"

### Issue 4: 402 Response Received but Payment Not Processing

**Check:**
1. Browser console → Look for x402 client errors
2. Network tab → Check request/response headers
3. Verify `X-Payment` header is being sent in subsequent request
4. Check backend logs for payment verification errors

---

## 📊 Expected Console Output (Success)

When payment works correctly, you should see:

```
POST https://incryptsignal-production.up.railway.app/api/signals 402 (Payment Required)
[Wallet] Transaction signing prompt appears
POST https://incryptsignal-production.up.railway.app/api/signals 200 (OK)
Signal received: { signal: "long", confidence: 0.8, ... }
```

---

## 🔗 Quick Reference Links

- **Devnet SOL Faucet:** https://faucet.solana.com
- **Devnet USDC Faucet:** https://faucet.circle.com
- **Devnet Explorer:** https://explorer.solana.com/?cluster=devnet
- **Your Backend Health:** https://incryptsignal-production.up.railway.app/health

---

## 📞 Next Steps

1. **Verify you have Devnet tokens** (not Testnet)
2. **Redeploy backend** if not already done
3. **Test payment flow** again
4. **Share specific error messages** if issues persist

The CORS issue is fixed - the main thing to verify is that you have **Devnet** tokens, not Testnet tokens!

