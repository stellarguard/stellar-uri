import { Keypair, StellarTomlResolver } from 'stellar-sdk';
import { URL } from 'url';

export abstract class StellarUri {
  protected uri: URL;

  constructor(uri: URL | string) {
    this.uri = typeof uri === 'string' ? new URL(uri) : new URL(uri.toString());
  }

  get operation() {
    return this.uri.pathname;
  }

  get callback() {
    const callback = this.getParam('callback');
    if (callback && callback.startsWith('url:')) {
      return callback.replace('url:', '');
    }

    return callback;
  }

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

  get networkPassphrase() {
    return this.getParam('network_passphrase');
  }

  set networkPassphrase(networkPassphrase) {
    this.setParam('network_passphrase', networkPassphrase);
  }

  get msg() {
    return this.getParam('msg');
  }

  set msg(msg) {
    this.setParam('msg', msg);
  }

  get pubkey() {
    return this.getParam('pubkey');
  }

  set pubkey(pubkey) {
    this.setParam('pubkey', pubkey);
  }

  get originDomain() {
    return this.getParam('origin_domain');
  }

  set originDomain(originDomain) {
    this.setParam('origin_domain', originDomain);
  }

  get signature() {
    return this.getParam('signature');
  }

  public addSignature(keypair: Keypair): string {
    if (!this.originDomain) {
      throw new Error('The URI must contain an ');
    }
    const payload = this.createSignaturePayload();
    const signature = keypair.sign(payload).toString('base64');
    this.setParam('signature', signature);
    return signature;
  }

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
      // TODO: do we want to log here?
      return false;
    }
  }

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
