'use strict';

interface Iterator<T, TReturn = any, TNext = undefined> {
  map<R>(callback: (value: T) => R) : Iterator<R, TReturn, TNext>;
  filter(callback: (value: T) => boolean) : Iterator<T, TReturn, TNext>;
  take(limit: number) : Iterator<T, TReturn, TNext>;
  drop(limit: number) : Iterator<T, TReturn, TNext>;
  asIndexedPairs() : Iterator<[number, T], TReturn, TNext>;
  flatMap<R>(mapper: (value: T) => Iterator<R> | R) : Iterator<R, TReturn, TNext>;
  find(callback: (value: T) => boolean) : T | undefined;
  every(callback: (value: T) => boolean) : boolean;
  some(callback: (value: T) => boolean) : boolean;
  join(separator: string) : string;
  toArray(max_count?: number) : T[];
  count() : number;
  reduce<V>(reducer: (value: T, acc: V) => V, initial_value?: V) : V;
  forEach(callback: (value: T) => any) : void;
}

interface AsyncIterator<T, TReturn = any, TNext = undefined> {
  map<R>(callback: (value: T) => R) : AsyncIterator<R, TReturn, TNext>;
  filter(callback: (value: T) => boolean) : AsyncIterator<T, TReturn, TNext>;
  take(limit: number) : AsyncIterator<T, TReturn, TNext>;
  drop(limit: number) : AsyncIterator<T, TReturn, TNext>;
  asIndexedPairs() : AsyncIterator<[number, T], TReturn, TNext>;
  flatMap<R>(mapper: (value: T) => AsyncIterator<R> | R) : AsyncIterator<R, TReturn, TNext>;
  find(callback: (value: T) => boolean) : Promise<T | undefined>;
  every(callback: (value: T) => boolean) : Promise<boolean>;
  some(callback: (value: T) => boolean) : Promise<boolean>;
  join(separator: string) : Promise<string>;
  toArray(max_count?: number) : Promise<T[]>;
  count() : Promise<number>;
  reduce<V>(reducer: (value: T, acc: V) => V, initial_value?: V) : Promise<V>;
  forEach(callback: (value: T) => any) : Promise<void>;
}

(function () {
  // Polyfill for Iterator
  const IteratorPrototype = {};

  const ArrayIteratorPrototype = Object.getPrototypeOf([][Symbol.iterator]());
  const OriginalIteratorPrototype = Object.getPrototypeOf(ArrayIteratorPrototype);

  Object.setPrototypeOf(OriginalIteratorPrototype, IteratorPrototype);

  Object.defineProperties(IteratorPrototype, {
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
      value<T, V>(reducer: (value: T, acc: V) => V, initial_value?: V) {
        let acc = initial_value;

        const it = this[Symbol.iterator]();
        if (acc === undefined) {
          acc = it.next().value;
        }

        for (const value of it) {
          acc = reducer(value, acc!);
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

  Object.freeze(IteratorPrototype);

  /// Polyfill for AsyncIterator
  const AsyncIteratorPrototype = {};

  const AsyncGeneratorPrototype = Object.getPrototypeOf((async function* () {})()[Symbol.asyncIterator]());
  const BaseAsyncGeneratorPrototype = Object.getPrototypeOf(AsyncGeneratorPrototype);
  const OriginalAsyncIteratorPrototype = Object.getPrototypeOf(BaseAsyncGeneratorPrototype);

  Object.setPrototypeOf(OriginalAsyncIteratorPrototype, AsyncIteratorPrototype);

  Object.defineProperties(AsyncIteratorPrototype, {
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
      async value<T, V>(reducer: (value: T, acc: V) => V, initial_value?: V) {
        let acc = initial_value;

        const it = this[Symbol.asyncIterator]();
        if (acc === undefined) {
          acc = (await it.next()).value;
        }

        for await (const value of it) {
          acc = reducer(value, acc!);
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

  Object.freeze(AsyncIteratorPrototype);
})();
