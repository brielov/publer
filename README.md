![GitHub Workflow Status](https://img.shields.io/github/workflow/status/brielov/publer/build-test)
![Codecov](https://img.shields.io/codecov/c/gh/brielov/publer)
![GitHub issues](https://img.shields.io/github/issues/brielov/publer)
![GitHub](https://img.shields.io/github/license/brielov/publer)
![npm](https://img.shields.io/npm/v/publer)
![npm bundle size](https://img.shields.io/bundlephobia/minzip/publer)

# Publer

`publer` is a tiny, type-safe pubsub library written in `typescript`.

## Installation

```
npm install publer
```

## Usage

```ts
import { publer } from "publer";

type Peer = {
  id: number;
  username: string
}

interface Events {
  login: [email: string; password: string];
  logout: []; // no arguments
  peerConnected: [peer: Peer]
  peerDisconnected: [peer: Peer]
}

const [pub, sub] = publer<Events>();

// returns a cleanup function to remove listener
const unsub = sub("login", (email, password) => {
  // payload is inferred
});

// fails without arguments, must be provided
pub("login", 'john@doe.com', 'johndoe123');

// fails with arguments
pub("logout");
```

## React.js

You can create a simple hook to automatically unsubscribe whenever a component re-renders like so:

```ts
import { Subscribe, EventMap } from 'publer';
import { Events } from from './my-pubsub';

function useSubscribe<T extends EventMap, K extends keyof T>(sub: Subscribe<T>, eventName: K, listener: (...args: T[K]) => void) {
  useEffect(() => sub(eventName, listener), [eventName, listener]);
}
```

And then in your React component you can consume the hook like this:

```tsx
import { useSubscribe } from "./my-hook";
import { sub } from "./my-pubsub";

function MyComponent() {
  useSubscribe(sub, "login", (email, password) => {
    // email and password are correctly typed.
  });

  // From whatever other part of the application you can just call `pub`
  pub("login", "john@doe.com", "johndoe123");

  return <div>Rest of your component here</div>;
}
```
