# PostgreSQL Database Setup Guide

## 🗄️ Database Configuration

Your Railway PostgreSQL database is now integrated into the backend!

## 📋 Environment Variable

Add this environment variable to your **Railway backend service**:

### In Railway Dashboard:

1. Go to your **Backend Service** in Railway
2. Click on **Variables** tab
3. Click **+ New Variable**
4. Add:

```
Key: DATABASE_URL
Value: postgresql://postgres:qIneecwkzbDZOVWnLVaWpbyVLdhjXTIL@gondola.proxy.rlwy.net:29810/railway
```

5. Click **Add** and Railway will automatically redeploy

---

## 🗃️ Database Schema

The backend automatically creates these tables on startup:

### `receipts` Table
Stores receipt hashes for trustless verification:
- `hash` (VARCHAR(64), PRIMARY KEY) - SHA256 hash of receipt data
- `transaction_signature` (TEXT) - Solana transaction signature
- `signal_content` (TEXT) - JSON-encoded signal data
- `timestamp` (BIGINT) - Unix timestamp
- `client_public_key` (TEXT) - Client's Solana public key
- `created_at` (BIGINT) - Creation timestamp

### `reputation` Table
Stores agent reputation scores:
- `agent_id` (VARCHAR(255), PRIMARY KEY) - Agent identifier (public key)
- `successes` (INTEGER) - Number of successful signal deliveries
- `failures` (INTEGER) - Number of failed deliveries
- `total_requests` (INTEGER) - Total number of requests
- `reputation_score` (DECIMAL(5, 4)) - Calculated success rate (0.0 - 1.0)
- `last_activity` (BIGINT) - Last activity timestamp
- `created_at` (BIGINT) - Creation timestamp
- `updated_at` (BIGINT) - Last update timestamp

### Indexes
- `idx_receipts_timestamp` - Fast queries by timestamp
- `idx_receipts_client` - Fast queries by client public key
- `idx_reputation_score` - Fast leaderboard queries by score
- `idx_reputation_last_activity` - Fast queries by activity time

---

## ✅ Verification

After deployment, check the logs for:

```
✅ Connected to PostgreSQL database
✅ Database schema initialized
✅ Database connected and schema initialized
```

If you see warnings like:
```
⚠️  DATABASE_URL not set. Using in-memory storage (not persistent).
```

Then the `DATABASE_URL` environment variable is not set correctly.

---

## 🔍 Testing the Connection

### Option 1: Check Railway Logs

After deployment, look for database initialization messages in the logs.

### Option 2: Health Check

The backend has a health endpoint:
```
GET https://incryptsignal-production.up.railway.app/health
```

This should return:
```json
{
  "success": true,
  "data": {
    "status": "healthy",
    "timestamp": "...",
    "service": "IncryptSignal Backend"
  }
}
```

### Option 3: Test Receipt Storage

1. Make a payment request from the frontend
2. Check the receipt endpoint:
   ```
   GET https://incryptsignal-production.up.railway.app/api/receipt/{hash}
   ```
3. If it returns data, the database is working!

---

## 🔧 Manual Database Access (Optional)

If you need to manually query the database:

### Using Railway CLI:
```bash
railway connect Postgres
```

### Using `psql`:
```bash
PGPASSWORD=qIneecwkzbDZOVWnLVaWpbyVLdhjXTIL psql -h gondola.proxy.rlwy.net -U postgres -p 29810 -d railway
```

### Example Queries:

```sql
-- View all receipts
SELECT * FROM receipts ORDER BY created_at DESC LIMIT 10;

-- View reputation leaderboard
SELECT * FROM reputation ORDER BY reputation_score DESC LIMIT 10;

-- Count total receipts
SELECT COUNT(*) FROM receipts;

-- View reputation for specific agent
SELECT * FROM reputation WHERE agent_id = 'YOUR_PUBLIC_KEY';
```

---

## 📝 Notes

- **Automatic Schema Creation**: The database schema is created automatically on first connection
- **No Migration Needed**: Tables are created with `CREATE TABLE IF NOT EXISTS`, so it's safe to run multiple times
- **SSL Required**: Railway's proxy requires SSL connections, which is handled automatically
- **Connection Pooling**: Uses connection pooling for better performance (max 20 connections)
- **Fallback Behavior**: If `DATABASE_URL` is not set, the backend will warn but continue to work (data won't persist)

---

## 🚨 Troubleshooting

### Error: "DATABASE_URL environment variable is not set"
- **Solution**: Add the `DATABASE_URL` variable in Railway dashboard

### Error: "Connection refused" or "ECONNREFUSED"
- **Solution**: Check that the database is running in Railway and the connection string is correct

### Error: "SSL required"
- **Solution**: The backend automatically handles SSL for Railway. If you see this, check Railway's database status

### Tables Not Creating
- **Solution**: Check logs for database initialization errors. The schema creation happens on startup.

---

## 📦 What Changed

- ✅ Added `pg` (PostgreSQL client) dependency
- ✅ Created `backend/src/db/connection.ts` - Database connection and schema initialization
- ✅ Updated `backend/src/services/receiptService.ts` - Now uses PostgreSQL instead of in-memory
- ✅ Updated `backend/src/services/reputationService.ts` - Now uses PostgreSQL instead of in-memory
- ✅ Updated `backend/src/server.ts` - Initializes database on startup
- ✅ Updated `backend/src/routes/signals.ts` - All service calls are now async/await
- ✅ Updated `backend/.env.example` - Added `DATABASE_URL` example

---

Your data is now **persistent**! 🎉

