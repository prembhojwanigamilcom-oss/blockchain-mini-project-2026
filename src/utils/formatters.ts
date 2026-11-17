/**
 * Formatting helpers for Swiss editorial aesthetics.
 */

/**
 * Shortens an Ethereum address (e.g. 0x182C...89A2)
 */
export function formatAddress(address: string | null | undefined, chars: number = 4): string {
  if (!address) return '';
  if (address.length <= chars * 2 + 2) return address;
  return `${address.slice(0, chars + 2)}…${address.slice(-chars)}`;
}

/**
 * Formats a 32-byte cryptographic hash for display
 */
export function formatHash(hash: string | null | undefined, chars: number = 8): string {
  if (!hash) return '';
  if (hash.length <= chars * 2 + 2) return hash;
  return `${hash.slice(0, chars + 2)}…${hash.slice(-chars)}`;
}

/**
 * Formats a UNIX timestamp into an institutional date format
 */
export function formatTimestamp(timestamp: number | bigint | string | undefined): string {
  if (!timestamp) return '—';
  const num = typeof timestamp === 'bigint' ? Number(timestamp) : Number(timestamp);
  if (num === 0) return '—';
  const date = new Date(num * 1000);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    timeZoneName: 'short',
  });
}

/**
 * Returns network title from chain ID
 */
export function getNetworkName(chainId: number | null | undefined): string {
  switch (chainId) {
    case 31337:
      return 'Hardhat Localhost (31337)';
    case 11155111:
      return 'Ethereum Sepolia Testnet';
    case 1:
      return 'Ethereum Mainnet';
    default:
      return chainId ? `Chain ID ${chainId}` : 'Disconnected';
  }
}
