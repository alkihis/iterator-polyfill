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
                for (const value of this)
                    yield callback(value);
            },
        },
        filter: {
            *value(callback) {
                for (const value of this)
                    if (callback(value))
                        yield value;
            },
        },
        find: {
            value(callback) {
                for (const value of this) {
                    if (callback(value))
                        return value;
                }
            }
        },
        every: {
            value(callback) {
                for (const value of this) {
                    if (!callback(value))
                        return false;
                }
                return true;
            }
        },
        some: {
            value(callback) {
                for (const value of this) {
                    if (callback(value))
                        return true;
                }
                return false;
            }
        },
        toArray: {
            value(max_count = Infinity) {
                const values = [];
                for (const value of this) {
                    if (max_count <= 0)
                        return values;
                    values.push(value);
                    if (max_count !== Infinity)
                        max_count--;
                }
                return values;
            }
        },
        take: {
            *value(limit) {
                limit = Number(limit);
                if (limit < 0)
                    throw new RangeError('Invalid limit.');
                let remaining = limit;
                for (const value of this) {
                    if (remaining <= 0)
                        return;
                    yield value;
                    remaining--;
                }
            },
        },
        drop: {
            *value(limit) {
                limit = Number(limit);
                if (limit < 0)
                    throw new RangeError('Invalid limit.');
                let remaining = limit;
                for (const value of this) {
                    if (remaining > 0) {
                        remaining--;
                        continue;
                    }
                    yield value;
                }
            },
        },
        asIndexedPairs: {
            *value() {
                let index = 0;
                for (const value of this) {
                    yield [index, value];
                    index++;
                }
            }
        },
        flatMap: {
            *value(mapper) {
                if (typeof mapper !== 'function') {
                    throw new TypeError('Mapper must be a function.');
                }
                for (const value of this) {
                    const mapped = mapper(value);
                    if (Symbol.iterator in mapped) {
                        // @ts-ignore
                        yield* mapped[Symbol.iterator]();
                    }
                    else {
                        yield mapped;
                    }
                }
            },
        },
        reduce: {
            value(reducer, initial_value) {
                let acc = initial_value;
                const it = this[Symbol.iterator]();
                if (acc === undefined) {
                    acc = it.next().value;
                }
                for (const value of it) {
                    acc = reducer(acc, value);
                }
                return acc;
            }
        },
        forEach: {
            value(callback) {
                for (const value of this)
                    callback(value);
            }
        },
        [Symbol.toStringTag]: {
            value: 'IteratorPrototype'
        },
        /* OUTSIDE PROPOSAL */
        count: {
            value() {
                let count = 0;
                for (const _ of this)
                    count++;
                return count;
            },
        },
        join: {
            value(string) {
                let final = '';
                let first = true;
                for (const value of this) {
                    if (first) {
                        first = false;
                        final += value;
                    }
                    else {
                        final += string + value;
                    }
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
                const it_array = [this, ...others].map((e) => e[Symbol.iterator]());
                let values = it_array.map(e => e.next());
                while (values.every(e => !e.done)) {
                    yield values.map(e => e.value);
                    values = it_array.map(e => e.next());
                }
            },
        },
        takeWhile: {
            *value(callback) {
                for (const value of this) {
                    if (callback(value))
                        yield value;
                    else
                        break;
                }
            }
        },
        dropWhile: {
            *value(callback) {
                let finished = false;
                for (const value of this) {
                    if (!finished && callback(value))
                        continue;
                    finished = true;
                    yield value;
                }
            }
        },
        fuse: {
            value() {
                return this.takeWhile((e) => e !== undefined && e !== null);
            }
        },
        partition: {
            value(callback) {
                const partition1 = [], partition2 = [];
                for (const value of this) {
                    if (callback(value))
                        partition1.push(value);
                    else
                        partition2.push(value);
                }
                return [partition1, partition2];
            },
        },
        findIndex: {
            value(callback) {
                for (const [index, value] of this.asIndexedPairs()) {
                    if (callback(value))
                        return index;
                }
                return -1;
            }
        },
        max: {
            value() {
                return this.reduce((acc, val) => {
                    if (acc > val)
                        return acc;
                    return val;
                });
            },
        },
        min: {
            value() {
                return this.reduce((acc, val) => {
                    if (acc < val)
                        return acc;
                    return val;
                });
            },
        },
        cycle: {
            *value() {
                const values = [];
                for (const value of this) {
                    values.push(value);
                    yield value;
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
                for await (const value of this)
                    yield callback(value);
            },
        },
        filter: {
            async *value(callback) {
                for await (const value of this)
                    if (callback(value))
                        yield value;
            },
        },
        find: {
            async value(callback) {
                for await (const value of this) {
                    if (callback(value))
                        return value;
                }
            }
        },
        every: {
            async value(callback) {
                for await (const value of this) {
                    if (!callback(value))
                        return false;
                }
                return true;
            }
        },
        some: {
            async value(callback) {
                for await (const value of this) {
                    if (callback(value))
                        return true;
                }
                return false;
            }
        },
        toArray: {
            async value(max_count = Infinity) {
                const values = [];
                for await (const value of this) {
                    if (max_count <= 0)
                        return values;
                    values.push(value);
                    if (max_count !== Infinity)
                        max_count--;
                }
                return values;
            }
        },
        take: {
            async *value(limit) {
                limit = Number(limit);
                if (limit < 0)
                    throw new RangeError('Invalid limit.');
                let remaining = limit;
                for await (const value of this) {
                    if (remaining <= 0)
                        return;
                    yield value;
                    remaining--;
                }
            },
        },
        drop: {
            async *value(limit) {
                limit = Number(limit);
                if (limit < 0)
                    throw new RangeError('Invalid limit.');
                let remaining = limit;
                for await (const value of this) {
                    if (remaining > 0) {
                        remaining--;
                        continue;
                    }
                    yield value;
                }
            },
        },
        asIndexedPairs: {
            async *value() {
                let index = 0;
                for await (const value of this) {
                    yield [index, value];
                    index++;
                }
            }
        },
        flatMap: {
            async *value(mapper) {
                if (typeof mapper !== 'function') {
                    throw new TypeError('Mapper must be a function.');
                }
                for await (const value of this) {
                    const mapped = mapper(value);
                    if (Symbol.asyncIterator in mapped) {
                        // @ts-ignore
                        yield* mapped[Symbol.asyncIterator]();
                    }
                    else {
                        yield mapped;
                    }
                }
            },
        },
        reduce: {
            async value(reducer, initial_value) {
                let acc = initial_value;
                const it = this[Symbol.asyncIterator]();
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
                for await (const value of this)
                    callback(value);
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
                for await (const value of this) {
                    if (first) {
                        first = false;
                        final += value;
                    }
                    else {
                        final += string + value;
                    }
                }
                return final;
            }
        },
        count: {
            async value() {
                let count = 0;
                for await (const _ of this)
                    count++;
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
                const it_array = [this, ...others].map((e) => e[Symbol.asyncIterator]());
                let values = await Promise.all(it_array.map(e => e.next()));
                while (values.every(e => !e.done)) {
                    yield values.map(e => e.value);
                    values = await Promise.all(it_array.map(e => e.next()));
                }
            },
        },
        takeWhile: {
            async *value(callback) {
                for await (const value of this) {
                    if (callback(value))
                        yield value;
                    else
                        break;
                }
            }
        },
        dropWhile: {
            async *value(callback) {
                let finished = false;
                for await (const value of this) {
                    if (!finished && callback(value))
                        continue;
                    finished = true;
                    yield value;
                }
            }
        },
        fuse: {
            value() {
                return this.takeWhile((e) => e !== undefined && e !== null);
            }
        },
        partition: {
            async value(callback) {
                const partition1 = [], partition2 = [];
                for await (const value of this) {
                    if (callback(value))
                        partition1.push(value);
                    else
                        partition2.push(value);
                }
                return [partition1, partition2];
            },
        },
        findIndex: {
            async value(callback) {
                for await (const [index, value] of this.asIndexedPairs()) {
                    if (callback(value))
                        return index;
                }
                return -1;
            }
        },
        max: {
            value() {
                return this.reduce((acc, val) => {
                    if (acc > val)
                        return acc;
                    return val;
                });
            },
        },
        min: {
            value() {
                return this.reduce((acc, val) => {
                    if (acc < val)
                        return acc;
                    return val;
                });
            },
        },
        cycle: {
            async *value() {
                const values = [];
                for await (const value of this) {
                    values.push(value);
                    yield value;
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
        // @ts-ignore
        _globalThis.Iterator = {
            // @ts-ignore
            protoype: IteratorPrototype
        };
    }
    if (!('AsyncIterator' in _globalThis)) {
        // @ts-ignore
        _globalThis.AsyncIterator = {
            // @ts-ignore
            protoype: AsyncIteratorPrototype
        };
    }
})();
