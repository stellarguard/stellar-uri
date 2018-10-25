import { Transaction } from 'stellar-sdk';
import { StellarUri } from './stellar-uri';

export class TransactionStellarUri extends StellarUri {
  public static forTransaction(transaction: Transaction) {
    const uri = new TransactionStellarUri();
    uri.xdr = transaction.toEnvelope().toXDR('base64');
    return uri;
  }

  constructor(uri?: URL | string) {
    super(uri ? uri : new URL('web+stellar:tx'));
  }

  get xdr(): string {
    return this.getParam('xdr')!;
  }

  set xdr(xdr: string) {
    this.setParam('xdr', xdr);
  }
}
