'use strict';

/*
 * Type definitions for extending Window interface
 */

interface IteratorPrototype<T, TReturn = any, TNext = undefined> {
  protoype: Iterator<T, TReturn, TNext>;
}

interface AsyncIteratorPrototype<T, TReturn = any, TNext = undefined> {
  protoype: AsyncIterator<T, TReturn, TNext>;
}

interface Window {
  Iterator: IteratorPrototype<any>;
  AsyncIterator: AsyncIteratorPrototype<any>;
}

declare const Iterator: IteratorPrototype<any>;
declare const AsyncIterator: IteratorPrototype<any>;

/*
 * Type definitions for extending Iterator & AsyncIterator interfaces
 */

interface Iterator<T, TReturn = any, TNext = undefined> {
  /** Map each value of iterator to another value via {callback}. */
  map<R>(callback: (value: T) => R) : Iterator<R, TReturn, TNext>;
  /** Each value is given through {callback}, return `true` if value is needed into returned iterator. */
  filter(callback: (value: T) => boolean) : Iterator<T, TReturn, TNext>;
  /** Create a new iterator that consume {limit} items, then stops. */
  take(limit: number) : Iterator<T, TReturn, TNext>;
  /** Create a new iterator that skip {limit} items from source iterator, then yield all values. */
  drop(limit: number) : Iterator<T, TReturn, TNext>;
  /** Get a pair [index, value] for each remaining value of iterable. */
  asIndexedPairs() : Iterator<[number, T], TReturn, TNext>;
  /** Like map, but you can return a new iterator that will be flattened. */
  flatMap<R>(mapper: (value: T) => Iterator<R> | R) : Iterator<R, TReturn, TNext>;
  /** Find a specific value that returns `true` in {callback}, and return it. Returns `undefined` otherwise. */
  find(callback: (value: T) => boolean) : T | undefined;
  /** Return `true` if each value of iterator validate {callback}. */
  every(callback: (value: T) => boolean) : boolean;
  /** Return `true` if one value of iterator validate {callback}. */
  some(callback: (value: T) => boolean) : boolean;
  /** Consume iterator and collapse values inside an array. */
  toArray(max_count?: number) : T[];
  /** Accumulate each item inside **acc** for each value **value**. */
  reduce<V = T>(reducer: (acc: V, value: T) => V, initial_value?: V) : V;
  /** Iterate over each value of iterator by calling **callback** for each value. */
  forEach(callback: (value: T) => any) : void;

  /** Join every item of iterator with {separator}, and return the built string. */
  join(separator: string) : string;
  /** Count number of values within iterable. It consumes it. */
  count() : number;
  /** Chain iterables together, in provided order. */
  chain<I>(...iterables: IterableIterator<I>[]) : Iterator<T | I, TReturn, TNext>;
  /** Iterate through multiple iterators together */
  zip<O>(...others: IterableIterator<O>[]) : Iterator<(T | O)[], TReturn, TNext>;
  /** 
   * It will call this closure on each element of the iterator, and ignore elements until it returns false. 
   * After false is returned, dropWhile()'s job is over, and the rest of the elements are yielded. 
   */
  dropWhile(callback: (value: T) => boolean) : Iterator<T, TReturn, TNext>;
  /** 
   * It will call this closure on each element of the iterator, and yield elements until it returns false. 
   * After false is returned, takeWhile()'s job is over, and the rest of the elements are ignored. 
   */
  takeWhile(callback: (value: T) => boolean) : Iterator<T, TReturn, TNext>;
  /** 
   * Yield items until one item is `null` or `undefined`.
   * 
   * Shortcut for `.takeWhile(e => e !== undefined && e !== null)`.
   */
  fuse() : Iterator<T, TReturn, TNext>;
  /** 
   * Consume iterator to create two partitions : first is filled when `callback(item)` is `true`, 
   * second when `callback(item)` is `false`. 
   */
  partition(callback: (value: T) => boolean) : [T[], T[]];
  /** Find index in iterator for the first item where {callback} returns `true` (consume iterator). */
  findIndex(callback: (value: T) => boolean) : number;
  /** Return the max element in iterator (consume it). */
  max() : T;
  /** Return the max element in iterator (consume it). */
  min() : T;
  /** Instead of stopping when iterator is consumed, the iterator will instead start again, from the beginning. Forever. */
  cycle() : Iterator<T, TReturn, TNext>;
}

