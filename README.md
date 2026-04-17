# BTC Time Machine

A small web3 dapp that shows what your Bitcoin DCA would be worth today. Built with Next.js, wagmi, [Coinbase CDS](https://github.com/coinbase/cds), and recharts.

- **Configure**: amount per purchase, frequency (one-time / daily / weekly / monthly / annually), and start date.
- **Visualize**: portfolio value vs. invested capital over time. Tap the chart to set a new start date.
- **Buy**: bottom CTA opens Coinbase Wallet to swap into [cbBTC](https://www.coinbase.com/cbbtc) on Base via Uniswap.
- **Theme-aware**: respects `prefers-color-scheme`, including Coinbase Wallet's in-app browser injection.
- **Mobile-first**: tuned for iPhone-class viewports.

## Run locally

```bash
npm install
npm run dev
```

## Deploy

```bash
vercel --prod
```

## Notes

- BTC historical prices are bundled (`src/data/btcPrices.ts`) — monthly closes since 2014. Update those values periodically.
- Current spot price is fetched live from Coinbase's public price endpoint at runtime, with a fallback to the most recent bundled close.
- Wallet connect is the standard Coinbase Wallet connector via wagmi v2.
