export type EventMap = { [key: string]: any[] };

export type Publish<T extends EventMap> = <K extends keyof T>(
  eventName: K,
  ...args: T[K]
) => void;

export type Subscribe<T extends EventMap> = <K extends keyof T>(
  eventName: K,
  listener: (...args: T[K]) => void,
) => () => void;

export type PubSub<T extends EventMap> = [pub: Publish<T>, sub: Subscribe<T>];

export const publer = <T extends EventMap>(): PubSub<T> => {
  const eventMap = new Map<keyof T, Set<(...args: any) => void>>();
  return [
    <K extends keyof T>(eventName: K, ...args: T[K]) =>
      eventMap.get(eventName)?.forEach((fn) => fn(...args)),
    <K extends keyof T>(eventName: K, listener: (...args: T[K]) => void) =>
      (eventMap.get(eventName)?.add(listener) ||
        eventMap.set(eventName, new Set([listener]))) &&
      (() => void eventMap.get(eventName)?.delete(listener)),
  ];
};
