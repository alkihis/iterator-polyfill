"use strict";
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
numbers().map(e => e * 2);
