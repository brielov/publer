export type Observer<T> = (payload: T) => void;

export const publer = <T extends { [key: string]: any }>(): [
  <K extends keyof T>(
    channel: K,
    ...args: T[K] extends undefined ? [] : [T[K]]
  ) => void,
  <K extends keyof T>(channel: K, observer: Observer<T[K]>) => () => void,
] => {
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