interface AsyncIterator<T, TReturn = any, TNext = undefined> {
  /** Map each value of iterator to another value via {callback}. */
  map<R>(callback: (value: T) => R) : AsyncIterator<R, TReturn, TNext>;
  /** Each value is given through {callback}, return `true` if value is needed into returned iterator. */
  filter(callback: (value: T) => boolean) : AsyncIterator<T, TReturn, TNext>;
  /** Create a new iterator that consume {limit} items, then stops. */
  take(limit: number) : AsyncIterator<T, TReturn, TNext>;
  /** Create a new iterator that skip {limit} items from source iterator, then yield all values. */
  drop(limit: number) : AsyncIterator<T, TReturn, TNext>;
  /** Get a pair [index, value] for each remaining value of iterable. */
  asIndexedPairs() : AsyncIterator<[number, T], TReturn, TNext>;
  /** Like map, but you can return a new iterator that will be flattened. */
  flatMap<R>(mapper: (value: T) => AsyncIterator<R> | R) : AsyncIterator<R, TReturn, TNext>;
  /** Find a specific value that returns `true` in {callback}, and return it. Returns `undefined` otherwise. */
  find(callback: (value: T) => boolean) : Promise<T | undefined>;
  /** Return `true` if each value of iterator validate {callback}. */
  every(callback: (value: T) => boolean) : Promise<boolean>;
  /** Return `true` if one value of iterator validate {callback}. */
  some(callback: (value: T) => boolean) : Promise<boolean>;
  /** Consume iterator and collapse values inside an array. */
  toArray(max_count?: number) : Promise<T[]>;
  /** Accumulate each item inside **acc** for each value **value**. */
  reduce<V = T>(reducer: (acc: V, value: T) => V, initial_value?: V) : Promise<V>;
  /** Iterate over each value of iterator by calling **callback** for each value. */
  forEach(callback: (value: T) => any) : Promise<void>;

