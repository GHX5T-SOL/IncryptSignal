import { createHash } from 'crypto';
import { pool } from '../db/connection.js';

export interface ReceiptData {
  transactionSignature: string;
  signalContent: string;
  timestamp: number;
  clientPublicKey?: string;
}

export interface ReceiptHash {
  hash: string;
  receiptData: ReceiptData;
  createdAt: number;
}

class ReceiptService {
  /**
   * Hash receipt data for trustless verification
   */
  hashReceipt(receiptData: ReceiptData): string {
    const dataString = JSON.stringify({
      tx: receiptData.transactionSignature,
      signal: receiptData.signalContent,
      timestamp: receiptData.timestamp,
      client: receiptData.clientPublicKey || '',
    });

    return createHash('sha256').update(dataString).digest('hex');
  }

  /**
   * Store receipt hash in PostgreSQL database
   */
  async storeReceipt(receiptData: ReceiptData): Promise<string> {
    const hash = this.hashReceipt(receiptData);
    const createdAt = Date.now();
    
    try {
      await pool.query(
        `INSERT INTO receipts (hash, transaction_signature, signal_content, timestamp, client_public_key, created_at)
         VALUES ($1, $2, $3, $4, $5, $6)
         ON CONFLICT (hash) DO NOTHING`,
        [
          hash,
          receiptData.transactionSignature,
          receiptData.signalContent,
          receiptData.timestamp,
          receiptData.clientPublicKey || null,
          createdAt,
        ]
      );
    } catch (error) {
      console.error('Error storing receipt in database:', error);
      // Fallback to in-memory if database fails (for backwards compatibility)
      throw error;
    }

    return hash;
  }

  /**
   * Verify receipt by hash from PostgreSQL database
   */
  async verifyReceipt(hash: string): Promise<ReceiptHash | null> {
    try {
      const result = await pool.query(
        `SELECT hash, transaction_signature, signal_content, timestamp, client_public_key, created_at
         FROM receipts
         WHERE hash = $1`,
        [hash]
      );

      if (result.rows.length === 0) {
        return null;
      }

      const row = result.rows[0];
      const receiptData: ReceiptData = {
        transactionSignature: row.transaction_signature,
        signalContent: row.signal_content,
        timestamp: row.timestamp,
        clientPublicKey: row.client_public_key || undefined,
      };

      // Verify hash matches
      const expectedHash = this.hashReceipt(receiptData);
      if (expectedHash !== hash) {
        return null;
      }

      return {
        hash,
        receiptData,
        createdAt: row.created_at,
      };
    } catch (error) {
      console.error('Error verifying receipt from database:', error);
      return null;
    }
  }

  /**
   * Get receipt by hash from PostgreSQL database
   */
  async getReceipt(hash: string): Promise<ReceiptHash | null> {
    return this.verifyReceipt(hash);
  }

  /**
   * Get all receipts from PostgreSQL database (for debugging/admin)
   */
  async getAllReceipts(limit: number = 100): Promise<ReceiptHash[]> {
    try {
      const result = await pool.query(
        `SELECT hash, transaction_signature, signal_content, timestamp, client_public_key, created_at
         FROM receipts
         ORDER BY created_at DESC
         LIMIT $1`,
        [limit]
      );

      return result.rows.map((row) => {
        const receiptData: ReceiptData = {
          transactionSignature: row.transaction_signature,
          signalContent: row.signal_content,
          timestamp: row.timestamp,
          clientPublicKey: row.client_public_key || undefined,
        };

        return {
          hash: row.hash,
          receiptData,
          createdAt: row.created_at,
        };
      });
    } catch (error) {
      console.error('Error getting all receipts from database:', error);
      return [];
    }
  }
}

export const receiptService = new ReceiptService();
