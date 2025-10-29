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

