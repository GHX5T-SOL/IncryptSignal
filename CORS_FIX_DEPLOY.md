# CORS Fix for x402 Payment Protocol

## 🔧 Issue Fixed

The payment was failing with CORS error:
```
Access to fetch at '...' from origin '...' has been blocked by CORS policy: 
Request header field access-control-expose-headers is not allowed by 
Access-Control-Allow-Headers in preflight response.
```

## ✅ Solution Applied

1. **Updated CORS configuration** to allow all headers (`allowedHeaders: '*'`) for x402 protocol compatibility
2. **Added explicit OPTIONS handler** for preflight requests
3. **Added CORS headers to 402 responses** so the client can read the payment requirements
4. **Exposed X-Payment headers** so the client can access payment-related response headers

## 📋 Deploy Steps

### Step 1: Redeploy Backend on Railway

1. Go to Railway Dashboard → Your Backend Service
2. The changes are already committed and pushed to GitHub
3. Railway should auto-deploy, OR click **"Redeploy"**
4. Wait for deployment to complete

### Step 2: Verify Backend is Running

1. Test the health endpoint:
   ```bash
   curl https://incryptsignal-production.up.railway.app/health
   ```
2. Should return: `{"success":true,"data":{"status":"healthy",...}}`

### Step 3: Test Payment Flow

1. Open your Vercel frontend: `https://incrypt-signal.vercel.app`
2. Connect your wallet (make sure it's on Devnet)
3. Request a signal (e.g., BTC/USD)
4. You should see:
   - ✅ No CORS errors in console
   - ✅ Payment prompt in wallet
   - ✅ After approval, signal is delivered

### Step 4: Check for Errors

**If payment still fails:**
1. Open Browser DevTools (F12) → **Console** tab
2. Look for any new errors
3. Check **Network** tab for request/response details
4. Share the error messages if issues persist

---

## 🔍 What Was Changed

### File: `backend/src/server.ts`
- Changed `allowedHeaders` from specific list to `'*'` (allow all)
- Added explicit OPTIONS handler for preflight
- Enhanced exposed headers for x402 protocol

### File: `backend/src/middleware/x402.ts`
- Added CORS headers to 402 Payment Required responses
- Added CORS headers to invalid payment responses
- Ensures client can read payment requirements from 402 response

---

## ✅ Expected Behavior After Fix

1. **Initial Request:**
   - Frontend → Backend: `POST /api/signals`
   - Backend → Frontend: `402 Payment Required` (with CORS headers)

2. **Payment Flow:**
   - x402 client intercepts 402 response
   - Creates payment transaction
   - User approves in wallet
   - Transaction signed and sent

3. **Final Request:**
   - Frontend → Backend: `POST /api/signals` (with `X-Payment` header)
   - Backend verifies payment
   - Backend → Frontend: `200 OK` with signal data

---

## 🚨 Important Notes

### Network Configuration

**Make sure your wallet is on Devnet:**
- Your console shows you have "testnet solana and testnet USDC"
- But the backend is configured for **Devnet** (not Testnet)
- Solana Devnet ≠ Testnet

**To fix:**
1. Switch your wallet to **Devnet** (not Testnet)
2. Get Devnet SOL from: https://faucet.solana.com
3. Get Devnet USDC from: https://faucet.circle.com (for USDC on Devnet)

### Backend Configuration

Ensure Railway backend has:
- `SOLANA_NETWORK=devnet` (NOT testnet)
- `PYTH_NETWORK=devnet`
- `USDC_MINT_ADDRESS=4zMMC9srt5Ri5X14GAgXhaHii3GnPAEERYPJgZJDncDU` (Devnet USDC)

### Frontend Configuration

Ensure Vercel has:
- `REACT_APP_NETWORK=devnet` (NOT testnet)
- `REACT_APP_API_URL=https://incryptsignal-production.up.railway.app`

---

## 🎯 Next Steps

1. ✅ Redeploy backend (changes already pushed)
2. ✅ Switch wallet to Devnet (if currently on Testnet)
3. ✅ Get Devnet SOL and USDC
4. ✅ Test payment flow
5. ✅ Share any remaining errors

---

The CORS issue should now be resolved! The backend will accept all headers needed for the x402 payment protocol.

