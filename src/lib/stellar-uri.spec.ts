// tslint:disable:no-expression-statement no-object-mutation
import ava, { TestInterface } from 'ava';
import { Keypair, StellarTomlResolver } from 'stellar-sdk';
import { StellarUri as StellarUriBase } from './stellar-uri';

import sinon from 'sinon';

const test = ava as TestInterface<{
  StellarTomlResolver: sinon.SinonStub;
}>;

test.beforeEach(t => {
  t.context.StellarTomlResolver = sinon.stub(StellarTomlResolver, 'resolve');
});

test.afterEach(() => {
  sinon.restore();
});

const stellarPublicKey =
  'GD7ACHBPHSC5OJMJZZBXA7Z5IAUFTH6E6XVLNBPASDQYJ7LO5UIYBDQW';
const stellarSecretKey =
  'SBPOVRVKTTV7W3IOX2FJPSMPCJ5L2WU2YKTP3HCLYPXNI5MDIGREVNYC';

// making concrete class to test it
class StellarUri extends StellarUriBase {}

test.serial('constructor accepts a string uri', t => {
  const uriStr =
    'web+stellar:tx?xdr=test&callback=https%3A%2F%2Fexample.com%2Fcallback';
  const uri = new StellarUri(uriStr);
  t.is(uri.operation, 'tx');
  t.is(uri.callback, 'https://example.com/callback');
  t.is(uri.toString(), uriStr);
});

test.serial('constructor accepts URL uri', t => {
  const uriStr =
    'web+stellar:tx?xdr=test&callback=https%3A%2F%2Fexample.com%2Fcallback';
  const url = new URL(uriStr);
  const uri = new StellarUri(url);
  t.is(uri.operation, 'tx');
  t.is(uri.callback, 'https://example.com/callback');
  t.is(uri.toString(), uriStr);

  url.searchParams.delete('callback');
  t.is(
    uri.callback,
    'https://example.com/callback',
    'should not hold a reference to the original URL'
  );
});

test.serial('allows setting callback with or without "web:" prefix', t => {
  const uri = new StellarUri('web+stellar:tx');
  t.is(uri.operation, 'tx');
  t.is(uri.callback, undefined);
  uri.callback = 'url:https://example.com/callback';
  t.is(
    uri.callback,
    'https://example.com/callback',
    'should remove url: prefix when getting'
  );
  uri.callback = 'https://example.com/callback';
  t.is(uri.callback, 'https://example.com/callback');
  t.is(
    uri.toString(),
    'web+stellar:tx?callback=url%3Ahttps%3A%2F%2Fexample.com%2Fcallback'
  );
});

test.serial(
  'addSignature() signs the uri and adds a signature to the end',
  t => {
    const uriStr =
      'web+stellar:pay?destination=GCALNQQBXAPZ2WIRSDDBMSTAKCUH5SG6U76YBFLQLIXJTF7FE5AX7AOO&amount=120.1234567&memo=skdjfasf&msg=pay%20me%20with%20lumens&origin_domain=someDomain.com';
    const uri = new StellarUri(uriStr);
    uri.addSignature(Keypair.fromSecret(stellarSecretKey));
    const expectedSignature =
      'JTlGMGzxUv90P2SWxUY9xo+LlbXaDloend6gkpyylY8X4bUNf6/9mFTMJs7JKqSDPRtejlK1kQvrsJfRZSJeAQ==';
    t.is(uri.signature, expectedSignature);

    t.true(
      uri
        .toString()
        .endsWith(`signature=${encodeURIComponent(expectedSignature)}`)
    );
  }
);

test.serial(
  'verifySignature() returns true when there is no origin_domain or signature',
  async t => {
    const uriStr = 'web+stellar:tx?xdr=test';
    const uri = new StellarUri(uriStr);
    t.true(await uri.verifySignature());
  }
);

test.serial(
  'verifySignature() returns false when there is origin domain but no signature',
  async t => {
    const uriStr = 'web+stellar:tx?xdr=test&origin_domain=someDomain.com';
    const uri = new StellarUri(uriStr);
    t.false(await uri.verifySignature());
  }
);

test.serial(
  'verifySignature() returns false when there is signature but no origin domain',
  async t => {
    const uriStr = 'web+stellar:tx?xdr=test&signature=sig';
    const uri = new StellarUri(uriStr);
    t.false(await uri.verifySignature());
  }
);

test.serial(
  'verifySignature() returns false when the stellar.toml fails to resolve',
  async t => {
    const uriStr =
      'web+stellar:tx?xdr=test&origin_domain=someDomain.com&signature=sig';
    const uri = new StellarUri(uriStr);
    t.context.StellarTomlResolver.withArgs('someDomain.com').throws(
      new Error('Not Found')
    );
    t.false(await uri.verifySignature());
  }
);

test.serial(
  'verifySignature() returns false when the stellar.toml has no URI_REQUEST_SIGNING_KEY field',
  async t => {
    const uriStr =
      'web+stellar:tx?xdr=test&origin_domain=someDomain.com&signature=sig';
    const uri = new StellarUri(uriStr);
    t.context.StellarTomlResolver.withArgs('someDomain.com').resolves({});
    t.false(await uri.verifySignature());
  }
);

test.serial(
  'verifySignature() returns false when the signature is not valid',
  async t => {
    const uriStr =
      'web+stellar:pay?destination=GCALNQQBXAPZ2WIRSDDBMSTAKCUH5SG6U76YBFLQLIXJTF7FE5AX7AOO&amount=120.1234567&memo=skdjfasf&msg=pay%20me%20with%20lumens&origin_domain=someDomain.com?signature=invalid';
    const uri = new StellarUri(uriStr);
    t.context.StellarTomlResolver.withArgs('someDomain.com').resolves({
      URI_REQUEST_SIGNING_KEY: stellarPublicKey
    });

    t.false(await uri.verifySignature());
  }
);

test.serial(
  'verifySignature() returns true when the signature is valid',
  async t => {
    const uriStr =
      'web+stellar:pay?destination=GCALNQQBXAPZ2WIRSDDBMSTAKCUH5SG6U76YBFLQLIXJTF7FE5AX7AOO&amount=120.1234567&memo=skdjfasf&msg=pay%20me%20with%20lumens&origin_domain=someDomain.com&signature=JTlGMGzxUv90P2SWxUY9xo%2BLlbXaDloend6gkpyylY8X4bUNf6%2F9mFTMJs7JKqSDPRtejlK1kQvrsJfRZSJeAQ%3D%3D';
    const uri = new StellarUri(uriStr);
    t.context.StellarTomlResolver.withArgs('someDomain.com').resolves({
      URI_REQUEST_SIGNING_KEY: stellarPublicKey
    });

    t.true(await uri.verifySignature());
  }
);
