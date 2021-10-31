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

```typescript
import { publer } from "publer";

interface LoginPayload {
  token: string;
  remember?: boolean;
}

interface Events {
  login: LoginPayload;
  logout: void; // no payload
}

const pubsub = publer<Events>();

// returns a cleanup function to remove listener
const unsubscribe = pubsub.subscribe("login", ({ token, remember }) => {
  // payload is inferred
});

// fails without payload, must be provided
pubsub.publish("login", { token: "foobar" });

// fails with payload
pubsub.publish("logout");

// clear all listeners for `login`
pubsub.unsubscribe("login");

// clear all
pubsub.unsubscribe();
```
