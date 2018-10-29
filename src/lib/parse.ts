import { PayStellarUri } from './pay-stellar-uri';
import { StellarUriType } from './stellar-uri';
import { TransactionStellarUri } from './transaction-stellar-uri';

/**
 * Parses a SEP-0007 style URI string and returns a TransactionStellarUri or PayStellarUri, depending on the type.
 *
 * @param uri The URI string to parse.
 *
 * @throws Throws an error if the uri is not a valid SEP-0007 style URI.
 */
export function parseStellarUri(
  uri: string
): TransactionStellarUri | PayStellarUri {
  if (!isStellarUri(uri)) {
    throw new Error('Stellar URIs must start with "web+stellar:"');
  }

  const url = new URL(uri);
  const type = url.pathname;
  switch (url.pathname) {
    case StellarUriType.Transaction:
      return new TransactionStellarUri(url);
    case StellarUriType.Pay:
      return new PayStellarUri(url);
    default:
      throw new Error(`Stellar URI type ${type} is not currently supported.`);
  }
}

/**
 * Returns true if the given URI is a SEP-0007 style URI, false otherwise.
 * Currently this only checks whether it starts with 'web+stellar:' and is a valid type.
 *
 * @param uri The URI string to check.
 */
export function isStellarUri(uri: string): boolean {
  return (
    !!uri &&
    (uri.startsWith('web+stellar:tx') || uri.startsWith('web+stellar:pay'))
  );
}
