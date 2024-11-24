# Advanced Usage

## Custom Validation

Add custom validation logic to your server:

```js
await host(agreement, implementation, {
  validator: async (method, args) => {
    // Throw error to reject call
    if (!isAuthorized(method)) {
      throw new Error('Unauthorized')
    }
  }
})
```

## Custom Headers

Add metadata to calls from the client:

```js
const caller = new Caller(peerKey, () => ({
  authorization: 'Bearer token',
  timestamp: Date.now()
}))
```

## Multiple Services

Host multiple services on one server:

```js
// service1.mjs
export default {
  role: 'service1',
  routes: {...}
}

// service2.mjs
export default {
  role: 'service2', 
  routes: {...}
}

// server.mjs
await host(service1, implementation1)
await host(service2, implementation2)
```

## Error Handling

```js
try {
  await api.myFunction(args)
} catch (err) {
  if (err.code === 'VALIDATION_ERROR') {
    // Handle validation failure
  }
  if (err.code === 'NETWORK_ERROR') {
    // Handle connection issues
  }
}
```

## Custom DHT Configuration

```js
import DHT from 'hyperdht'

const dht = new DHT({
  bootstrap: ['node1.example.com:49737']
})

await host(agreement, implementation, { dht })
```
