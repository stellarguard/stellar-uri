import { PayStellarUri } from './pay-stellar-uri';
import { StellarUri } from './stellar-uri';
import { TransactionStellarUri } from './transaction-stellar-uri';

export function parseStellarUri(uri: string): StellarUri {
  if (!isStellarUri(uri)) {
    throw new Error('Stellar URIs must start with "web+stellar:"');
  }

  const url = new URL(uri);
  const type = url.pathname;
  switch (url.pathname) {
    case 'tx':
      return new TransactionStellarUri(url);
    case 'pay':
      return new PayStellarUri(url);
    default:
      throw new Error(`Stellar URI type ${type} is not currently supported`);
  }
}

export function isStellarUri(uri: string): boolean {
  return uri.startsWith('web+stellar:');
}
