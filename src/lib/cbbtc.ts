// cbBTC contract on Base
export const CBBTC_BASE_ADDRESS = '0xcbB7C0000aB88B473b1f5aFd9ef808440eed33Bf';
export const BASE_CHAIN_ID = 8453;

const swapParams = new URLSearchParams({
  contractAddress: CBBTC_BASE_ADDRESS,
  chainId: String(BASE_CHAIN_ID),
});

/**
 * Coinbase Wallet native scheme deeplink for the Swap (Trade) flow with
 * cbBTC pre-selected as the destination on Base. Format from TBA's deeplink
 * registry — the wallet's swap deeplink handler routes this into the new
 * Trade/Swap surface inside the app.
 *
 *   cbwallet://swap?contractAddress=<addr>&chainId=<id>
 */
export const CBBTC_SWAP_URL = `cbwallet://swap?${swapParams.toString()}`;