  /** Join every item of iterator with {separator}, and return the built string. */
  join(separator: string) : Promise<string>;
  /** Count number of values within iterable. It consumes it. */
  count() : Promise<number>;
  /** Chain iterables together, in provided order. */
  chain<I>(...iterables: AsyncIterableIterator<I>[]) : AsyncIterator<T | I, TReturn, TNext>;
  /** Iterate through multiple iterators together */
  zip<O>(...others: AsyncIterableIterator<O>[]) : AsyncIterator<(T | O)[], TReturn, TNext>;
  /** 
   * It will call this closure on each element of the iterator, and ignore elements until it returns false. 
   * After false is returned, dropWhile()'s job is over, and the rest of the elements are yielded. 
   */
  dropWhile(callback: (value: T) => boolean) : AsyncIterator<T, TReturn, TNext>;
  /** 
   * It will call this closure on each element of the iterator, and yield elements until it returns false. 
   * After false is returned, takeWhile()'s job is over, and the rest of the elements are ignored. 
   */
  takeWhile(callback: (value: T) => boolean) : AsyncIterator<T, TReturn, TNext>;
  /** 
   * Yield items until one item is `null` or `undefined`.
   * 
   * Shortcut for `.takeWhile(e => e !== undefined && e !== null)`.
   */
  fuse() : AsyncIterator<T, TReturn, TNext>;
  /** 
   * Consume iterator to create two partitions : first is filled when `callback(item)` is `true`, 
   * second when `callback(item)` is `false`. 
   */
  partition(callback: (value: T) => boolean) : Promise<[T[], T[]]>;
  /** Find index in iterator for the first item where {callback} returns `true` (consume iterator). */
  findIndex(callback: (value: T) => boolean) : Promise<number>;
  /** Return the max element in iterator (consume it). */
  max() : Promise<T>;
  /** Return the max element in iterator (consume it). */
  min() : Promise<T>;
  /** Instead of stopping when iterator is consumed, the iterator will instead start again, from the beginning. Forever. */
  cycle() : AsyncIterator<T, TReturn, TNext>;
}


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
      *value<T, R>(callback: (value: T) => R) {
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
      *value<T>(callback: (value: T) => boolean) {
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
      value<T>(callback: (value: boolean) => T) {
        for (const value of this) {
          if (callback(value))
            return value;
        }
      }
    },
    every: {
      value<T>(callback: (value: T) => boolean) {
        for (const value of this) {
          if (!callback(value))
            return false;
        }
    
        return true;
      }
    },
    some: {
      value<T>(callback: (value: T) => boolean) {
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
      *value(limit: number) {
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
      *value(limit: number) {
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
          const next_value = yield [index, real_value];;
          value = it.next(next_value);
          index++;
        }

        return value.value;
      }
    },
    flatMap: {
      *value<T, R>(mapper: (value: T) => IterableIterator<R> | R) {
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
      value<T, V>(reducer: (acc: V, value: T) => V, initial_value?: V) {
        let acc = initial_value;

        const it = this[Symbol.iterator]();
        if (acc === undefined) {
          acc = it.next().value;
        }

        for (const value of it) {
          acc = reducer(acc!, value);
        }

        return acc;
      }
    },
    forEach: {
      value<T>(callback: (value: T) => any) {
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
      value(string: string) {
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
      *value<I>(...iterables: IterableIterator<I>[]) {
        yield* this;

        for (const it of iterables) {
          yield* it;
        }
      }
    },
    zip: {
      *value<T, O>(...others: IterableIterator<O>[]) : Iterator<(T | O)[]> {
        const it_array = [this, ...others].map((e: any) => e[Symbol.iterator]() as Iterator<T | O>);
        let values = it_array.map(e => e.next());
        let next_value: any;

        while (values.every(e => !e.done)) {
          next_value = yield values.map(e => e.value);
          values = it_array.map(e => e.next(next_value));
        }
      },
    },
    takeWhile: {
      *value<T>(callback: (value: T) => boolean) {
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
      *value<T>(callback: (value: T) => boolean) {
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
      value() {
        return this.takeWhile((e: any) => e !== undefined && e !== null);
      }
    },
    partition: {
      value<T>(callback: (value: T) => boolean) {
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
      value<T>(callback: (value: T) => boolean) {
        for (const [index, value] of this.asIndexedPairs()) {
          if (callback(value))
            return index;
        }

        return -1;
      } 
    },
    max: {
      value() {
        return this.reduce((acc: number, val: number) => {
          if (acc > val)
            return acc;
          return val;
        });
      },
    },
    min: {
      value() {
        return this.reduce((acc: number, val: number) => {
          if (acc < val)
            return acc;
          return val;
        });
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

  const AsyncGeneratorPrototype = Object.getPrototypeOf((async function* () {})()[Symbol.asyncIterator]());
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
      async *value<T, R>(callback: (value: T) => R) {
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
      async *value<T>(callback: (value: T) => boolean) {
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
      async value<T>(callback: (value: T) => boolean) {
        for await (const value of this) {
          if (callback(value))
            return value;
        }
      }
    },
    every: {
      async value<T>(callback: (value: T) => boolean) {
        for await (const value of this) {
          if (!callback(value))
            return false;
        }
    
        return true;
      }
    },
    some: {
      async value<T>(callback: (value: T) => boolean) {
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
      async *value(limit: number) {
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
      async *value(limit: number) {
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
          index++
          value = await it.next(next_value);
        }

        return value.value;
      }
    },
    flatMap: {
      async *value<T, R>(mapper: (value: T) => AsyncIterator<R> | R) {
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
      async value<T, V>(reducer: (acc: V, value: T) => V, initial_value?: V) {
        let acc = initial_value;

        const it = this[Symbol.asyncIterator]();
        if (acc === undefined) {
          acc = (await it.next()).value;
        }

        for await (const value of it) {
          acc = reducer(acc!, value);
        }

        return acc;
      }
    },
    forEach: {
      async value<T>(callback: (value: T) => any) {
        for await (const value of this)
          callback(value);
      }
    },
    [Symbol.toStringTag]: {
      value: 'AsyncIteratorPrototype'
    },

    /* OUTSIDE PROPOSAL */
    join: {
      async value(string: string) {
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
      async *value<I>(...iterables: AsyncIterableIterator<I>[]) {
        yield* this;

        for (const it of iterables) {
          yield* it;
        }
      }
    },
    zip: {
      async *value<T, O>(...others: AsyncIterableIterator<O>[]) : AsyncIterator<(T | O)[]> {
        const it_array = [this, ...others].map((e: any) => e[Symbol.asyncIterator]() as AsyncIterator<T | O>);
        let values = await Promise.all(it_array.map(e => e.next()));

        while (values.every(e => !e.done)) {
          yield values.map(e => e.value);
          values = await Promise.all(it_array.map(e => e.next()));
        }
      },
    },
    takeWhile: {
      async *value<T>(callback: (value: T) => boolean) {
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
      async *value<T>(callback: (value: T) => boolean) {
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
      value() {
        return this.takeWhile((e: any) => e !== undefined && e !== null);
      }
    },
    partition: {
      async value<T>(callback: (value: T) => boolean) {
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
      async value<T>(callback: (value: T) => boolean) {
        for await (const [index, value] of this.asIndexedPairs()) {
          if (callback(value))
            return index;
        }

        return -1;
      } 
    },
    max: {
      value() {
        return this.reduce((acc: number, val: number) => {
          if (acc > val)
            return acc;
          return val;
        });
      },
    },
    min: {
      value() {
        return this.reduce((acc: number, val: number) => {
          if (acc < val)
            return acc;
          return val;
        });
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
    const Iterator = function Iterator(iterable: Iterator<any> | Iterable<any>) {
      let it = iterable || [];
      if (!('next' in it)) {
        it = it[Symbol.iterator]();
      }

      // Generator have the right prototype, so its ok to return them
      return (function* () {
        let value = it.next();

        while (!value.done) {
          const next_value = yield value.value;
          value = it.next(next_value);
        }

        return value.value;
      })();
    };
    Iterator.prototype = IteratorPrototype;

    // @ts-ignore
    (_globalThis as Window).Iterator = Iterator;
  }
  if (!('AsyncIterator' in _globalThis)) {
    const AsyncIterator = function AsyncIterator(iterable: AsyncIterator<any> | AsyncIterable<any> | Iterator<any> | Iterable<any>) {
      // Generator have the right prototype, so its ok to return them
      let it = iterable || [];

      // If given thing isn't an iterator, just an iterable
      if (!('next' in it)) {
        if (Symbol.asyncIterator in it) {
          // @ts-ignore Give a AsyncIterator
          it = it[Symbol.asyncIterator]();
        }
        else if (Symbol.iterator in it) {
          // @ts-ignore Give a Iterator
          it = it[Symbol.iterator]();
        }
        else {
          throw new TypeError('Bad iterable.');
        }
      }
      // else: thing is already an iterator/asynciterator

      const real_it = it as AsyncIterator<any> | Iterator<any>;

      return (async function* () {
        let value = await real_it.next();

        while (!value.done) {
          const next_value = yield value.value;
          value = await real_it.next(next_value);
        }

        return value.value;
      })();
    };
    AsyncIterator.prototype = AsyncIteratorPrototype;

    // @ts-ignore
    (_globalThis as Window).AsyncIterator = AsyncIterator;
  }
})();
