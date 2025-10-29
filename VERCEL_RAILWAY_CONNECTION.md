# Connecting Vercel Frontend to Railway Backend

## 🎯 Current Setup
- ✅ **Frontend**: Deployed on Vercel (working)
- ✅ **Backend**: Deployed on Railway
- 🔗 **Goal**: Connect frontend to backend API

---

## 📋 Step-by-Step Connection Guide

### Step 1: Get Your Backend URL from Railway

1. Go to https://railway.app
2. Open your **backend service**
3. Click **Settings** → **Networking** tab
4. Copy the **Public Domain** URL
   - Example: `incryptsignal-production.up.railway.app`
   - Full URL: `https://incryptsignal-production.up.railway.app`

### Step 2: Test Backend Health

Verify your backend is accessible:

```bash
curl https://incryptsignal-production.up.railway.app/health
```

Should return:
```json
{"success":true,"data":{"status":"healthy",...}}
```

### Step 3: Configure Vercel Frontend Environment Variables

1. Go to https://vercel.com
2. Select your **IncryptSignal project**
3. Go to **Settings** → **Environment Variables**
4. Add the following variables:

   **For Production:**
   ```
   REACT_APP_API_URL=https://incryptsignal-production.up.railway.app
   REACT_APP_NETWORK=devnet
   ```

   **For Preview/Development:**
   ```
   REACT_APP_API_URL=https://incryptsignal-production.up.railway.app
   REACT_APP_NETWORK=devnet
   ```

   **Important Notes:**
   - Replace `incryptsignal-production.up.railway.app` with your actual backend URL
   - Use `https://` (not `http://`)
   - No trailing slash
   - Variables must start with `REACT_APP_` to be accessible in the browser

5. Click **Save**

### Step 4: Configure Railway Backend CORS

1. Go to Railway → **Backend Service** → **Variables** tab
2. Add/Update the following variable:

   ```
   FRONTEND_URL=https://your-vercel-app.vercel.app
   ```

   **Important:**
   - Replace `your-vercel-app.vercel.app` with your actual Vercel frontend URL
   - To find your Vercel URL: Vercel Dashboard → Your Project → Domains
   - If you have multiple domains, you can use comma-separated values:
     ```
     FRONTEND_URL=https://incryptsignal.vercel.app,https://incryptsignal-git-main-yourname.vercel.app
     ```

3. **Redeploy** the backend service after adding/updating this variable

### Step 5: Redeploy Frontend

1. In Vercel Dashboard → Your Project
2. Go to **Deployments** tab
3. Click **⋯** (three dots) → **Redeploy**
4. Or push a new commit to trigger auto-deploy
5. Wait for deployment to complete

### Step 6: Test the Connection

1. Open your Vercel frontend URL in a browser
2. Open **Browser DevTools** (F12)
3. Go to **Console** tab
4. Connect your wallet
5. Try requesting a signal
6. Check **Network** tab:
   - Should see requests to `https://incryptsignal-production.up.railway.app/api/signals`
   - Should NOT see CORS errors
   - Requests should return `200` or `402` (Payment Required) status

---

## 🔍 Troubleshooting

### Issue: CORS Error in Browser Console

**Error:** `Access to fetch at '...' from origin '...' has been blocked by CORS policy`

**Solution:**
1. Verify `FRONTEND_URL` is set in Railway backend variables
2. Ensure the URL matches exactly (including `https://` and no trailing slash)
3. Redeploy backend after changing `FRONTEND_URL`
4. Check backend logs for CORS-related errors

### Issue: "Failed to fetch" or Network Error

**Solution:**
1. Verify backend is running: Test `/health` endpoint
2. Check that `REACT_APP_API_URL` is set correctly in Vercel
3. Ensure backend URL uses `https://` (not `http://`)
4. Check Railway backend logs for errors

### Issue: 402 Payment Required Not Showing

**Solution:**
1. Verify x402 middleware is working (check backend logs)
2. Ensure `TREASURY_WALLET_ADDRESS` is set in Railway backend
3. Check that `FACILITATOR_URL` is correct
4. Verify wallet is connected in frontend

### Issue: Backend Returns 500 Error

**Solution:**
1. Check Railway backend logs for detailed error
2. Verify all required environment variables are set:
   - `TREASURY_WALLET_ADDRESS`
   - `FACILITATOR_URL`
   - `USDC_MINT_ADDRESS`
   - `SOLANA_NETWORK`
3. Check that Pyth Network connection is working

---

## ✅ Verification Checklist

### Backend (Railway):
- [ ] Backend service is running and shows "Active"
- [ ] `/health` endpoint returns success
- [ ] Environment variables are set:
  - [ ] `TREASURY_WALLET_ADDRESS`
  - [ ] `FACILITATOR_URL`
  - [ ] `USDC_MINT_ADDRESS`
  - [ ] `SOLANA_NETWORK=devnet`
  - [ ] `FRONTEND_URL` (with your Vercel URL)
- [ ] Backend URL is accessible: `https://your-backend.railway.app`

### Frontend (Vercel):
- [ ] Frontend is deployed and accessible
- [ ] Environment variables are set:
  - [ ] `REACT_APP_API_URL` (with your Railway backend URL)
  - [ ] `REACT_APP_NETWORK=devnet`
- [ ] Frontend redeployed after adding `REACT_APP_API_URL`

### Connection:
- [ ] No CORS errors in browser console
- [ ] Network requests show correct backend URL
- [ ] API calls return expected responses (200, 402, etc.)
- [ ] Wallet connection works
- [ ] Signal request flow works

---

## 🔗 Quick Reference

### Vercel Environment Variables:
```env
REACT_APP_API_URL=https://incryptsignal-production.up.railway.app
REACT_APP_NETWORK=devnet
```

### Railway Backend Environment Variables:
```env
FRONTEND_URL=https://your-vercel-app.vercel.app
SOLANA_NETWORK=devnet
TREASURY_WALLET_ADDRESS=<your-treasury-address>
FACILITATOR_URL=https://facilitator.payai.network
USDC_MINT_ADDRESS=4zMMC9srt5Ri5X14GAgXhaHii3GnPAEERYPJgZJDncDU
PYTH_NETWORK=devnet
RPC_URL=https://api.devnet.solana.com
PORT=3001
SIGNAL_PRICE_MICRO_USDC=10000
NODE_ENV=production
```

---

## 🎯 Expected Flow

1. **User visits Vercel frontend** → Sees IncryptSignal UI
2. **User connects wallet** → Solana wallet adapter connects
3. **User requests signal** → Frontend calls `REACT_APP_API_URL/api/signals`
4. **Request goes to Railway backend** → Backend processes request
5. **Backend returns 402 Payment Required** → Frontend x402 client handles payment
6. **Payment processed** → Backend delivers signal
7. **Signal displayed** → User sees trading signal

---

## 🚀 You're All Set!

Once both services are configured with the correct URLs:
- Frontend on Vercel will call backend on Railway
- CORS is configured to allow requests
- Payment flow will work end-to-end

Monitor both Vercel and Railway logs if you encounter any issues!

