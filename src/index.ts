export const publer = <T extends { [key: string]: any[] }>() => {
  const eventMap = new Map<keyof T, Set<(...args: any) => void>>();
  return [
    <K extends keyof T>(eventName: K, ...args: T[K]) =>
      eventMap.get(eventName)?.forEach((observer) => observer(...args)),
    <K extends keyof T>(eventName: K, observer: (...args: T[K]) => void) =>
      (eventMap.get(eventName)?.add(observer) ||
        eventMap.set(eventName, new Set([observer]))) &&
      (() => void eventMap.get(eventName)?.delete(observer)),
  ] as const;
};
