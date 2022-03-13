export type Observer<T> = (payload: T) => void;

export type Publish<T> = <K extends keyof T>(
  channel: K,
  ...args: T[K] extends undefined ? [] : [T[K]]
) => void;

export type Subscribe<T> = <K extends keyof T>(
  channel: K,
  observer: Observer<T[K]>,
) => () => void;

export type Publer<T> = [Publish<T>, Subscribe<T>];

export const publer = <T extends { [key: string]: any }>(): Publer<T> => {
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
