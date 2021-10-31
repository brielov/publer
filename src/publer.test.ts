import { Publer, publer } from "./publer";

type EventMap = {
  foo: string;
  bar: number;
};

let pubsub: Publer<EventMap>;

beforeEach(() => (pubsub = publer()));

it("handles one observer", () => {
  const fn = jest.fn();

  pubsub.subscribe("foo", fn);
  pubsub.publish("foo", "bar");

  expect(fn).toHaveBeenCalledTimes(1);
  expect(fn).toHaveBeenCalledWith("bar");
});

it("handles multiple observers", () => {
  const f1 = jest.fn();
  const f2 = jest.fn();

  pubsub.subscribe("foo", f1);
  pubsub.subscribe("foo", f2);

  pubsub.publish("foo", "bar");
  pubsub.publish("foo", "bar");

  expect(f1).toHaveBeenCalledTimes(2);
  expect(f2).toHaveBeenCalledTimes(2);
});

it("unsubscribes observer", () => {
  const fn = jest.fn();
  const unsubscribe = pubsub.subscribe("foo", fn);

  pubsub.publish("foo", "bar");
  pubsub.publish("foo", "bar");
  pubsub.publish("foo", "bar");

  unsubscribe();
  pubsub.publish("foo", "bar");

  expect(fn).toHaveBeenCalledTimes(3);
});

it("subscribes observer only once", () => {
  const fn = jest.fn();

  pubsub.subscribe("foo", fn);
  pubsub.subscribe("foo", fn);
  pubsub.subscribe("foo", fn);

  pubsub.publish("foo", "bar");

  expect(fn).toHaveBeenCalledTimes(1);
});

it("unsubscribes whole channel", () => {
  const f1 = jest.fn();
  const f2 = jest.fn();

  pubsub.subscribe("foo", f1);
  pubsub.subscribe("foo", f2);
  pubsub.unsubscribe("foo");
  pubsub.publish("foo", "bar");

  expect(f1).toHaveBeenCalledTimes(0);
  expect(f2).toHaveBeenCalledTimes(0);
});

it("unsubscribes everything", () => {
  const f1 = jest.fn();
  const f2 = jest.fn();

  pubsub.subscribe("foo", f1);
  pubsub.subscribe("bar", f2);
  pubsub.unsubscribe();

  pubsub.publish("foo", "bar");
  pubsub.publish("bar", 1);

  expect(f1).toHaveBeenCalledTimes(0);
  expect(f2).toHaveBeenCalledTimes(0);
});
