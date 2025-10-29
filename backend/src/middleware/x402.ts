import { Request, Response, NextFunction } from 'express';
import { X402PaymentHandler } from '@payai/x402-solana/server';

interface X402Config {
  network: 'solana' | 'solana-devnet';
  treasuryAddress: string;
  facilitatorUrl: string;
  usdcMint: string;
}

export function createX402Middleware(config: X402Config, routeConfig: { price: string; description: string; resource: string }) {
  const x402 = new X402PaymentHandler({
    network: config.network,
    treasuryAddress: config.treasuryAddress,
    facilitatorUrl: config.facilitatorUrl,
  });

  return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      // Extract payment header
      const paymentHeader = x402.extractPayment(req.headers);

      // Create payment requirements
      const paymentRequirements = await x402.createPaymentRequirements({
        price: {
          amount: routeConfig.price, // In micro-units as string
          asset: {
            address: config.usdcMint,
          },
        },
        network: config.network,
        config: {
          description: routeConfig.description,
          resource: routeConfig.resource,
        },
      });

      // If no payment header, return 402
      if (!paymentHeader) {
        const response = x402.create402Response(paymentRequirements);
        res.status(response.status).json(response.body);
        return;
      }

      // Verify payment
      const verified = await x402.verifyPayment(paymentHeader, paymentRequirements);
      if (!verified) {
        res.status(402).json({
          success: false,
          error: 'Invalid payment',
        });
        return;
      }

      // Settle payment
      await x402.settlePayment(paymentHeader, paymentRequirements);

      // Attach payment info to request for use in route handlers
      (req as any).paymentInfo = {
        paymentHeader,
        paymentRequirements,
      };

      next();
    } catch (error) {
      console.error('x402 middleware error:', error);
      res.status(500).json({
        success: false,
        error: 'Payment processing error',
      });
    }
  };
}

