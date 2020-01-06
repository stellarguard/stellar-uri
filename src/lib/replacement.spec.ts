// tslint:disable:no-expression-statement no-object-mutation
import test from 'ava';
import { ReplacementsParser } from './replacement';

test('ReplacementsParser.parse parses it successfully', t => {
  const str =
    'sourceAccount:X,operations[0].sourceAccount:Y,operations[1].destination:Y;X:account from where you want to pay fees,Y:account that needs the trustline and which will receive the new tokens';
  const replacements = ReplacementsParser.parse(str);

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

test('ReplacementsParser.toString outputs the right string', t => {
  const expected =
    'sourceAccount:X,operations[0].sourceAccount:Y,operations[1].destination:Y;X:account from where you want to pay fees,Y:account that needs the trustline and which will receive the new tokens';
  const replacements = [
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
  ];

  const actual = ReplacementsParser.toString(replacements);
  t.is(actual, expected);
});
