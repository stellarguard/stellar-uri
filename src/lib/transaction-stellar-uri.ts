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
    uri.xdr = transaction
      .toEnvelope()
      .toXDR()
      .toString('base64');

    uri.networkPassphrase = transaction.networkPassphrase;
    return uri;
  }

  constructor(uri?: URL | string) {
    super(uri ? uri : new URL('web+stellar:tx'));
  }

  /**
   * Creates a Stellar Transaction from the URI's XDR and networkPassphrase
   */
  public getTransaction(): Transaction {
    return new Transaction(this.xdr, this.networkPassphrase);
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
