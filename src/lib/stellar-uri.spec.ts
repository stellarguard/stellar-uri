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
class StellarUri extends StellarUriBase {
  public clone(): StellarUriBase {
    return new StellarUri(this.uri);
  }
}

// we need to run them in serial because sinon stubs the "global" StellarTomlResolver import
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

test.serial('isTestNetwork/useTestNetwork', t => {
  const uri = new StellarUri('web+stellar:tx');
  t.false(uri.isTestNetwork);
  uri.useTestNetwork();
  t.true(uri.isTestNetwork);
  t.is(uri.networkPassphrase, 'Test SDF Network ; September 2015');
});

test.serial('isPublicNetwork/usePublicNetwork', t => {
  const uri = new StellarUri('web+stellar:tx');
  t.true(uri.isPublicNetwork);
  uri.usePublicNetwork();
  t.true(uri.isPublicNetwork);
  t.is(uri.networkPassphrase, 'Public Global Stellar Network ; September 2015');
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

test.serial('parses replacements', t => {
  const uri = new StellarUri(
    'web+stellar:tx?replace=sourceAccount%3AX%2Coperations%5B0%5D.sourceAccount%3AY%2Coperations%5B1%5D.destination%3AY%3BX%3Aaccount%20from%20where%20you%20want%20to%20pay%20fees%2CY%3Aaccount%20that%20needs%20the%20trustline%20and%20which%20will%20receive%20the%20new%20tokens'
  );

  const replacements = uri.getReplacements();
  t.is(replacements.length, 3);

  t.is(replacements[0].id, 'X');
  t.is(replacements[0].path, 'sourceAccount');
  t.is(replacements[0].hint, 'account from where you want to pay fees');

  t.is(replacements[1].id, 'Y');
  t.is(replacements[1].path, 'operations[0].sourceAccount');
  t.is(
    replacements[1].hint,
    'account that needs the trustline and which will receive the new tokens'
  );

  t.is(replacements[2].id, 'Y');
  t.is(replacements[2].path, 'operations[1].destination');
  t.is(
    replacements[2].hint,
    'account that needs the trustline and which will receive the new tokens'
  );
});

test.serial('addReplacement', t => {
  const uri = new StellarUri('web+stellar:tx');
  uri.addReplacement({
    id: 'X',
    path: 'sourceAccount',
    hint: 'account from where you want to pay fees'
  });

  uri.addReplacement({
    id: 'Y',
    path: 'operations[0].sourceAccount',
    hint:
      'account that needs the trustline and which will receive the new tokens'
  });

  uri.addReplacement({
    id: 'Y',
    path: 'operations[1].destination',
    hint:
      'account that needs the trustline and which will receive the new tokens'
  });

  const expected =
    'web+stellar:tx?replace=sourceAccount%3AX%2Coperations%5B0%5D.sourceAccount%3AY%2Coperations%5B1%5D.destination%3AY%3BX%3Aaccount+from+where+you+want+to+pay+fees%2CY%3Aaccount+that+needs+the+trustline+and+which+will+receive+the+new+tokens';
  t.is(uri.toString(), expected);
});

test.serial('setReplacements', t => {
  const uri = new StellarUri('web+stellar:tx');
  uri.setReplacements([
    {
      id: 'X',
      path: 'sourceAccount',
      hint: 'account from where you want to pay fees'
    },
    {
      id: 'Y',
      path: 'operations[0].sourceAccount',
      hint:
        'account that needs the trustline and which will receive the new tokens'
    },
    {
      id: 'Y',
      path: 'operations[1].destination',
      hint:
        'account that needs the trustline and which will receive the new tokens'
    }
  ]);

  const expected =
    'web+stellar:tx?replace=sourceAccount%3AX%2Coperations%5B0%5D.sourceAccount%3AY%2Coperations%5B1%5D.destination%3AY%3BX%3Aaccount+from+where+you+want+to+pay+fees%2CY%3Aaccount+that+needs+the+trustline+and+which+will+receive+the+new+tokens';
  t.is(uri.toString(), expected);
});

test.serial('removeReplacement', t => {
  const uri = new StellarUri(
    'web+stellar:tx?replace=sourceAccount%3AX%2Coperations%5B0%5D.sourceAccount%3AY%2Coperations%5B1%5D.destination%3AY%3BX%3Aaccount+from+where+you+want+to+pay+fees%2CY%3Aaccount+that+needs+the+trustline+and+which+will+receive+the+new+tokens'
  );
  uri.removeReplacement('Y');

  t.is(uri.getReplacements().length, 1);
  const expected =
    'web+stellar:tx?replace=sourceAccount%3AX%3BX%3Aaccount+from+where+you+want+to+pay+fees';
  t.is(uri.toString(), expected);
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
