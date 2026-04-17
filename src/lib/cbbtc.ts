// cbBTC contract on Base
export const CBBTC_BASE_ADDRESS = '0xcbB7C0000aB88B473b1f5aFd9ef808440eed33Bf';
export const BASE_CHAIN_ID = 8453;

/**
 * Build a Coinbase Wallet universal link that opens the in-app dapp browser
 * pointed at Uniswap with cbBTC pre-selected as the output token on Base.
 *
 * This works whether the user is already inside the Coinbase Wallet webview
 * (it just navigates) or in a regular browser (it deep-links into the app).
 */
export function buildBuyCbBtcUrl(): string {
  const dappUrl = `https://app.uniswap.org/swap?outputCurrency=${CBBTC_BASE_ADDRESS}&chain=base`;
  return `https://go.cb-w.com/dapp?cb_url=${encodeURIComponent(dappUrl)}`;
}
