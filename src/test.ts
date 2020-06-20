import './index';
import * as assert from 'assert';

function* numbers() {
  yield 1;
  yield 2;
  yield 3;
}

function* dropWhileCompatible() {
  yield 1;
  yield 2;
  yield 3;
  yield 1;
}

function* takeWhileCompatible() {
  yield 1;
  yield 2;
  yield 4;
  yield 0;
  yield 1;
}

function* fuseCompatible() {
  yield 1;
  yield 2;
  yield 3;
  yield undefined;
  yield 5;
}

async function* asyncNumbers() {
  yield 1;
  yield 2;
  yield 3;
}

const n = numbers;
const dwc = dropWhileCompatible;
const twc = takeWhileCompatible;
const fc = fuseCompatible;
const an = asyncNumbers;

async function main() {
  let collected: any = numbers()
    .map(e => e * 2)
    .take(2)
    .toArray(); // [2, 4] ;

  assert.deepStrictEqual(collected, [2, 4]);

  collected = await asyncNumbers()
    .filter(e => !!(e % 2))
    .map(e => String(e))
    .toArray(); // Promise<["1", "3"]>

  assert.deepStrictEqual(collected, ['1', '3']);

  // SYNC ITERATOR TEST
  // .map
  assert.deepStrictEqual(n().map(e => e * 2).toArray(), [2, 4, 6]);
  // .filter
  assert.deepStrictEqual(n().filter(e => e % 2 === 0).toArray(), [2]);
  // .take
  assert.deepStrictEqual(n().take(2).toArray(), [1, 2]);
  // .drop
  assert.deepStrictEqual(n().drop(1).toArray(), [2, 3]);
  // .asIndexedPairs
  assert.deepStrictEqual(n().asIndexedPairs().toArray(), [[0, 1], [1, 2], [2, 3]]);
  // .flatMap
  assert.deepStrictEqual(n().flatMap(e => [e, -e]).toArray(), [1, -1, 2, -2, 3, -3]);
  // .find
  assert.deepStrictEqual(n().find(e => e === 2), 2);
  assert.deepStrictEqual(n().find((e: number) => e === 4), undefined);
  // .every
  assert.deepStrictEqual(n().every(e => e > 0), true);
  assert.deepStrictEqual(n().every(e => e <= 2), false);
  // .some
  assert.deepStrictEqual(n().some(e => e <= 2), true);
  assert.deepStrictEqual(n().some(e => e <= 0), false);
  // .toArray
  assert.deepStrictEqual(n().toArray(), [1, 2, 3]);
  // .reduce
  assert.deepStrictEqual(n().reduce((acc, val) => acc + val), 6);
  assert.deepStrictEqual(n().reduce((acc, val) => acc + val, 0), 6);
  assert.deepStrictEqual(n().reduce((acc, val) => acc - val, 0), -6);
  // .forEach
  assert.deepStrictEqual(n().forEach(console.debug), undefined);

  // Non spec for sync iterator
  // .join
  assert.deepStrictEqual(n().join(','), '1,2,3');
  // .count
  assert.deepStrictEqual(n().count(), 3);
  // .chain
  assert.deepStrictEqual(n().chain(n()).toArray(), [1, 2, 3, 1, 2, 3]);
  // .zip
  assert.deepStrictEqual(n().zip(n()).toArray(), [[1, 1], [2, 2], [3, 3]]);
  // .dropWhile
  assert.deepStrictEqual(dwc().dropWhile(e => e <= 2).toArray(), [3, 1]);
  // .takeWhile
  assert.deepStrictEqual(twc().takeWhile(e => e <= 2).toArray(), [1, 2]);
  // .fuse
  assert.deepStrictEqual(fc().fuse().toArray(), [1, 2, 3]);
  // .partition
  assert.deepStrictEqual(n().partition(c => c <= 2), [[1, 2], [3]]);
  // .findIndex
  assert.deepStrictEqual(n().findIndex(e => e === 2), 1);
  // .max
  assert.deepStrictEqual(n().max(), 3);
  // .min
  assert.deepStrictEqual(n().min(), 1);

  // Non testable with assert : .cycle
  let i = 1000;
  let cycle_generator = n().cycle();
  while (--i) {
    const value = cycle_generator.next();
    assert.equal([1, 2, 3].includes(value.value as number), true);
  }
  assert.equal(i, 0);

  /// END OF sync iterator tests

  // ASYNC ITERATOR TESTS


  console.log('All tests passed successfully.');
}

main();

