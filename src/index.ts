type EventBus = { [key: string]: any[] };

export type PubSub<T extends EventBus> = [
  pub: <K extends keyof T>(eventName: K, ...args: T[K]) => void,
  sub: <K extends keyof T>(
    eventName: K,
    listener: (...args: T[K]) => void,
  ) => void,
];

export const publer = <T extends EventBus>(): PubSub<T> => {
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
