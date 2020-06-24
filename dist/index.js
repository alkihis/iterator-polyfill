'use strict';
/**
 * Polyfill
 *
 * For both {Iterator.prototype} and {AsyncIterator.prototype},
 * polyfill is placed inside the prototype of original Iterator/AsyncIterator objects.
 *
 * If methods like .take/.map/etc are implemented by engines, it won't mask them.
 */
(function () {
    function getGlobal() {
        if (typeof window !== 'undefined') {
            return window;
        }
        // @ts-ignore
        if (typeof global !== 'undefined') {
            // @ts-ignore
            return global;
        }
        return new Function('return this')();
    }
    const _globalThis = typeof globalThis === 'undefined' ? getGlobal() : globalThis;
    // polyfill already applied / proposal implemented
    if ('Iterator' in _globalThis && 'AsyncIterator' in _globalThis) {
        return;
    }
    // Polyfill for Iterator
    const IteratorPrototype = {};
    const ArrayIteratorPrototype = Object.getPrototypeOf([][Symbol.iterator]());
    const OriginalIteratorPrototype = Object.getPrototypeOf(ArrayIteratorPrototype);
    Object.setPrototypeOf(OriginalIteratorPrototype, IteratorPrototype);
    Object.defineProperties(IteratorPrototype, {
        [Symbol.iterator]: {
            value() {
                return this;
            }
        },
        map: {
            *value(callback) {
                const it = this;
                let value = it.next();
                while (!value.done) {
                    const real_value = callback(value.value);
                    const next_value = yield real_value;
                    value = it.next(next_value);
                }
                return value.value;
            },
        },
        filter: {
            *value(callback) {
                const it = this;
                let value = it.next();
                let next_value;
                while (!value.done) {
                    const real_value = value.value;
                    if (callback(real_value)) {
                        next_value = yield real_value;
                        value = it.next(next_value);
                    }
                    else {
                        value = it.next(next_value);
                    }
                }
                return value.value;
            },
        },
        find: {
            value(callback) {
                const it = this;
                let value = it.next();
                while (!value.done) {
                    const real_value = value.value;
                    if (callback(real_value))
                        return real_value;
                    value = it.next();
                }
            }
        },
        every: {
            value(callback) {
                const it = this;
                let value = it.next();
                while (!value.done) {
                    const real_value = value.value;
                    if (!callback(real_value))
                        return false;
                    value = it.next();
                }
                return true;
            }
        },
        some: {
            value(callback) {
                const it = this;
                let value = it.next();
                while (!value.done) {
                    const real_value = value.value;
                    if (callback(real_value))
                        return true;
                    value = it.next();
                }
                return false;
            }
        },
        toArray: {
            value(max_count = Infinity) {
                const values = [];
                const it = this;
                let value = it.next();
                while (!value.done) {
                    const real_value = value.value;
                    if (max_count <= 0)
                        return values;
                    values.push(real_value);
                    if (max_count !== Infinity)
                        max_count--;
                    value = it.next();
                }
                return values;
            }
        },
        take: {
            *value(limit) {
                limit = Number(limit);
                if (limit < 0)
                    throw new RangeError('Invalid limit.');
                const it = this;
                let value = it.next();
                let remaining = limit;
                let next_value;
                while (!value.done) {
                    const real_value = value.value;
                    if (remaining <= 0)
                        return;
                    next_value = yield real_value;
                    value = it.next(next_value);
                    remaining--;
                }
                return value.value;
            },
        },
        drop: {
            *value(limit) {
                limit = Number(limit);
                if (limit < 0)
                    throw new RangeError('Invalid limit.');
                const it = this;
                let value = it.next();
                let remaining = limit;
                let next_value;
                while (!value.done) {
                    const real_value = value.value;
                    if (remaining > 0) {
                        value = it.next(next_value);
                        remaining--;
                        continue;
                    }
                    next_value = yield real_value;
                    value = it.next(next_value);
                }
                return value.value;
            },
        },
        asIndexedPairs: {
            *value() {
                const it = this;
                let value = it.next();
                let index = 0;
                while (!value.done) {
                    const real_value = value.value;
                    const next_value = yield [index, real_value];
                    ;
                    value = it.next(next_value);
                    index++;
                }
                return value.value;
            }
        },
        flatMap: {
            *value(mapper) {
                if (typeof mapper !== 'function') {
                    throw new TypeError('Mapper must be a function.');
                }
                const it = this;
                let value = it.next();
                let next_value;
                while (!value.done) {
                    const real_value = value.value;
                    const mapped = mapper(real_value);
                    if (Symbol.iterator in mapped) {
                        // @ts-ignore
                        next_value = yield* mapped[Symbol.iterator]();
                    }
                    else {
                        next_value = yield mapped;
                    }
                    value = it.next(next_value);
                }
                return value.value;
            },
        },
        reduce: {
            value(reducer, initial_value) {
                let acc = initial_value;
                const it = this;
                if (acc === undefined) {
                    acc = it.next().value;
                }
                let value = it.next();
                while (!value.done) {
                    const real_value = value.value;
                    acc = reducer(acc, real_value);
                    value = it.next();
                }
                return acc;
            }
        },
        forEach: {
            value(callback) {
                const it = this;
                let value = it.next();
                while (!value.done) {
                    const real_value = value.value;
                    callback(real_value);
                    value = it.next();
                }
            }
        },
        [Symbol.toStringTag]: {
            value: 'IteratorPrototype'
        },
        /* OUTSIDE PROPOSAL */
        count: {
            value() {
                let count = 0;
                const it = this;
                let value = it.next();
                while (!value.done) {
                    count++;
                    value = it.next();
                }
                return count;
            },
        },
        join: {
            value(string) {
                let final = '';
                let first = true;
                const it = this;
                let value = it.next();
                while (!value.done) {
                    const real_value = value.value;
                    if (first) {
                        first = false;
                        final += real_value;
                    }
                    else {
                        final += string + real_value;
                    }
                    value = it.next();
                }
                return final;
            }
        },
        chain: {
            *value(...iterables) {
                yield* this;
                for (const it of iterables) {
                    yield* it;
                }
            }
        },
        zip: {
            *value(...others) {
                const it_array = [this, ...others].map((e) => Symbol.iterator in e ? e[Symbol.iterator]() : e);
                let values = it_array.map(e => e.next());
                let next_value;
                while (values.every(e => !e.done)) {
                    next_value = yield values.map(e => e.value);
                    values = it_array.map(e => e.next(next_value));
                }
            },
        },
        takeWhile: {
            *value(callback) {
                const it = this;
                let value = it.next();
                let next_value;
                while (!value.done) {
                    const real_value = value.value;
                    if (callback(real_value))
                        next_value = yield real_value;
                    else
                        return;
                    value = it.next(next_value);
                }
                return value.value;
            }
        },
        dropWhile: {
            *value(callback) {
                const it = this;
                let value = it.next();
                let next_value;
                let finished = false;
                while (!value.done) {
                    const real_value = value.value;
                    if (!finished && callback(real_value)) {
                        value = it.next(next_value);
                        continue;
                    }
                    finished = true;
                    next_value = yield real_value;
                    value = it.next(next_value);
                }
                return value.value;
            }
        },
        fuse: {
            *value() {
                const it = this;
                let value = it.next();
                let next_value;
                while (!value.done) {
                    const real_value = value.value;
                    if (real_value !== undefined && real_value !== null)
                        next_value = yield real_value;
                    else
                        return;
                    value = it.next(next_value);
                }
                return value.value;
            }
        },
        partition: {
            value(callback) {
                const partition1 = [], partition2 = [];
                const it = this;
                let value = it.next();
                while (!value.done) {
                    const real_value = value.value;
                    if (callback(real_value))
                        partition1.push(real_value);
                    else
                        partition2.push(real_value);
                    value = it.next();
                }
                return [partition1, partition2];
            },
        },
        findIndex: {
            value(callback) {
                const it = this;
                let i = 0;
                let value = it.next();
                while (!value.done) {
                    const real_value = value.value;
                    if (callback(real_value))
                        return i;
                    value = it.next();
                    i++;
                }
                return -1;
            }
        },
        max: {
            value() {
                let max = -Infinity;
                const it = this;
                let value = it.next();
                while (!value.done) {
                    const real_value = value.value;
                    if (max < real_value)
                        max = real_value;
                    value = it.next();
                }
                return max;
            },
        },
        min: {
            value() {
                let min = Infinity;
                const it = this;
                let value = it.next();
                while (!value.done) {
                    const real_value = value.value;
                    if (min > real_value)
                        min = real_value;
                    value = it.next();
                }
                return min;
            },
        },
        cycle: {
            *value() {
                const values = [];
                const it = this;
                let value = it.next();
                while (!value.done) {
                    const real_value = value.value;
                    values.push(real_value);
                    const next_value = yield real_value;
                    value = it.next(next_value);
                }
                while (true) {
                    yield* values;
                }
            },
        },
    });
    /// Polyfill for AsyncIterator
    const AsyncIteratorPrototype = {};
    const AsyncGeneratorPrototype = Object.getPrototypeOf((async function* () { })()[Symbol.asyncIterator]());
    const BaseAsyncGeneratorPrototype = Object.getPrototypeOf(AsyncGeneratorPrototype);
    const OriginalAsyncIteratorPrototype = Object.getPrototypeOf(BaseAsyncGeneratorPrototype);
    Object.setPrototypeOf(OriginalAsyncIteratorPrototype, AsyncIteratorPrototype);
    Object.defineProperties(AsyncIteratorPrototype, {
        [Symbol.asyncIterator]: {
            value() {
                return this;
            }
        },
        map: {
            async *value(callback) {
                const it = this;
                let value = await it.next();
                while (!value.done) {
                    const real_value = callback(value.value);
                    const next_value = yield real_value;
                    value = await it.next(next_value);
                }
                return value.value;
            },
        },
        filter: {
            async *value(callback) {
                const it = this;
                let value = await it.next();
                let next_value;
                while (!value.done) {
                    const real_value = value.value;
                    if (callback(real_value)) {
                        next_value = yield real_value;
                    }
                    value = await it.next(next_value);
                }
                return value.value;
            },
        },
        find: {
            async value(callback) {
                const it = this;
                let value = await it.next();
                while (!value.done) {
                    const real_value = value.value;
                    if (callback(real_value))
                        return real_value;
                    value = await it.next();
                }
            }
        },
        every: {
            async value(callback) {
                const it = this;
                let value = await it.next();
                while (!value.done) {
                    const real_value = value.value;
                    if (!callback(real_value))
                        return false;
                    value = await it.next();
                }
                return true;
            }
        },
        some: {
            async value(callback) {
                const it = this;
                let value = await it.next();
                while (!value.done) {
                    const real_value = value.value;
                    if (callback(real_value))
                        return true;
                    value = await it.next();
                }
                return false;
            }
        },
        toArray: {
            async value(max_count = Infinity) {
                const values = [];
                const it = this;
                let value = await it.next();
                while (!value.done) {
                    const real_value = value.value;
                    if (max_count <= 0)
                        return values;
                    values.push(real_value);
                    if (max_count !== Infinity)
                        max_count--;
                    value = await it.next();
                }
                return values;
            }
        },
        take: {
            async *value(limit) {
                limit = Number(limit);
                if (limit < 0)
                    throw new RangeError('Invalid limit.');
                const it = this;
                let value = await it.next();
                let next_value;
                let remaining = limit;
                while (!value.done) {
                    if (remaining <= 0)
                        return;
                    const real_value = value.value;
                    next_value = yield real_value;
                    value = await it.next(next_value);
                    remaining--;
                }
                return value.value;
            },
        },
        drop: {
            async *value(limit) {
                limit = Number(limit);
                if (limit < 0)
                    throw new RangeError('Invalid limit.');
                const it = this;
                let value = await it.next();
                let next_value;
                let remaining = limit;
                while (!value.done) {
                    if (remaining > 0) {
                        remaining--;
                        value = await it.next(next_value);
                        continue;
                    }
                    const real_value = value.value;
                    next_value = yield real_value;
                    value = await it.next(next_value);
                    remaining--;
                }
                return value.value;
            },
        },
        asIndexedPairs: {
            async *value() {
                let index = 0;
                const it = this;
                let value = await it.next();
                while (!value.done) {
                    const real_value = value.value;
                    const next_value = yield [index, real_value];
                    index++;
                    value = await it.next(next_value);
                }
                return value.value;
            }
        },
        flatMap: {
            async *value(mapper) {
                if (typeof mapper !== 'function') {
                    throw new TypeError('Mapper must be a function.');
                }
                const it = this;
                let value = await it.next();
                let next_value;
                while (!value.done) {
                    const real_value = value.value;
                    const mapped = mapper(real_value);
                    if (Symbol.asyncIterator in mapped) {
                        // @ts-ignore
                        yield* mapped[Symbol.asyncIterator]();
                    }
                    else if (Symbol.iterator in mapped) {
                        // @ts-ignore
                        yield* mapped[Symbol.iterator]();
                    }
                    else {
                        yield mapped;
                    }
                    value = await it.next(next_value);
                }
                return value.value;
            },
        },
        reduce: {
            async value(reducer, initial_value) {
                let acc = initial_value;
                const it = this;
                if (acc === undefined) {
                    acc = (await it.next()).value;
                }
                for await (const value of it) {
                    acc = reducer(acc, value);
                }
                return acc;
            }
        },
        forEach: {
            async value(callback) {
                const it = this;
                let value = await it.next();
                while (!value.done) {
                    const real_value = value.value;
                    callback(real_value);
                    value = await it.next();
                }
            }
        },
        [Symbol.toStringTag]: {
            value: 'AsyncIteratorPrototype'
        },
        /* OUTSIDE PROPOSAL */
        join: {
            async value(string) {
                let final = '';
                let first = true;
                const it = this;
                let value = await it.next();
                while (!value.done) {
                    const real_value = value.value;
                    if (first) {
                        first = false;
                        final += real_value;
                    }
                    else {
                        final += string + real_value;
                    }
                    value = await it.next();
                }
                return final;
            }
        },
        count: {
            async value() {
                let count = 0;
                const it = this;
                let value = await it.next();
                while (!value.done) {
                    count++;
                    value = await it.next();
                }
                return count;
            },
        },
        chain: {
            async *value(...iterables) {
                yield* this;
                for (const it of iterables) {
                    yield* it;
                }
            }
        },
        zip: {
            async *value(...others) {
                const it_array = [this, ...others].map((e) => Symbol.asyncIterator in e ? e[Symbol.asyncIterator]() : e);
                let values = await Promise.all(it_array.map(e => e.next()));
                while (values.every(e => !e.done)) {
                    yield values.map(e => e.value);
                    values = await Promise.all(it_array.map(e => e.next()));
                }
            },
        },
        takeWhile: {
            async *value(callback) {
                const it = this;
                let value = await it.next();
                let next_value;
                while (!value.done) {
                    const real_value = value.value;
                    if (callback(real_value)) {
                        next_value = yield real_value;
                    }
                    else {
                        return;
                    }
                    value = await it.next(next_value);
                }
                return value.value;
            }
        },
        dropWhile: {
            async *value(callback) {
                const it = this;
                let value = await it.next();
                let next_value;
                let finished = false;
                while (!value.done) {
                    const real_value = value.value;
                    if (!finished && callback(real_value)) {
                        value = await it.next(next_value);
                        continue;
                    }
                    finished = true;
                    next_value = yield real_value;
                    value = await it.next(next_value);
                }
                return value.value;
            }
        },
        fuse: {
            async *value() {
                const it = this;
                let value = await it.next();
                let next_value;
                while (!value.done) {
                    const real_value = value.value;
                    if (real_value !== undefined && real_value !== null) {
                        next_value = yield real_value;
                    }
                    else {
                        return;
                    }
                    value = await it.next(next_value);
                }
                return value.value;
            }
        },
        partition: {
            async value(callback) {
                const partition1 = [], partition2 = [];
                const it = this;
                let value = await it.next();
                while (!value.done) {
                    const real_value = value.value;
                    if (callback(real_value))
                        partition1.push(real_value);
                    else
                        partition2.push(real_value);
                    value = await it.next();
                }
                return [partition1, partition2];
            },
        },
        findIndex: {
            async value(callback) {
                const it = this;
                let value = await it.next();
                let i = 0;
                while (!value.done) {
                    const real_value = value.value;
                    if (callback(real_value))
                        return i;
                    value = await it.next();
                    i++;
                }
                return -1;
            }
        },
        max: {
            async value() {
                let max = -Infinity;
                const it = this;
                let value = await it.next();
                while (!value.done) {
                    const real_value = value.value;
                    if (max < real_value)
                        max = real_value;
                    value = await it.next();
                }
                return max;
            },
        },
        min: {
            async value() {
                let min = Infinity;
                const it = this;
                let value = await it.next();
                while (!value.done) {
                    const real_value = value.value;
                    if (min > real_value)
                        min = real_value;
                    value = await it.next();
                }
                return min;
            },
        },
        cycle: {
            async *value() {
                const values = [];
                const it = this;
                let value = await it.next();
                while (!value.done) {
                    const real_value = value.value;
                    values.push(real_value);
                    const next_value = yield real_value;
                    value = await it.next(next_value);
                }
                while (true) {
                    for (const value of values) {
                        yield value;
                    }
                }
            },
        },
    });
    if (!('Iterator' in _globalThis)) {
        const Iterator = function Iterator() { };
        Iterator.prototype = IteratorPrototype;
        // @ts-ignore
        _globalThis.Iterator = Iterator;
    }
    if (!('AsyncIterator' in _globalThis)) {
        const AsyncIterator = function AsyncIterator() { };
        AsyncIterator.prototype = AsyncIteratorPrototype;
        // @ts-ignore
        _globalThis.AsyncIterator = AsyncIterator;
    }
})();
