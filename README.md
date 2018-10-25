# @stellarguard/stellar-uri

A TypeScript/JavaScript implementation of [SEP-0007](https://github.com/stellar/stellar-protocol/blob/master/ecosystem/sep-0007.md) style Stellar URIs.

## Installation

```bash
npm install @stellarguard/stellar-uri --save
# or
yarn add @stellarguard/stellar-uri
```

## Examples

### Parsing a URI string and extracting the transaction

```js
import { parseStellarUri } from '@stellarguard/stellar-uri';

const uri = parseStellarUri(
  'web+stellar:tx?xdr=AAAAAP%2Byw%2BZEuNg533pUmwlYxfrq6%2FBoMJqiJ8vuQhf6rHWmAAAAZAB8NHAAAAABAAAAAAAAAAAAAAABAAAAAAAAAAEAAAAA%2F7LD5kS42DnfelSbCVjF%2Burr8GgwmqIny%2B5CF%2FqsdaYAAAAAAAAAAACYloAAAAAAAAAAAA'
);

const transaction = new Transaction(uri.xdr);
```

### Creating and signing a transaction URI

```js
import { TransactionStellarUri } from '@stellarguard/stellar-uri';

const transaction = buildStellarTransaction(); // a StellarSdk.Transaction

const uri = TransactionStellarUri.forTransaction(transaction);
uri.msg = 'hello from me';
uri.originDomain = 'example.com';
uri.addSignature(mySecretKey); // example.com's URI_REQUEST_SIGNING_KEY

uri.toString(); // web+stellar:tx?xdr=...&msg=hello+from+me&origin_domain=example.com&signature=...
```
