import { Keypair, Networks, StellarTomlResolver } from 'stellar-sdk';

/**
 * The type of the Stellar URI.
 */
export enum StellarUriType {
  Transaction = 'tx',
  Pay = 'pay'
}

/**
 * A base class for parsing or constructing SEP-0007 style Stellar URIs.
 *
 * @see https://github.com/stellar/stellar-protocol/blob/master/ecosystem/sep-0007.md
 */
export abstract class StellarUri {
  protected uri: URL;

  constructor(uri: URL | string) {
    this.uri = typeof uri === 'string' ? new URL(uri) : new URL(uri.toString());
  }

  /**
   * Gets the operation type of the URI.
   *
   */
  get operation(): StellarUriType {
    return this.uri.pathname as StellarUriType;
  }

  /**
   * Gets the callback for this URI.
   *
   * Note: This returns the callback *without* the 'url:' prefix that may be present in the callback.
   *
   * Optional.
   */
  get callback() {
    const callback = this.getParam('callback');
    if (callback && callback.startsWith('url:')) {
      return callback.replace('url:', '');
    }

    return callback;
  }

  /**
   * Sets the callback for this URI.
   *
   * Note: You may set it with or without the 'url:' prefix. If the prefix is not present it will added in the final URI string.
   *
   * Optional.
   */
  set callback(callback) {
    if (callback !== undefined) {
      if (callback.startsWith('url:')) {
        this.setParam('callback', callback);
      } else {
        this.setParam('callback', `url:${callback}`);
      }
    } else {
      this.setParam('callback', undefined);
    }
  }

  /**
   * Gets the network passphrase of the Stellar network to use for this request.
   *
   * If this is not set, the Stellar public network should be assumed.
   *
   * Optional.
   */
  get networkPassphrase() {
    return this.getParam('network_passphrase');
  }

  /**
   * Sets the network passphrase of the Stellar network to use for this request.
   *
   * Optional.
   */
  set networkPassphrase(networkPassphrase) {
    this.setParam('network_passphrase', networkPassphrase);
  }

  /**
   * Returns whether or not the network_passphase for this URI indicates that it is on the public network.
   *
   * This is true if network_passphrase is not set or if it's set to the public network's passphrase.
   */
  get isPublicNetwork() {
    return (
      !this.networkPassphrase || this.networkPassphrase === Networks.PUBLIC
    );
  }

  /**
   * Sets the network_passphrase to be the passphrase of the public network.
   */
  public usePublicNetwork() {
    this.networkPassphrase = Networks.PUBLIC;
  }

  /**
   * Returns whether or not the network_passphase for this URI indicates that it is on the test network.
   */
  get isTestNetwork() {
    return this.networkPassphrase === Networks.TESTNET;
  }

  /**
   * Sets the network_passphrase to be the passphrase of the test network.
   */
  public useTestNetwork() {
    this.networkPassphrase = Networks.TESTNET;
  }

  /**
   * Gets which public key you want the URI handler to sign for.
   *
   * Optional.
   */
  get pubkey() {
    return this.getParam('pubkey');
  }

  /**
   * Sets which public key you want the URI handler to sign for.
   *
   * Optional.
   */
  set pubkey(pubkey) {
    this.setParam('pubkey', pubkey);
  }

  /**
   * Gets the message to show to the user.
   *
   * Optional.
   */
  get msg() {
    return this.getParam('msg');
  }

  /**
   * Sets the message to show to the user.
   * This must be 300 characters or less.
   *
   * Optional.
   */
  set msg(msg) {
    if (msg && msg.length > 300) {
      throw new Error(`'msg' should be no longer than 300 characters.`);
    }

    this.setParam('msg', msg);
  }

  /**
   * Gets the fully qualified domain name that specifies the originating domain of the URI request.
   *
   * Wallets must validate the URI request against the included signature before they display the origin_domain to the user.
   */
  get originDomain() {
    return this.getParam('origin_domain');
  }

  /**
   * Sets the fully qualified domain name that specifies the originating domain of the URI request.
   */
  set originDomain(originDomain) {
    this.setParam('origin_domain', originDomain);
  }

  /**
   * A signature of the hash of the URI request (excluding the signature field and value itself).
   *
   * Wallets should use the URI_REQUEST_SIGNING_KEY specified in the domain's stellar.toml file to validate this signature.
   * If the verification fails, wallets must alert the user.
   *
   * @see https://github.com/stellar/stellar-protocol/blob/master/ecosystem/sep-0007.md#request-signing
   */
  get signature() {
    return this.getParam('signature');
  }

  /**
   * Signs the URI with the given keypair.
   * This should be the last step done before generating the URI string, otherwise the signature will be invalid for the URI.
   *
   * @param keypair The keypair (including secret key), used to sign the request. This should be the keypair found in the URI_REQUEST_SIGNING_KEY field of the origin domains' stellar.toml.
   */
  public addSignature(keypair: Keypair): string {
    const payload = this.createSignaturePayload();
    const signature = keypair.sign(payload).toString('base64');
    this.setParam('signature', signature);
    return signature;
  }

  /**
   * Verifies a that the signature added to the URI is valid.
   *
   * Returns true if the signature is valid for the current URI and origin domain, or if there is no origin domain and signature.
   * Returns false if signature verification fails, or if there is a problem looking up the stellar.toml associated with the origin domain.
   */
  public async verifySignature(): Promise<boolean> {
    const originDomain = this.originDomain;
    const signature = this.signature;
    if (!originDomain && !signature) {
      // if there's no origin domain or signature then there's nothing to verify
      return true;
    }

    if (!originDomain || !signature) {
      // we can fail fast if neither of them are set since we can't verify without both
      return false;
    }

    try {
      const toml = await StellarTomlResolver.resolve(originDomain);
      const signingKey = toml.URI_REQUEST_SIGNING_KEY;

      if (!signingKey) {
        return false;
      }
      const keypair = Keypair.fromPublicKey(signingKey);
      const payload = this.createSignaturePayload();
      return keypair.verify(payload, Buffer.from(signature, 'base64'));
    } catch (e) {
      // if something fails we assume signature verification failed
      return false;
    }
  }

  /**
   * Returns the URI as a string.
   */
  public toString() {
    return this.uri.toString();
  }

  protected getParam(key: string): string | undefined {
    return this.uri.searchParams.get(key) || undefined;
  }

  protected setParam(key: string, value?: string) {
    if (value === undefined) {
      this.uri.searchParams.delete(key);
    } else {
      this.uri.searchParams.set(key, value);
    }
  }

  private createSignaturePayload(): Buffer {
    let data = this.uri.toString();
    const signature = this.signature;
    if (signature) {
      // the payload must be created without the signature on it
      data = data.replace(`&signature=${encodeURIComponent(signature)}`, '');
    }

    // https://github.com/stellar/stellar-protocol/blob/master/ecosystem/sep-0007.md#request-signing
    return Buffer.concat([
      Buffer.alloc(35),
      Buffer.alloc(1, 4),
      Buffer.from('stellar.sep.7 - URI Scheme' + data)
    ]);
  }
}
