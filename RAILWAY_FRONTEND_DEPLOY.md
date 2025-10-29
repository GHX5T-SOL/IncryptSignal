# Railway Frontend Deployment - Step-by-Step Guide

## 🚨 Current Issue: Missing `vm` Polyfill Fixed

The build was failing due to missing `vm` polyfill. This has been fixed by:
- ✅ Adding `vm-browserify` dependency
- ✅ Adding `vm` fallback to webpack config
- ✅ Setting `CI=false` in build script to prevent warnings from failing builds

---

## 📋 Step-by-Step Railway Frontend Deployment

### Step 1: Verify Your Railway Project Setup

1. Go to https://railway.app and log in
2. Ensure you have a **separate service** for the frontend (not mixed with backend)
3. If you don't have a frontend service yet:
   - Click "+ New" → "Service"
   - Select "GitHub Repo"
   - Choose `GHX5T-SOL/IncryptSignal`

### Step 2: Configure Frontend Service Settings

In your Railway frontend service:

1. Click on the service → **Settings** tab
2. Set **Root Directory**: `frontend`
3. Verify **Build Command** (Railway auto-detects, but ensure it's):
   ```
   npm install --legacy-peer-deps && npm run build
   ```
4. Verify **Start Command** (should be):
   ```
   npm start
   ```
   OR if using Procfile (recommended):
   ```
   npx serve -s build -l $PORT
   ```

**Note:** Railway's Railpack auto-detects React apps, but you may need to manually set these.

### Step 3: Set Environment Variables

In Railway frontend service → **Variables** tab, add:

```
REACT_APP_API_URL=https://incryptsignal-production.up.railway.app
REACT_APP_NETWORK=devnet
NODE_ENV=production
```

**Important:** Replace `incryptsignal-production.up.railway.app` with your **actual backend URL** from your backend service.

To find your backend URL:
1. Go to your **backend service** in Railway
2. Click **Settings** → **Networking**
3. Copy the **Public Domain** (e.g., `incryptsignal-production.up.railway.app`)
4. Use that URL for `REACT_APP_API_URL`

### Step 4: Verify Procfile Exists

The frontend should have a `Procfile` in the `frontend/` directory with:
```
web: npm run build && npx serve -s build -l $PORT
```

If Railway doesn't detect it automatically, you may need to manually set the start command.

### Step 5: Deploy and Monitor

1. **Trigger Deployment:**
   - Push changes to GitHub (if auto-deploy is enabled)
   - OR click "Redeploy" in Railway dashboard

2. **Monitor Build Logs:**
   - Watch for: "Creating an optimized production build..."
   - Should see: "The build folder is ready to be deployed"
   - Should NOT see: "Module not found: Error: Can't resolve 'vm'"

3. **Check Deploy Logs:**
   - After build, should see: "Listening on port XXXX"
   - Service should show "Active" status

### Step 6: Test Your Deployment

1. Click on your frontend service → **Settings** → **Generate Domain**
2. Copy the public URL
3. Visit the URL in your browser
4. You should see:
   - IncryptSignal logo and title
   - "Connect your wallet" message
   - Footer with contact links

### Step 7: Verify Backend Connection

1. Open browser DevTools (F12)
2. Go to **Console** tab
3. Connect your wallet
4. Try requesting a signal
5. Check **Network** tab - API calls should go to your backend URL
6. Should NOT see CORS errors

---

## 🔧 Troubleshooting

### Issue: Build Still Fails with "Can't resolve 'vm'"

**Solution:**
- Verify `vm-browserify` is in `package.json` dependencies
- Verify `config-overrides.js` includes `vm: require.resolve('vm-browserify')`
- Delete `node_modules` and `package-lock.json`, then redeploy

### Issue: Build Fails with "Treating warnings as errors"

**Solution:**
- Verify build script includes `CI=false`
- Check that `package.json` has: `"build": "CI=false react-app-rewired build"`

### Issue: Frontend Shows Blank Page

**Solution:**
- Check browser console for errors
- Verify `REACT_APP_API_URL` is set correctly
- Check that backend URL is accessible (test with `curl https://your-backend.railway.app/health`)
- Verify CORS is configured on backend

### Issue: Environment Variables Not Working

**Solution:**
- Ensure variables start with `REACT_APP_`
- Redeploy after adding/changing variables
- Check Railway logs to verify variables are set
- Note: Variables are only available at **build time**, not runtime (React requirement)

---

## ✅ Checklist Before Deploying

- [ ] `vm-browserify` is in `frontend/package.json` dependencies
- [ ] `config-overrides.js` includes `vm` fallback
- [ ] Build script has `CI=false`
- [ ] `Procfile` exists in `frontend/` directory
- [ ] Environment variables are set in Railway:
  - [ ] `REACT_APP_API_URL` (with https:// protocol)
  - [ ] `REACT_APP_NETWORK=devnet`
  - [ ] `NODE_ENV=production`
- [ ] Root Directory is set to `frontend` in Railway
- [ ] Backend service is running and accessible
- [ ] Backend URL is correct (test with `/health` endpoint)

---

## 📝 Quick Reference

### Railway Service Settings:
```
Root Directory: frontend
Build Command: npm install --legacy-peer-deps && npm run build
Start Command: npm start (or Procfile)
```

### Required Environment Variables:
```
REACT_APP_API_URL=https://incryptsignal-production.up.railway.app
REACT_APP_NETWORK=devnet
NODE_ENV=production
```

### Current Fixes Applied:
- ✅ Added `vm-browserify` polyfill
- ✅ Updated webpack config with `vm` fallback
- ✅ Set `CI=false` to prevent warnings from failing builds
- ✅ Created `Procfile` for Railway deployment

---

## 🎯 Expected Build Output

When successful, you should see:
```
Creating an optimized production build...
Compiled successfully!
File sizes after gzip:
  ~220 kB  build/static/js/main.*.js
  ~6 kB    build/static/js/918.*.chunk.js
  ~5 kB    build/static/css/main.*.css
The build folder is ready to be deployed.
```

---

After following these steps, your frontend should deploy successfully on Railway! 🚀

