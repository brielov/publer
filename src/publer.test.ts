import { beforeEach, expect, it, vi } from "vitest";
import { publer } from ".";

type EventMap = {
  foo: [bar: string];
  baz: [];
};

let [pub, sub] = publer<EventMap>();

beforeEach(() => {
  [pub, sub] = publer<EventMap>();
});

it("handles one observer", () => {
  const fn = vi.fn();

  sub("foo", fn);
  pub("foo", "bar");

  expect(fn).toHaveBeenCalledOnce();
  expect(fn).toHaveBeenCalledWith("bar");
});

it("handles multiple observers", () => {
  const f1 = vi.fn();
  const f2 = vi.fn();

  sub("foo", f1);
  sub("foo", f2);

  pub("foo", "bar");
  pub("foo", "bar");

  expect(f1).toHaveBeenCalledTimes(2);
  expect(f2).toHaveBeenCalledTimes(2);
});

it("unsubscribes observer", () => {
  const fn = vi.fn();
  const unsubscribe = sub("foo", fn);

  pub("foo", "bar");
  pub("foo", "bar");
  pub("foo", "bar");

  unsubscribe();
  pub("foo", "bar");

  expect(fn).toHaveBeenCalledTimes(3);
});

it("subscribes observer only once", () => {
  const fn = vi.fn();

  sub("foo", fn);
  sub("foo", fn);
  sub("foo", fn);

  pub("foo", "bar");

  expect(fn).toHaveBeenCalledTimes(1);
});
