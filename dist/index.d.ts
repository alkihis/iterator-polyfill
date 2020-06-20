interface Iterator<T, TReturn = any, TNext = undefined> {
    map<R>(callback: (value: T) => R): Iterator<R, TReturn, TNext>;
    filter(callback: (value: T) => boolean): Iterator<T, TReturn, TNext>;
    take(limit: number): Iterator<T, TReturn, TNext>;
    drop(limit: number): Iterator<T, TReturn, TNext>;
    asIndexedPairs(): Iterator<[number, T], TReturn, TNext>;
    flatMap<R>(mapper: (value: T) => Iterator<R> | R): Iterator<R, TReturn, TNext>;
    find(callback: (value: T) => boolean): T | undefined;
    every(callback: (value: T) => boolean): boolean;
    some(callback: (value: T) => boolean): boolean;
    join(separator: string): string;
    toArray(max_count?: number): T[];
    count(): number;
    reduce<V>(reducer: (value: T, acc: V) => V, initial_value?: V): V;
    forEach(callback: (value: T) => any): void;
}
interface AsyncIterator<T, TReturn = any, TNext = undefined> {
    map<R>(callback: (value: T) => R): AsyncIterator<R, TReturn, TNext>;
    filter(callback: (value: T) => boolean): AsyncIterator<T, TReturn, TNext>;
    take(limit: number): AsyncIterator<T, TReturn, TNext>;
    drop(limit: number): AsyncIterator<T, TReturn, TNext>;
    asIndexedPairs(): AsyncIterator<[number, T], TReturn, TNext>;
    flatMap<R>(mapper: (value: T) => AsyncIterator<R> | R): AsyncIterator<R, TReturn, TNext>;
    find(callback: (value: T) => boolean): Promise<T | undefined>;
    every(callback: (value: T) => boolean): Promise<boolean>;
    some(callback: (value: T) => boolean): Promise<boolean>;
    join(separator: string): Promise<string>;
    toArray(max_count?: number): Promise<T[]>;
    count(): Promise<number>;
    reduce<V>(reducer: (value: T, acc: V) => V, initial_value?: V): Promise<V>;
    forEach(callback: (value: T) => any): Promise<void>;
}
