// tslint:disable:no-expression-statement no-object-mutation
import test from 'ava';
import {
  Account,
  Asset,
  Networks,
  Operation,
  TransactionBuilder
} from 'stellar-sdk';
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
    .setNetworkPassphrase(Networks.PUBLIC)
    .setTimeout(0)
    .build();

  const xdr = tx
    .toEnvelope()
    .toXDR()
    .toString('base64');

  const uri = TransactionStellarUri.forTransaction(tx);
  t.is(uri.operation, 'tx');
  t.is(uri.xdr, xdr);
  t.is(
    uri.toString(),
    `web+stellar:tx?xdr=${encodeURIComponent(
      xdr
    )}&network_passphrase=Public+Global+Stellar+Network+%3B+September+2015`
  );
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

test('performs replacements', t => {
  const tx = new TransactionBuilder(account, { fee: 100 })
    .addOperation(
      Operation.payment({
        amount: '1',
        asset: Asset.native(),
        destination: pubKey
      })
    )
    .setNetworkPassphrase(Networks.PUBLIC)
    .setTimeout(0)
    .build();

  const uri = TransactionStellarUri.forTransaction(tx);

  uri.addReplacement({
    id: 'SRC',
    path: 'sourceAccount',
    hint: 'source account'
  });
  uri.addReplacement({ id: 'SEQ', path: 'seqNum', hint: 'sequence number' });
  uri.addReplacement({ id: 'FEE', path: 'fee', hint: 'fee' });
  const newSourceAccount =
    'GALUXTZIBMJTK2CFVVPCGO6LIMIQLMXHAV22LI3LU6KXA6JL4IMQB5H6';
  const newSequenceNumber = '10';
  const newUri = uri.replace({
    SRC: newSourceAccount,
    SEQ: newSequenceNumber
  });
  const newTx = newUri.getTransaction();

  // SRC and SEQ were replaced
  t.is(newTx.source, newSourceAccount);
  t.is(newTx.sequence, newSequenceNumber);
  // FEE was not consumed
  t.deepEqual(newUri.getReplacements(), [
    { id: 'FEE', path: 'fee', hint: 'fee' }
  ]);

  // original uri was not modified
  t.not(newUri.xdr, uri.xdr);
});
