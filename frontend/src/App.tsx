import React, { useMemo } from 'react';
import { ConnectionProvider, WalletProvider } from '@solana/wallet-adapter-react';
import { WalletAdapterNetwork } from '@solana/wallet-adapter-base';
import {
  PhantomWalletAdapter,
  SolflareWalletAdapter,
} from '@solana/wallet-adapter-wallets';
import { WalletModalProvider } from '@solana/wallet-adapter-react-ui';
import { WalletButton } from './components/WalletButton';
import { Dashboard } from './components/Dashboard';
import '@solana/wallet-adapter-react-ui/styles.css';

function App() {
  const network = (process.env.REACT_APP_NETWORK === 'mainnet'
    ? WalletAdapterNetwork.Mainnet
    : WalletAdapterNetwork.Devnet) as WalletAdapterNetwork;

  const endpoint = useMemo(
    () => (network === WalletAdapterNetwork.Mainnet
      ? 'https://api.mainnet-beta.solana.com'
      : 'https://api.devnet.solana.com'),
    [network]
  );

  const wallets = useMemo(
    () => [
      new PhantomWalletAdapter(),
      new SolflareWalletAdapter(),
    ],
    []
  );

  return (
    <ConnectionProvider endpoint={endpoint}>
      <WalletProvider wallets={wallets} autoConnect>
        <WalletModalProvider>
          <div className="App">
            <WalletButton />
            <Dashboard />
          </div>
        </WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  );
}

export default App;

