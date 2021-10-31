type Observer<T> = (payload: T) => void;

export interface Publer<T> {
  subscribe<K extends keyof T>(
    channel: K,
    observer: Observer<T[K]>,
  ): () => void;
  unsubscribe<K extends keyof T>(channel?: K): void;
  publish<K extends keyof T>(
    channel: K,
    ...a: T[K] extends undefined ? [] : [T[K]]
  ): void;
}

export const publer = <T>(): Publer<T> => {
  const eventMap = new Map<keyof T, Set<Observer<any>>>();

  return {
    subscribe: (channel, observer) =>
      (eventMap.get(channel)?.add(observer) ||
        eventMap.set(channel, new Set([observer]))) &&
      (() => eventMap.get(channel)?.delete(observer)),
    unsubscribe: (channel) =>
      channel ? eventMap.get(channel)?.clear() : eventMap.clear(),
    publish: (channel, ...[payload]) =>
      eventMap.get(channel)?.forEach((observer) => observer(payload)),
  } as const;
};
