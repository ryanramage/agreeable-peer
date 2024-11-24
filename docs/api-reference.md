# API Reference

## @agree-able/contract

### `addRoute(schema)`
Creates a new route definition from a Zod schema.

```js
const MyRoute = addRoute(
  z.function()
    .args(z.object({...}))
    .returns(z.promise(...))
)
```

## @agreeable/rpc

### `host(agreement, implementation, options?)`
Starts a server implementing an agreement.

```js
await host(agreement, {
  myFunction: async (args) => {...}
}, {
  validator: async () => {}, // Optional custom validation
  dht: customDHT,           // Optional DHT instance
  seed: 'hex-string'        // Optional keypair seed
})
```

### `class Caller`
Client for connecting to remote peers.

#### Constructor
```js
new Caller(peerKey, setHeaders?)
```

#### Methods
- `proxy(agreement)`: Creates proxy object for remote calls
- `destroy()`: Closes connection and cleanup

### `loadAgreement(path, importMetaUrl)`
Loads an agreement module.

```js
const agreement = await loadAgreement(
  './agreement.mjs',
  import.meta.url
)
```
