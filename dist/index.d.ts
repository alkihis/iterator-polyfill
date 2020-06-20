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
interface Iterator<T, TReturn = any, TNext = undefined> {
    /** Map each value of iterator to another value via {callback}. */
    map<R>(callback: (value: T) => R): Iterator<R, TReturn, TNext>;
    /** Each value is given through {callback}, return `true` if value is needed into returned iterator. */
    filter(callback: (value: T) => boolean): Iterator<T, TReturn, TNext>;
    /** Create a new iterator that consume {limit} items, then stops. */
    take(limit: number): Iterator<T, TReturn, TNext>;
    /** Create a new iterator that skip {limit} items from source iterator, then yield all values. */
    drop(limit: number): Iterator<T, TReturn, TNext>;
    /** Get a pair [index, value] for each remaining value of iterable. */
    asIndexedPairs(): Iterator<[number, T], TReturn, TNext>;
    /** Like map, but you can return a new iterator that will be flattened. */
    flatMap<R>(mapper: (value: T) => Iterator<R> | R): Iterator<R, TReturn, TNext>;
    /** Find a specific value that returns `true` in {callback}, and return it. Returns `undefined` otherwise. */
    find(callback: (value: T) => boolean): T | undefined;
    /** Return `true` if each value of iterator validate {callback}. */
    every(callback: (value: T) => boolean): boolean;
    /** Return `true` if one value of iterator validate {callback}. */
    some(callback: (value: T) => boolean): boolean;
    /** Join every item of iterator with {separator}, and return the built string. */
    join(separator: string): string;
    /** Consume iterator and collapse values inside an array. */
    toArray(max_count?: number): T[];
    /** Count number of values within iterable. It consumes it. */
    count(): number;
    /** Accumulate each item inside **acc** for each value **value**. */
    reduce<V>(reducer: (acc: V, value: T) => V, initial_value?: V): V;
    /** Iterate over each value of iterator by calling **callback** for each value. */
    forEach(callback: (value: T) => any): void;
}
interface AsyncIterator<T, TReturn = any, TNext = undefined> {
    /** Map each value of iterator to another value via {callback}. */
    map<R>(callback: (value: T) => R): AsyncIterator<R, TReturn, TNext>;
    /** Each value is given through {callback}, return `true` if value is needed into returned iterator. */
    filter(callback: (value: T) => boolean): AsyncIterator<T, TReturn, TNext>;
    /** Create a new iterator that consume {limit} items, then stops. */
    take(limit: number): AsyncIterator<T, TReturn, TNext>;
    /** Create a new iterator that skip {limit} items from source iterator, then yield all values. */
    drop(limit: number): AsyncIterator<T, TReturn, TNext>;
    /** Get a pair [index, value] for each remaining value of iterable. */
    asIndexedPairs(): AsyncIterator<[number, T], TReturn, TNext>;
    /** Like map, but you can return a new iterator that will be flattened. */
    flatMap<R>(mapper: (value: T) => AsyncIterator<R> | R): AsyncIterator<R, TReturn, TNext>;
    /** Find a specific value that returns `true` in {callback}, and return it. Returns `undefined` otherwise. */
    find(callback: (value: T) => boolean): Promise<T | undefined>;
    /** Return `true` if each value of iterator validate {callback}. */
    every(callback: (value: T) => boolean): Promise<boolean>;
    /** Return `true` if one value of iterator validate {callback}. */
    some(callback: (value: T) => boolean): Promise<boolean>;
    /** Join every item of iterator with {separator}, and return the built string. */
    join(separator: string): Promise<string>;
    /** Consume iterator and collapse values inside an array. */
    toArray(max_count?: number): Promise<T[]>;
    /** Count number of values within iterable. It consumes it. */
    count(): Promise<number>;
    /** Accumulate each item inside **acc** for each value **value**. */
    reduce<V>(reducer: (acc: V, value: T) => V, initial_value?: V): Promise<V>;
    /** Iterate over each value of iterator by calling **callback** for each value. */
    forEach(callback: (value: T) => any): Promise<void>;
}
