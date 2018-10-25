// tslint:disable:no-expression-statement no-object-mutation
import test from 'ava';
import { PayStellarUri } from './pay-stellar-uri';

const pubKey = 'GD2FWJZFRDO6YCZV4G2JMVDFHJ2LYNYGYMBFSFYZ4MLMVJ4TBTJJIL7F';

test('PayStellarUri.forDestination sets the desintation parameter', t => {
  const uri = PayStellarUri.forDestination(pubKey);

  t.is(uri.operation, 'pay');
  t.is(uri.destination, pubKey);
  t.is(uri.toString(), `web+stellar:pay?destination=${pubKey}`);
});
