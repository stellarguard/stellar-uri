import { toTransaction, toTxrep } from '@stellarguard/txrep';
import { Networks, Transaction } from 'stellar-sdk';
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
   * Creates a deep clone of the TransactionStellarUri
   */
  public clone() {
    return new TransactionStellarUri(this.uri);
  }

  /**
   * Creates a Stellar Transaction from the URI's XDR and networkPassphrase
   */
  public getTransaction(): Transaction {
    return new Transaction(this.xdr, this.networkPassphrase || Networks.PUBLIC);
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

  /**
   * Performs any replacements specified and returns a new instance of TransactionStellarUri with the resulting XDR.
   *
   * @param replacements The replacements to perform.
   */
  public replace(replacements: { [key: string]: any }): TransactionStellarUri {
    const passphrase = this.isPublicNetwork
      ? Networks.PUBLIC
      : this.networkPassphrase;

    const tx = this.getTransaction();
    let txrep = toTxrep(tx);

    const newUri = this.clone();
    const replacementTargets = this.getReplacements();
    for (const [id, value] of Object.entries(replacements)) {
      replacementTargets
        .filter(r => r.id === id)
        .forEach(({ path }) => {
          txrep += `\ntx.${path}: ${value}`;
        });

      newUri.removeReplacement(id);
    }

    const newTx = toTransaction(txrep, passphrase);
    newUri.xdr = newTx
      .toEnvelope()
      .toXDR()
      .toString('base64');
    newUri.networkPassphrase = newTx.networkPassphrase;
    return newUri;
  }
}
