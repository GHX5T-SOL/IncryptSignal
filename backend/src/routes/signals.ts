import { Router, Request, Response } from 'express';
import { SignalService } from '../services/signalService';
import { agentService } from '../services/agentService';
import { receiptService } from '../services/receiptService';
import { reputationService } from '../services/reputationService';
import { createX402Middleware } from '../middleware/x402';

export function createSignalsRouter(
  signalService: SignalService,
  x402Config: {
    network: 'solana' | 'solana-devnet';
    treasuryAddress: string;
    facilitatorUrl: string;
    usdcMint: string;
    signalPrice: string;
  }
): Router {
  const router = Router();

  // Payment-protected signal endpoint
  router.post(
    '/api/signals',
    createX402Middleware(x402Config, {
      price: x402Config.signalPrice,
      description: 'Trading signal request',
      resource: '/api/signals',
    }),
    async (req: Request, res: Response) => {
      try {
        const { symbol, agentId } = req.body;

        if (!symbol || typeof symbol !== 'string') {
          res.status(400).json({
            success: false,
            error: 'Invalid symbol parameter',
          });
          return;
        }

        if (!agentId || typeof agentId !== 'string') {
          res.status(400).json({
            success: false,
            error: 'Invalid agentId parameter',
          });
          return;
        }

        // Validate symbol
        if (!signalService.isValidSymbol(symbol)) {
          res.status(400).json({
            success: false,
            error: `Unsupported trading pair: ${symbol}. Available pairs: ${signalService['pythService'].getAvailablePairs().join(', ')}`,
          });
          return;
        }

        // Validate agent
        const agent = agentService.getAgent(agentId);
        if (!agent) {
          res.status(400).json({
            success: false,
            error: `Invalid agent: ${agentId}. Available agents: zyra, aria, nova`,
          });
          return;
        }

        // Generate agent signal
        const signal = await agentService.generateAgentSignal(agentId, symbol);

        if (!signal) {
          res.status(500).json({
            success: false,
            error: 'Failed to generate signal',
          });
          return;
        }

        // Extract payment info from middleware
        const paymentInfo = (req as any).paymentInfo;
        const transactionSignature = paymentInfo?.paymentHeader?.transactionSignature || '';

        // Store receipt
        const receiptData = {
          transactionSignature,
          signalContent: JSON.stringify(signal),
          timestamp: Date.now(),
          clientPublicKey: paymentInfo?.paymentHeader?.clientPublicKey || '',
        };

        const receiptHash = await receiptService.storeReceipt(receiptData);

        // Update reputation using actual agent ID
        await reputationService.updateReputation(agentId, true);

        // Return signal with receipt
        res.json({
          success: true,
          data: {
            signal,
            receipt: {
              hash: receiptHash,
              transactionSignature,
            },
          },
        });
      } catch (error) {
        console.error('Error processing signal request:', error);
        res.status(500).json({
          success: false,
          error: 'Internal server error',
        });
      }
    }
  );

  // Receipt verification endpoint (public)
  router.get('/api/receipt/:hash', async (req: Request, res: Response) => {
    try {
      const { hash } = req.params;

      const receipt = await receiptService.getReceipt(hash);

      if (!receipt) {
        res.status(404).json({
          success: false,
          error: 'Receipt not found',
        });
        return;
      }

      res.json({
        success: true,
        data: receipt,
      });
    } catch (error) {
      console.error('Error verifying receipt:', error);
      res.status(500).json({
        success: false,
        error: 'Internal server error',
      });
    }
  });

  // Reputation endpoints (public)
  router.get('/api/reputation', async (req: Request, res: Response) => {
    try {
      const { agentId } = req.query;

      if (agentId && typeof agentId === 'string') {
        const reputation = await reputationService.getReputation(agentId);
        if (!reputation) {
          res.status(404).json({
            success: false,
            error: 'Reputation not found for agent',
          });
          return;
        }
        res.json({
          success: true,
          data: reputation,
        });
      } else {
        const allReputations = await reputationService.getAllReputations();
        res.json({
          success: true,
          data: allReputations,
        });
      }
    } catch (error) {
      console.error('Error fetching reputation:', error);
      res.status(500).json({
        success: false,
        error: 'Internal server error',
      });
    }
  });

  router.get('/api/reputation/leaderboard', async (req: Request, res: Response) => {
    try {
      const limit = req.query.limit ? parseInt(req.query.limit as string, 10) : 10;
      const leaderboard = await reputationService.getLeaderboard(limit);

      res.json({
        success: true,
        data: leaderboard,
      });
    } catch (error) {
      console.error('Error fetching leaderboard:', error);
      res.status(500).json({
        success: false,
        error: 'Internal server error',
      });
    }
  });

  return router;
}

