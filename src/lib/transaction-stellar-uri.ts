import { Transaction } from 'stellar-sdk';
import { StellarUri } from './stellar-uri';

/**
 * The tx operation represents a request to sign a specific XDR Transaction.
 *
 * @see https://github.com/stellar/stellar-protocol/blob/master/ecosystem/sep-0007.md#operation-tx
 */
export class TransactionStellarUri extends StellarUri {
  public static forTransaction(transaction: Transaction) {
    const uri = new TransactionStellarUri();
    uri.xdr = transaction.toEnvelope().toXDR('base64');
    return uri;
  }

  constructor(uri?: URL | string) {
    super(uri ? uri : new URL('web+stellar:tx'));
  }

  /**
   * Gets the transaction XDR.
   *
   * Required.
   */
  get xdr(): string {
    return this.getParam('xdr')!;
  }

  /**
   * Sets the transaction XDR.
   *
   * Required.
   */
  set xdr(xdr: string) {
    this.setParam('xdr', xdr);
  }
}
