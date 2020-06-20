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
    /** Consume iterator and collapse values inside an array. */
    toArray(max_count?: number): T[];
    /** Accumulate each item inside **acc** for each value **value**. */
    reduce<V>(reducer: (acc: V, value: T) => V, initial_value?: V): V;
    /** Iterate over each value of iterator by calling **callback** for each value. */
    forEach(callback: (value: T) => any): void;
    /** Join every item of iterator with {separator}, and return the built string. */
    join(separator: string): string;
    /** Count number of values within iterable. It consumes it. */
    count(): number;
    /** Chain iterables together, in provided order. */
    chain<I>(...iterables: IterableIterator<I>[]): Iterator<T | I, TReturn, TNext>;
    /** Iterate through multiple iterators together */
    zip<O>(...others: IterableIterator<O>[]): Iterator<(T | O)[], TReturn, TNext>;
    /**
     * It will call this closure on each element of the iterator, and ignore elements until it returns false.
     * After false is returned, dropWhile()'s job is over, and the rest of the elements are yielded.
     */
    dropWhile(callback: (value: T) => boolean): Iterator<T, TReturn, TNext>;
    /**
     * It will call this closure on each element of the iterator, and yield elements until it returns false.
     * After false is returned, takeWhile()'s job is over, and the rest of the elements are ignored.
     */
    takeWhile(callback: (value: T) => boolean): Iterator<T, TReturn, TNext>;
    /**
     * Yield items until one item is `null` or `undefined`.
     *
     * Shortcut for `.takeWhile(e => e !== undefined && e !== null)`.
     */
    fuse(): Iterator<T, TReturn, TNext>;
    /**
     * Consume iterator to create two partitions : first is filled when `callback(item)` is `true`,
     * second when `callback(item)` is `false`.
     */
    partition(callback: (value: T) => boolean): [T[], T[]];
    /** Find index in iterator for the first item where {callback} returns `true` (consume iterator). */
    findIndex(callback: (value: T) => boolean): number;
    /** Return the max element in iterator (consume it). */
    max(): T;
    /** Return the max element in iterator (consume it). */
    min(): T;
    /** Instead of stopping when iterator is consumed, the iterator will instead start again, from the beginning. Forever. */
    cycle(): Iterator<T, TReturn, TNext>;
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
    /** Consume iterator and collapse values inside an array. */
    toArray(max_count?: number): Promise<T[]>;
    /** Accumulate each item inside **acc** for each value **value**. */
    reduce<V>(reducer: (acc: V, value: T) => V, initial_value?: V): Promise<V>;
    /** Iterate over each value of iterator by calling **callback** for each value. */
    forEach(callback: (value: T) => any): Promise<void>;
    /** Join every item of iterator with {separator}, and return the built string. */
    join(separator: string): Promise<string>;
    /** Count number of values within iterable. It consumes it. */
    count(): Promise<number>;
    /** Chain iterables together, in provided order. */
    chain<I>(...iterables: AsyncIterableIterator<I>[]): AsyncIterator<T | I, TReturn, TNext>;
    /** Iterate through multiple iterators together */
    zip<O>(...others: AsyncIterableIterator<O>[]): AsyncIterator<(T | O)[], TReturn, TNext>;
    /**
     * It will call this closure on each element of the iterator, and ignore elements until it returns false.
     * After false is returned, dropWhile()'s job is over, and the rest of the elements are yielded.
     */
    dropWhile(callback: (value: T) => boolean): AsyncIterator<T, TReturn, TNext>;
    /**
     * It will call this closure on each element of the iterator, and yield elements until it returns false.
     * After false is returned, takeWhile()'s job is over, and the rest of the elements are ignored.
     */
    takeWhile(callback: (value: T) => boolean): AsyncIterator<T, TReturn, TNext>;
    /**
     * Yield items until one item is `null` or `undefined`.
     *
     * Shortcut for `.takeWhile(e => e !== undefined && e !== null)`.
     */
    fuse(): AsyncIterator<T, TReturn, TNext>;
    /**
     * Consume iterator to create two partitions : first is filled when `callback(item)` is `true`,
     * second when `callback(item)` is `false`.
     */
    partition(callback: (value: T) => boolean): Promise<[T[], T[]]>;
    /** Find index in iterator for the first item where {callback} returns `true` (consume iterator). */
    findIndex(callback: (value: T) => boolean): Promise<number>;
    /** Return the max element in iterator (consume it). */
    max(): Promise<T>;
    /** Return the max element in iterator (consume it). */
    min(): Promise<T>;
    /** Instead of stopping when iterator is consumed, the iterator will instead start again, from the beginning. Forever. */
    cycle(): AsyncIterator<T, TReturn, TNext>;
}
