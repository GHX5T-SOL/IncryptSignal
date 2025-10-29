# Complete Deployment Guide - IncryptSignal

## 🎯 Recommended Deployment Option: **Railway**

**Why Railway?**
- ✅ Deploys both frontend and backend easily
- ✅ Automatic HTTPS
- ✅ Environment variable management
- ✅ PostgreSQL database available (for production)
- ✅ Simple git-based deployment
- ✅ Free tier with generous limits
- ✅ Better for Node.js applications

---

## Option 1: Railway Deployment (Recommended)

### Prerequisites
1. GitHub account (already have repository)
2. Railway account (free signup at https://railway.app)

### Step 1: Setup Railway Account

1. Go to https://railway.app
2. Click "Start a New Project"
3. Sign in with GitHub
4. Authorize Railway to access your repositories

### Step 2: Deploy Backend

1. In Railway dashboard, click "+ New Project"
2. Select "Deploy from GitHub repo"
3. Choose `GHX5T-SOL/IncryptSignal`
4. Select the repository
5. Railway will detect the project structure
6. In the service settings, click "Settings" → "Change Source"
7. Set the **Root Directory** to: `backend`
8. Set the **Start Command** to: `npm run build && npm start`

#### Configure Backend Environment Variables

In Railway backend service → Variables tab, add:

```
SOLANA_NETWORK=devnet
RPC_URL=https://api.devnet.solana.com
USDC_MINT_ADDRESS=4zMMC9srt5Ri5X14GAgXhaHii3GnPAEERYPJgZJDncDU
TREASURY_WALLET_ADDRESS=<your-treasury-address>
FACILITATOR_URL=https://facilitator.payai.network
PYTH_NETWORK=devnet
PORT=3001
SIGNAL_PRICE_MICRO_USDC=10000
NODE_ENV=production
```

#### Generate Treasury Wallet (if needed)

Run this locally first:
```bash
cd backend
npx tsx src/utils/generateTreasury.ts
```

Copy the public key to `TREASURY_WALLET_ADDRESS`.

#### Get Backend URL

1. In Railway backend service → Settings
2. Click "Generate Domain" or note the provided domain
3. Example: `incryptsignal-backend.railway.app`
4. Copy this URL - you'll need it for frontend

### Step 3: Deploy Frontend

1. In Railway dashboard, click "+ New" → "Service"
2. Select "Deploy from GitHub repo"
3. Choose the same repository: `GHX5T-SOL/IncryptSignal`
4. In service settings:
   - Set **Root Directory** to: `frontend`
   - Set **Build Command** to: `npm install --legacy-peer-deps && npm run build`
   - Set **Start Command** to: `npx serve -s build -l 3000`

#### Configure Frontend Environment Variables

In Railway frontend service → Variables tab, add:

```
REACT_APP_API_URL=https://incryptsignal-backend.railway.app
REACT_APP_NETWORK=devnet
NODE_ENV=production
```

**Important:** Replace `incryptsignal-backend.railway.app` with your actual backend URL from Step 2.

#### Install Serve Package

Add `serve` to frontend dependencies temporarily, or update `package.json`:

```json
"scripts": {
  "start": "react-scripts start",
  "build": "react-scripts build",
  "serve": "serve -s build -l 3000"
},
"devDependencies": {
  "serve": "^14.2.1"
}
```

Or use Railway's static file serving (see alternative below).

### Step 4: Add PostgreSQL Database (Optional but Recommended)

For production, you'll want persistent storage for receipts and reputation:

1. In Railway, click "+ New" → "Database" → "Add PostgreSQL"
2. Railway will create a database
3. Note the connection string in the Variables tab
4. Update backend to use database instead of in-memory storage

### Step 5: Verify Deployment

1. **Backend Health Check:**
   ```
   https://incryptsignal-backend.railway.app/health
   ```
   Should return: `{"success":true,"data":{"status":"healthy",...}}`

2. **Frontend:**
   ```
   https://incryptsignal-frontend.railway.app
   ```
   Should show the IncryptSignal UI

3. **Test Flow:**
   - Connect wallet
   - Request signal
   - Verify payment flow works

---

## Option 2: Vercel Deployment (Frontend Only - Current Setup)

### Frontend on Vercel

#### Step 1: Create Vercel Account
1. Go to https://vercel.com
2. Sign in with GitHub
3. Import your repository: `GHX5T-SOL/IncryptSignal`

#### Step 2: Configure Vercel Project

1. In project settings → General
2. Set **Root Directory** to: `frontend`
3. Set **Build Command**: `npm install --legacy-peer-deps && npm run build`
4. Set **Output Directory**: `build`
5. Set **Install Command**: `npm install --legacy-peer-deps`

#### Step 3: Set Environment Variables

In Vercel → Settings → Environment Variables:

```
REACT_APP_API_URL=https://your-backend-url.com
REACT_APP_NETWORK=devnet
```

#### Step 4: Deploy

Click "Deploy" - Vercel will automatically build and deploy.

### Backend on Railway/Fly.io/Render

Since Vercel is primarily for frontend, deploy backend separately:

**Railway (Recommended):**
- Follow "Option 1: Railway Deployment" → Step 2

**Render (Alternative):**
- See Option 3 below

---

## Option 3: Render Deployment

### Deploy Backend on Render

1. Go to https://render.com
2. Sign up/Sign in with GitHub
3. Click "New +" → "Web Service"
4. Connect your GitHub repository
5. Configure:
   - **Name**: `incryptsignal-backend`
   - **Environment**: `Node`
   - **Root Directory**: `backend`
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `npm start`
   - **Plan**: Free tier is fine for devnet

6. Add Environment Variables (same as Railway backend)
7. Click "Create Web Service"

### Deploy Frontend on Render

1. Click "New +" → "Static Site"
2. Connect repository
3. Configure:
   - **Name**: `incryptsignal-frontend`
   - **Root Directory**: `frontend`
   - **Build Command**: `npm install --legacy-peer-deps && npm run build`
   - **Publish Directory**: `build`

4. Add Environment Variables (same as Railway frontend)
5. Click "Create Static Site"

---

## Option 4: Full Vercel (Frontend + Backend as Serverless)

Vercel supports backend as serverless functions, but requires code changes.

### Setup Required:

1. Move backend to `api/` directory in root
2. Create `api/index.ts` that exports Express handler
3. Use Vercel serverless function format
4. This requires significant refactoring - not recommended for your current structure

---

## 🗄️ Database Options for Production

### Option A: PostgreSQL (Recommended)
- **Railway PostgreSQL**: Free tier, easy setup
- **Supabase**: Free tier, PostgreSQL + real-time
- **Neon**: Serverless PostgreSQL, generous free tier

### Option B: MongoDB Atlas
- Free tier available
- Easy to use with Node.js

### Option C: SQLite (Simple)
- Good for small scale
- Can use Railway's disk storage

### Implementation Steps (PostgreSQL Example):

1. **Install dependencies:**
   ```bash
   cd backend
   npm install pg @types/pg
   ```

2. **Create database service:**
   ```typescript
   // backend/src/services/databaseService.ts
   import { Pool } from 'pg';
   
   const pool = new Pool({
     connectionString: process.env.DATABASE_URL,
   });
   ```

3. **Update receipt/reputation services** to use database instead of in-memory maps

---

## 🔐 Environment Variables Checklist

### Backend (.env)
```
✓ SOLANA_NETWORK=devnet
✓ RPC_URL=https://api.devnet.solana.com
✓ USDC_MINT_ADDRESS=4zMMC9srt5Ri5X14GAgXhaHii3GnPAEERYPJgZJDncDU
✓ TREASURY_WALLET_ADDRESS=<your-key>
✓ FACILITATOR_URL=https://facilitator.payai.network
✓ PYTH_NETWORK=devnet
✓ PORT=3001 (or use platform default)
✓ SIGNAL_PRICE_MICRO_USDC=10000
✓ NODE_ENV=production
✓ DATABASE_URL=<if using database>
```

### Frontend (.env.local)
```
✓ REACT_APP_API_URL=<your-backend-url>
✓ REACT_APP_NETWORK=devnet
✓ NODE_ENV=production
```

---

## 🌐 CORS Configuration

Your backend already has CORS enabled, but verify it allows your frontend URL:

```typescript
// backend/src/server.ts
app.use(cors({
  origin: process.env.FRONTEND_URL || '*',
  credentials: true,
}));
```

Add `FRONTEND_URL` environment variable in backend:
```
FRONTEND_URL=https://incryptsignal-frontend.railway.app
```

---

## 📋 Quick Deployment Checklist

### Pre-Deployment
- [ ] Generate treasury wallet keypair
- [ ] Test locally (backend + frontend)
- [ ] Verify all environment variables are documented
- [ ] Check all dependencies are in package.json

### Backend Deployment
- [ ] Create backend service on Railway/Render
- [ ] Set root directory to `backend`
- [ ] Configure build/start commands
- [ ] Add all environment variables
- [ ] Deploy and test `/health` endpoint
- [ ] Note the backend URL

### Frontend Deployment
- [ ] Create frontend service
- [ ] Set root directory to `frontend`
- [ ] Configure build commands with `--legacy-peer-deps`
- [ ] Add environment variables (with backend URL)
- [ ] Deploy and verify it loads
- [ ] Test wallet connection
- [ ] Test signal request flow

### Post-Deployment
- [ ] Test full payment flow
- [ ] Verify receipts are generated
- [ ] Check reputation tracking
- [ ] Monitor logs for errors
- [ ] Set up custom domains (optional)

---

## 🚀 Recommended: Railway Full Stack

I recommend using **Railway** for both services because:

1. **Single platform** - manage everything in one place
2. **Easy database** - can add PostgreSQL with one click
3. **Git integration** - automatic deployments on push
4. **Simple pricing** - pay only for what you use
5. **Great DX** - excellent dashboard and logs
6. **No config files needed** - just point to directories

### Railway Quick Start Commands:

```bash
# Install Railway CLI (optional, but helpful)
npm i -g @railway/cli

# Login
railway login

# Link project
railway link

# Add environment variables
railway variables set SOLANA_NETWORK=devnet
railway variables set TREASURY_WALLET_ADDRESS=<your-key>
# ... etc
```

---

## 📊 Cost Estimation

### Railway (Free Tier):
- **Backend**: $5/month free credit (covers small app)
- **Frontend**: Included in free tier
- **PostgreSQL**: $5/month for small database
- **Total**: ~$5-10/month after free credits

### Render (Free Tier):
- **Backend**: Free (spins down after inactivity)
- **Frontend**: Free
- **PostgreSQL**: Included free tier (limited)
- **Total**: Free for low traffic

### Vercel:
- **Frontend**: Free (generous limits)
- **Backend**: Not ideal (needs serverless conversion)
- **Total**: Free for frontend

---

## 🔧 Troubleshooting

### Build Fails on TypeScript
- ✅ Already fixed - TypeScript downgraded to 4.9.5
- ✅ `.npmrc` files added with `legacy-peer-deps=true`

### Backend Won't Start
- Check `PORT` environment variable (Railway provides automatically)
- Check all required env vars are set
- View logs: Railway → Service → Deployments → View Logs

### Frontend Can't Connect to Backend
- Verify `REACT_APP_API_URL` is correct
- Check CORS configuration
- Verify backend is running (check `/health` endpoint)
- Check backend logs for errors

### Payment Flow Fails
- Verify `FACILITATOR_URL` is correct
- Check `TREASURY_WALLET_ADDRESS` is set
- Check `USDC_MINT_ADDRESS` matches network (devnet)
- View backend logs for x402 errors

---

## 🎯 Next Steps After Deployment

1. **Set up monitoring** - Railway/Render provide built-in logs
2. **Add database** - For persistent receipts/reputation
3. **Set up domain** - Add custom domain in platform settings
4. **Configure SSL** - Automatic with Railway/Render
5. **Test on mobile** - Verify responsive design works
6. **Record demo video** - Show full deployment working

---

## 📚 Additional Resources

- [Railway Docs](https://docs.railway.app)
- [Render Docs](https://render.com/docs)
- [Vercel Docs](https://vercel.com/docs)
- [PostgreSQL Setup](https://www.postgresql.org/docs/)

---

**Ready to deploy? Start with Railway - it's the simplest for your stack!** 🚀

