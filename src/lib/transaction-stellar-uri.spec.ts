// tslint:disable:no-expression-statement no-object-mutation
import test from 'ava';
import { Account, Asset, Operation, TransactionBuilder } from 'stellar-sdk';
import { TransactionStellarUri } from './transaction-stellar-uri';

const pubKey = 'GD2FWJZFRDO6YCZV4G2JMVDFHJ2LYNYGYMBFSFYZ4MLMVJ4TBTJJIL7F';
const account = new Account(pubKey, '1');

test('forTransaction sets the tx parameter', t => {
  const tx = new TransactionBuilder(account, { fee: 100 })
    .addOperation(
      Operation.payment({
        amount: '1',
        asset: Asset.native(),
        destination: pubKey
      })
    )
    .setTimeout(0)
    .build();

  const xdr = tx
    .toEnvelope()
    .toXDR()
    .toString('base64');

  const uri = TransactionStellarUri.forTransaction(tx);
  t.is(uri.operation, 'tx');
  t.is(uri.xdr, xdr);
  t.is(uri.toString(), `web+stellar:tx?xdr=${encodeURIComponent(xdr)}`);
});

test('constructor accepts a string uri', t => {
  const uriStr =
    'web+stellar:tx?xdr=test&callback=https%3A%2F%2Fexample.com%2Fcallback';
  const uri = new TransactionStellarUri(uriStr);
  t.is(uri.operation, 'tx');
  t.is(uri.xdr, 'test');
  t.is(uri.toString(), uriStr);
});

test('allows adding xdr after construction', t => {
  const uri = new TransactionStellarUri();
  uri.xdr = 'test';
  t.is(uri.xdr, 'test');
  t.is(uri.toString(), 'web+stellar:tx?xdr=test');
});
