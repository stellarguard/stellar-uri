import { StellarUri } from './stellar-uri';

type MemoType = 'none' | 'id' | 'text' | 'hash' | 'return';

/**
 * The pay operation represents a request to pay a specific address with a specific asset, regardless of the source asset used by the payer.
 *
 * @see https://github.com/stellar/stellar-protocol/blob/master/ecosystem/sep-0007.md#operation-pay
 */
export class PayStellarUri extends StellarUri {
  /**
   * Creates a PayStellarUri instance and sets the given destination.
   *
   * @param destination A valid account ID or payment address.
   */
  public static forDestination(destination: string) {
    const uri = new PayStellarUri();
    uri.destination = destination;
    return uri;
  }

  constructor(uri?: URL | string) {
    super(uri ? uri : new URL('web+stellar:pay'));
  }

  /**
   * Creates a deep clone of the PayStellarUri
   */
  public clone() {
    return new PayStellarUri(this.uri);
  }

  /**
   * Gets the destination of the payment request, which is a valid account ID or payment address.
   *
   * Required.
   */
  get destination() {
    return this.getParam('destination')!;
  }

  /**
   * Sets the destination of the payment request, which is a valid account ID or payment address.
   *
   * Required.
   */
  set destination(destination) {
    this.setParam('destination', destination);
  }

  /**
   * Gets the amount that destination will receive.
   *
   * Optional.
   */
  get amount() {
    return this.getParam('amount');
  }

  /**
   * Sets the amount that destination will receive.
   *
   * Optional.
   */
  set amount(amount) {
    this.setParam('destination', amount);
  }

  /**
   * Gets the asset code the destination will receive.
   *
   * Optional.
   */
  get assetCode() {
    return this.getParam('asset_code');
  }

  /**
   * Sets the asset code the destination will receive.
   *
   * Optional.
   */
  set assetCode(assetCode) {
    this.setParam('asset_code', assetCode);
  }

  /**
   * Gets the account ID of asset issuer the destination will receive
   *
   * Optional.
   */
  get assetIssuer() {
    return this.getParam('asset_issuer');
  }

  /**
   * Sets the account ID of asset issuer the destination will receive
   *
   * Optional.
   */
  set assetIssuer(assetIssuer) {
    this.setParam('asset_issuer', assetIssuer);
  }

  /**
   * Gets the memo to be included in the payment / path payment.
   * Memos of type MEMO_HASH and MEMO_RETURN should be base64 encoded.
   *
   * Optional.
   */
  get memo() {
    return this.getParam('memo');
  }

  /**
   * Sets the memo to be included in the payment / path payment.
   * Memos of type MEMO_HASH and MEMO_RETURN should be base64 encoded.
   *
   * Optional.
   */
  set memo(memo) {
    this.setParam('memo', memo);
  }

  /**
   * Gets the type of the memo.
   *
   * Optional.
   */
  get memoType() {
    return this.getParam('memo_type') as MemoType;
  }

  /**
   * Sets the type of the memo.
   *
   * Optional.
   */
  set memoType(memoType: MemoType | undefined) {
    this.setParam('memo_type', memoType);
  }
}
