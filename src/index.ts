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
  /** Join every item of iterator with {separator}, and return the built string. */
  join(separator: string) : string;
  /** Consume iterator and collapse values inside an array. */
  toArray(max_count?: number) : T[];
  /** Count number of values within iterable. It consumes it. */
  count() : number;
  /** Accumulate each item inside **acc** for each value **value**. */
  reduce<V>(reducer: (acc: V, value: T) => V, initial_value?: V) : V;
  /** Iterate over each value of iterator by calling **callback** for each value. */
  forEach(callback: (value: T) => any) : void;
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
  /** Join every item of iterator with {separator}, and return the built string. */
  join(separator: string) : Promise<string>;
  /** Consume iterator and collapse values inside an array. */
  toArray(max_count?: number) : Promise<T[]>;
  /** Count number of values within iterable. It consumes it. */
  count() : Promise<number>;
  /** Accumulate each item inside **acc** for each value **value**. */
  reduce<V>(reducer: (acc: V, value: T) => V, initial_value?: V) : Promise<V>;
  /** Iterate over each value of iterator by calling **callback** for each value. */
  forEach(callback: (value: T) => any) : Promise<void>;
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
        for (const value of this)
          yield callback(value);
      },
    },
    filter: {
      *value<T>(callback: (value: T) => boolean) {
        for (const value of this)
          if (callback(value))
            yield value;
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
    join: {
      value(string: string) {
        let final = '';
        let first = true;

        for (const value of this) {
          if (first) 
            first = false;
          else 
            final += string + value;
        }

        return final;
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
    count: {
      value() {
        let count = 0;
        
        for (const _ of this)
          count++;

        return count;
      },
    },
    take: {
      *value(limit: number) {
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
      *value(limit: number) {
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
        }
      }
    },
    flatMap: {
      *value<T, R>(mapper: (value: T) => Iterator<R> | R) {
        if (typeof mapper !== 'function') {
          throw new TypeError('Mapper must be a function.');
        }

        for (const value of this) {
          const mapped = mapper(value);

          if (Symbol.iterator in mapped) {
            // @ts-ignore
            yield* mapped[Symbol.iterator]().flatMap(mapper);
          } 
          else {
            yield mapped;
          }
        }
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
        for await (const value of this)
          yield callback(value);
      },
    },
    filter: {
      async *value<T>(callback: (value: T) => boolean) {
        for await (const value of this)
          if (callback(value))
            yield value;
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
    join: {
      async value(string: string) {
        let final = '';
        let first = true;

        for await (const value of this) {
          if (first) 
            first = false;
          else 
            final += string + value;
        }

        return final;
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
    count: {
      async value() {
        let count = 0;
        
        for await (const _ of this)
          count++;

        return count;
      },
    },
    take: {
      async *value(limit: number) {
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
      async *value(limit: number) {
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
        }
      }
    },
    flatMap: {
      async *value<T, R>(mapper: (value: T) => AsyncIterator<R> | R) {
        if (typeof mapper !== 'function') {
          throw new TypeError('Mapper must be a function.');
        }

        for await (const value of this) {
          const mapped = mapper(value);

          if (Symbol.asyncIterator in mapped) {
            // @ts-ignore
            yield* mapped[Symbol.asyncIterator]().flatMap(mapper);
          } 
          else {
            yield mapped;
          }
        }
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
  });

  if (!('Iterator' in _globalThis)) {
    // @ts-ignore
    (_globalThis as Window).Iterator = {
      // @ts-ignore
      protoype: IteratorPrototype
    };
  }
  if (!('AsyncIterator' in _globalThis)) {
    // @ts-ignore
    (_globalThis as Window).AsyncIterator = {
      // @ts-ignore
      protoype: AsyncIteratorPrototype
    };
  }
})();
