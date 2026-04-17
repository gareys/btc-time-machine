// cbBTC contract on Base
export const CBBTC_BASE_ADDRESS = '0xcbB7C0000aB88B473b1f5aFd9ef808440eed33Bf';
export const BASE_CHAIN_ID = 8453;

const swapParams = new URLSearchParams({
  contractAddress: CBBTC_BASE_ADDRESS,
  chainId: String(BASE_CHAIN_ID),
});

/**
 * Native scheme deeplink — fires Coinbase Wallet's Trade flow directly when
 * the host app already owns the `cbwallet://` scheme (i.e. inside TBA's
 * Experiments webview, or any iOS/Android device with the app installed).
 *
 * Format from TBA's deeplink registry:
 *   cbwallet://swap?contractAddress=<addr>&chainId=<id>
 */
export const CBBTC_SWAP_SCHEME = `cbwallet://swap?${swapParams.toString()}`;

/**
 * Universal link fallback — used when the scheme handler isn't installed.
 * Resolves via go.cb-w.com to either open the wallet or land on download.
 */
export const CBBTC_SWAP_UNIVERSAL = `https://go.cb-w.com/swap?${swapParams.toString()}`;
