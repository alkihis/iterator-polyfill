
function* numbers() {
  yield 1;
  yield 2;
  yield 3;
}

async function* asyncNumbers() {
  yield 1;
  yield 2;
  yield 3;
}

numbers()
  .map(e => e * 2)
  .take(2)
  .toArray(); // [2, 4] 

asyncNumbers()
  .filter(e => !!(e % 2))
  .map(e => String(e))
  .toArray(); // Promise<["1", "3"]>
