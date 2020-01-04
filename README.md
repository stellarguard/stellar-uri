# @stellarguard/stellar-uri

[![Latest Version](https://img.shields.io/npm/v/@stellarguard/stellar-uri.svg)](https://img.shields.io/npm/v/@stellarguard/stellar-uri.svg)
[![NodeJS Support](https://img.shields.io/node/v/@stellarguard/stellar-uri.svg)](https://img.shields.io/node/v/@stellarguard/stellar-uri.svg)

A TypeScript/JavaScript implementation of [SEP-0007](https://github.com/stellar/stellar-protocol/blob/master/ecosystem/sep-0007.md) style Stellar URIs for the browser or NodeJS.

Note: to use this package your in the browser it must support the [URL interface](https://developer.mozilla.org/en-US/docs/Web/API/URL#Browser_compatibility). If you would like to use it in a version not listed here consider [using a polyfill](https://www.npmjs.com/package/url-polyfill).

## Installation

```bash
npm install @stellarguard/stellar-uri --save
# or
yarn add @stellarguard/stellar-uri
```

## Examples

[See a live demo](https://stellarguard.github.io/stellar-uri/demo)

### Parsing a URI string and extracting the transaction

```js
import { parseStellarUri } from '@stellarguard/stellar-uri';
import { Transaction } from 'stellar-sdk';

const uri = parseStellarUri(
  'web+stellar:tx?xdr=AAAAAP%2Byw%2BZEuNg533pUmwlYxfrq6%2FBoMJqiJ8vuQhf6rHWmAAAAZAB8NHAAAAABAAAAAAAAAAAAAAABAAAAAAAAAAEAAAAA%2F7LD5kS42DnfelSbCVjF%2Burr8GgwmqIny%2B5CF%2FqsdaYAAAAAAAAAAACYloAAAAAAAAAAAA'
);

const transaction = uri.getTransaction(); // a StellarSdk.Transaction
```

### Creating and signing a transaction URI

```js
import { TransactionStellarUri } from '@stellarguard/stellar-uri';
import { Transaction } from 'stellar-sdk';

const transaction = buildStellarTransaction(); // a StellarSdk.Transaction

const uri = TransactionStellarUri.forTransaction(transaction);
uri.msg = 'hello from me';
uri.originDomain = 'example.com';
uri.addSignature(mySecretKey); // example.com's URI_REQUEST_SIGNING_KEY

uri.toString(); // web+stellar:tx?xdr=...&msg=hello+from+me&origin_domain=example.com&signature=...
```

### Verifying a signature

```js
import { parseStellarUri } from '@stellarguard/stellar-uri';
import { Transaction } from 'stellar-sdk';

const uri = parseStellarUri(
  'web+stellar:pay?destination=GCALNQQBXAPZ2WIRSDDBMSTAKCUH5SG6U76YBFLQLIXJTF7FE5AX7AOO&amount=120.1234567&memo=skdjfasf&msg=pay%20me%20with%20lumens&origin_domain=someDomain.com&signature=JTlGMGzxUv90P2SWxUY9xo%2BLlbXaDloend6gkpyylY8X4bUNf6%2F9mFTMJs7JKqSDPRtejlK1kQvrsJfRZSJeAQ%3D%3D'
);

uri.verifySignature().then(isVerified => {
  if (isVerified) {
    // show origin domain
  } else {
    // something is wrong, warn the user
  }
});
```

### Replacements

`TransactionStellarUri` supports replacing any part of the transaction by specifying a [SEP-0011 Txrep](https://github.com/stellar/stellar-protocol/blob/master/ecosystem/sep-0011.md) path that should be replaced.

The following example shows how you might construct a `TransactionStellarUri` whose transaction source account and sequence number should be replaced, and then performs the replacement.

```js
import { TransactionStellarUri } from '@stellarguard/stellar-uri';
import { Networks, Transaction } from 'stellar-sdk';

// zero'd out source account and 0 for sequence number (could be anything though)
const tx = new Transaction(
  'AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAZAAAAAAAAAAAAAAAAAAAAAAAAAABAAAAAAAAAAEAAAAA/gEcLzyF1yWJzkNwfz1AKFmfxPXqtoXgkOGE/W7tEYAAAAAAAAAAADuaygAAAAAAAAAAAA==',
  Networks.TESTNET
);

const uri = TransactionStellarUri.forTransaction(tx);
uri.addReplacement({
  id: 'SRC',
  path: 'tx.sourceAccount',
  hint: 'source account'
});
uri.addReplacement({ id: 'SEQ', path: 'tx.seqNum', hint: 'sequence number' });

uri.getReplacements(); // same values that were added with addReplacement
uri.toString(); // web+stellar:tx?xdr=...&replace=tx.sourceAccount%3ASRC%2Ctx.seqNum%3ASEQ%3BSRC%3Asource+account%2CSEQ%3Asequence+number

// now perform the replacements
// this would -- usually be done in a different application than the one that originally constructed it
const newSequenceNumber = '10';
const newUri = uri.replace(
  {
    id: 'SRC',
    value: 'GALUXTZIBMJTK2CFVVPCGO6LIMIQLMXHAV22LI3LU6KXA6JL4IMQB5H6'
  },
  { id: 'SEQ', value: '10' }
);
const newTx = newUri.getTransaction();

newTx.source; // GAL...
newTx.sequence; // 10
```

## QR Codes

This library does not handle generating a QR code for the Stellar URI.

Consider using an existing solution such as [https://www.npmjs.com/package/qrcode](https://www.npmjs.com/package/qrcode).

The [demo](https://stellarguard.github.io/stellar-uri/demo) has an example of how that could be accomplished.
