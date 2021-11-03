export type Observer<T> = (payload: T) => void;

export type Publisher<T, K extends keyof T> = (
  channel: K,
  ...args: T[K] extends undefined ? [] : [T[K]]
) => void;

export type Subscriber<T, K extends keyof T> = (
  channel: K,
  observer: Observer<T[K]>,
) => () => void;

export type PublerTuple<T, K extends keyof T> = [
  Publisher<T, K>,
  Subscriber<T, K>,
];

export const publer = <T>(): PublerTuple<T, keyof T> => {
  const eventMap = new Map<keyof T, Set<Observer<any>>>();
  return [
    (channel, ...[payload]) =>
      eventMap.get(channel)?.forEach((observer) => observer(payload)),
    (channel, observer) =>
      (eventMap.get(channel)?.add(observer) ||
        eventMap.set(channel, new Set([observer]))) &&
      (() => eventMap.get(channel)?.delete(observer)),
  ];
};
