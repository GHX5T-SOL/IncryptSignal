import { Keypair } from '@solana/web3.js';
import * as fs from 'fs';
import * as path from 'path';

/**
 * Generate a treasury wallet keypair
 * Run with: npx tsx src/utils/generateTreasury.ts
 */
function generateTreasury() {
  const keypair = Keypair.generate();
  const publicKey = keypair.publicKey.toBase58();
  const privateKey = Array.from(keypair.secretKey);

  const outputDir = path.join(__dirname, '../../');
  const keypairPath = path.join(outputDir, 'treasury-wallet.json');

  // Save keypair (NEVER commit this file)
  fs.writeFileSync(keypairPath, JSON.stringify(privateKey, null, 2));

  console.log('\n✅ Treasury wallet generated!\n');
  console.log('Public Key (TREASURY_WALLET_ADDRESS):');
  console.log(publicKey);
  console.log('\nPrivate key saved to: treasury-wallet.json');
  console.log('⚠️  NEVER commit this file to git!\n');
  console.log('Add to .env:');
  console.log(`TREASURY_WALLET_ADDRESS=${publicKey}\n`);
}

generateTreasury();

