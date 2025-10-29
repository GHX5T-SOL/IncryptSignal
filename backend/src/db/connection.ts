import { Pool, PoolConfig } from 'pg';
import dotenv from 'dotenv';

dotenv.config();

// Parse PostgreSQL connection URL
const getPoolConfig = (): PoolConfig => {
  const connectionString = process.env.DATABASE_URL;
  
  if (!connectionString) {
    throw new Error('DATABASE_URL environment variable is not set');
  }

  // Parse the connection URL
  // Format: postgresql://user:password@host:port/database
  const url = new URL(connectionString);
  
  return {
    connectionString,
    ssl: process.env.NODE_ENV === 'production' ? {
      rejectUnauthorized: false, // Required for Railway's proxy
    } : false,
    max: 20, // Maximum number of clients in the pool
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 2000,
  };
};

// Create connection pool
const pool = new Pool(getPoolConfig());

// Test connection
pool.on('connect', () => {
  console.log('✅ Connected to PostgreSQL database');
});

pool.on('error', (err) => {
  console.error('❌ Unexpected error on idle PostgreSQL client', err);
  process.exit(-1);
});

// Initialize database schema
export async function initializeDatabase(): Promise<void> {
  try {
    // Create receipts table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS receipts (
        hash VARCHAR(64) PRIMARY KEY,
        transaction_signature TEXT NOT NULL,
        signal_content TEXT NOT NULL,
        timestamp BIGINT NOT NULL,
        client_public_key TEXT,
        created_at BIGINT NOT NULL
      );
    `);

    // Create reputation table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS reputation (
        agent_id VARCHAR(255) PRIMARY KEY,
        successes INTEGER DEFAULT 0,
        failures INTEGER DEFAULT 0,
        total_requests INTEGER DEFAULT 0,
        reputation_score DECIMAL(5, 4) DEFAULT 0.5,
        last_activity BIGINT NOT NULL,
        created_at BIGINT NOT NULL,
        updated_at BIGINT NOT NULL
      );
    `);

    // Create agent_stats table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS agent_stats (
        agent_id VARCHAR(255) PRIMARY KEY,
        roi_7d DECIMAL(10, 4) DEFAULT 0,
        roi_30d DECIMAL(10, 4) DEFAULT 0,
        roi_90d DECIMAL(10, 4) DEFAULT 0,
        max_drawdown DECIMAL(10, 4) DEFAULT 0,
        avg_gain_per_trade DECIMAL(10, 4) DEFAULT 0,
        avg_loss_per_trade DECIMAL(10, 4) DEFAULT 0,
        biggest_win DECIMAL(10, 4) DEFAULT 0,
        biggest_loss DECIMAL(10, 4) DEFAULT 0,
        total_trades INTEGER DEFAULT 0,
        win_rate DECIMAL(5, 4) DEFAULT 0,
        updated_at BIGINT NOT NULL
      );
    `);

    // Insert initial mock stats for agents
    await pool.query(`
      INSERT INTO agent_stats (agent_id, roi_7d, roi_30d, roi_90d, max_drawdown, avg_gain_per_trade, avg_loss_per_trade, biggest_win, biggest_loss, total_trades, win_rate, updated_at)
      VALUES 
        ('zyra', 15.8, 42.5, 128.3, -28.5, 8.2, -5.1, 45.3, -22.8, 150, 0.65, $1),
        ('aria', 8.2, 25.4, 67.8, -15.2, 5.1, -3.2, 28.7, -12.5, 200, 0.72, $1),
        ('nova', 4.5, 12.8, 34.2, -8.5, 2.8, -1.9, 15.2, -6.8, 250, 0.78, $1)
      ON CONFLICT (agent_id) DO NOTHING
    `, [Date.now()]);

    // Create indexes for better query performance
    await pool.query(`
      CREATE INDEX IF NOT EXISTS idx_receipts_timestamp ON receipts(timestamp);
      CREATE INDEX IF NOT EXISTS idx_receipts_client ON receipts(client_public_key);
      CREATE INDEX IF NOT EXISTS idx_reputation_score ON reputation(reputation_score DESC);
      CREATE INDEX IF NOT EXISTS idx_reputation_last_activity ON reputation(last_activity DESC);
    `);

    console.log('✅ Database schema initialized');
  } catch (error) {
    console.error('❌ Error initializing database schema:', error);
    throw error;
  }
}

export { pool };
export default pool;

