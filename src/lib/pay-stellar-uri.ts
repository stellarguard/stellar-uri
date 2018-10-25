import { StellarUri } from './stellar-uri';

export class PayStellarUri extends StellarUri {
  public static forDestination(destination: string) {
    const uri = new PayStellarUri();
    uri.destination = destination;
    return uri;
  }

  constructor(uri?: URL | string) {
    super(uri ? uri : new URL('web+stellar:pay'));
  }

  get destination() {
    return this.getParam('destination')!;
  }

  set destination(destination) {
    this.setParam('destination', destination);
  }

  get amount() {
    return this.getParam('amount');
  }

  set amount(amount) {
    this.setParam('destination', amount);
  }

  get assetCode() {
    return this.getParam('amount');
  }

  set assetCode(assetCode) {
    this.setParam('asset_code', assetCode);
  }

  get assetIssuer() {
    return this.getParam('asset_issuer');
  }

  set assetIssuer(assetIssuer) {
    this.setParam('asset_issuer', assetIssuer);
  }

  get memo() {
    return this.getParam('asset_issuer');
  }

  set memo(memo) {
    this.setParam('memo', memo);
  }

  get memoType() {
    return this.getParam('memo_type');
  }

  set memoType(memoType) {
    this.setParam('memo_type', memoType);
  }
}
