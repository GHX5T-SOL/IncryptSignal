import { createHash } from 'crypto';

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
  // In-memory storage for demo (in production, use database or on-chain)
  private receipts: Map<string, ReceiptHash> = new Map();

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
   * Store receipt hash for verification
   */
  storeReceipt(receiptData: ReceiptData): string {
    const hash = this.hashReceipt(receiptData);
    
    this.receipts.set(hash, {
      hash,
      receiptData,
      createdAt: Date.now(),
    });

    return hash;
  }

  /**
   * Verify receipt by hash
   */
  verifyReceipt(hash: string): ReceiptHash | null {
    const receipt = this.receipts.get(hash);
    
    if (!receipt) {
      return null;
    }

    // Verify hash matches
    const expectedHash = this.hashReceipt(receipt.receiptData);
    if (expectedHash !== hash) {
      return null;
    }

    return receipt;
  }

  /**
   * Get receipt by hash
   */
  getReceipt(hash: string): ReceiptHash | null {
    return this.receipts.get(hash) || null;
  }

  /**
   * Get all receipts (for debugging/admin)
   */
  getAllReceipts(): ReceiptHash[] {
    return Array.from(this.receipts.values());
  }
}

export const receiptService = new ReceiptService();

