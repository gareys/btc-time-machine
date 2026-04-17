'use client';

import { useMemo } from 'react';
import { useAccount, useConnect, useDisconnect } from 'wagmi';
import { Button } from '@coinbase/cds-web/buttons';

function shortAddr(a: string) {
  return `${a.slice(0, 6)}…${a.slice(-4)}`;
}

export function ConnectButton() {
  const { address, isConnected } = useAccount();
  const { connectors, connect, isPending } = useConnect();
  const { disconnect } = useDisconnect();

  const cbConnector = useMemo(
    () => connectors.find((c) => c.id === 'coinbaseWalletSDK' || c.name === 'Coinbase Wallet'),
    [connectors],
  );

  if (isConnected && address) {
    return (
      <Button compact variant="secondary" onClick={() => disconnect()}>
        {shortAddr(address)}
      </Button>
    );
  }

  return (
    <Button
      compact
      onClick={() => cbConnector && connect({ connector: cbConnector })}
      disabled={!cbConnector || isPending}
    >
      {isPending ? 'Connecting…' : 'Connect wallet'}
    </Button>
  );
}
