import { Publisher, Subscriber, publer } from "./publer";

type EventMap = {
  foo: string;
  bar: number;
};

let pub: Publisher<EventMap, keyof EventMap>;
let sub: Subscriber<EventMap, keyof EventMap>;

beforeEach(() => {
  [pub, sub] = publer<EventMap>();
});

it("handles one observer", () => {
  const fn = jest.fn();

  sub("foo", fn);
  pub("foo", "bar");

  expect(fn).toHaveBeenCalledTimes(1);
  expect(fn).toHaveBeenCalledWith("bar");
});

it("handles multiple observers", () => {
  const f1 = jest.fn();
  const f2 = jest.fn();

  sub("foo", f1);
  sub("foo", f2);

  pub("foo", "bar");
  pub("foo", "bar");

  expect(f1).toHaveBeenCalledTimes(2);
  expect(f2).toHaveBeenCalledTimes(2);
});

it("unsubscribes observer", () => {
  const fn = jest.fn();
  const unsubscribe = sub("foo", fn);

  pub("foo", "bar");
  pub("foo", "bar");
  pub("foo", "bar");

  unsubscribe();
  pub("foo", "bar");

  expect(fn).toHaveBeenCalledTimes(3);
});

it("subscribes observer only once", () => {
  const fn = jest.fn();

  sub("foo", fn);
  sub("foo", fn);
  sub("foo", fn);

  pub("foo", "bar");

  expect(fn).toHaveBeenCalledTimes(1);
});
