// tslint:disable:no-expression-statement no-object-mutation
import test from 'ava';
import { PayStellarUri } from './pay-stellar-uri';

const pubKey = 'GD2FWJZFRDO6YCZV4G2JMVDFHJ2LYNYGYMBFSFYZ4MLMVJ4TBTJJIL7F';

test('PayStellarUri.forDestination sets the destination parameter', t => {
  const uri = PayStellarUri.forDestination(pubKey);

  t.is(uri.operation, 'pay');
  t.is(uri.destination, pubKey);
  t.is(uri.toString(), `web+stellar:pay?destination=${pubKey}`);
});

test('get/set destination', t => {
  const uri = new PayStellarUri(`web+stellar:pay?destination=${pubKey}`);

  t.is(uri.destination, pubKey);
  uri.destination = 'other';
  t.is(uri.destination, 'other');
});

test('get/set amount', t => {
  const uri = new PayStellarUri(
    `web+stellar:pay?destination=${pubKey}&amount=10.1`
  );

  t.is(uri.amount, '10.1');
  uri.amount = '2';
  t.is(uri.destination, '2');
});

test('get/set assetCode', t => {
  const uri = new PayStellarUri(
    `web+stellar:pay?destination=${pubKey}&asset_code=USD`
  );

  t.is(uri.assetCode, 'USD');
  uri.assetCode = 'GBP';
  t.is(uri.assetCode, 'GBP');
});

test('get/set assetIssuer', t => {
  const uri = new PayStellarUri(
    `web+stellar:pay?destination=${pubKey}&asset_issuer=issuer`
  );

  t.is(uri.assetIssuer, 'issuer');
  uri.assetIssuer = 'new_issuer';
  t.is(uri.assetIssuer, 'new_issuer');
});

test('get/set memo', t => {
  const uri = new PayStellarUri(
    `web+stellar:pay?destination=${pubKey}&memo=hello+world`
  );

  t.is(uri.memo, 'hello world');
  uri.memo = 'goodbye world';
  t.is(uri.memo, 'goodbye world');
});

test('get/set memoType', t => {
  const uri = new PayStellarUri(
    `web+stellar:pay?destination=${pubKey}&memo_type=text`
  );

  t.is(uri.memoType, 'text');
  uri.memoType = 'id';
  t.is(uri.memoType, 'id');
});
