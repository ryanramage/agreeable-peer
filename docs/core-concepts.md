# Core Concepts

## Agreements

An agreement is a contract between peers that defines:
- The service role
- Available functions
- Input/output types
- Version information

### Structure
```js
{
  role: string,      // Service identifier
  version: string,   // Semantic version
  routes: {          // Available functions
    [name: string]: Route
  }
}
```

## Type Safety

Agreeable RPC uses [Zod](https://github.com/colinhacks/zod) for runtime type validation:
- Define types using Zod schemas
- Automatic validation of inputs/outputs
- TypeScript integration

## Peer-to-Peer Communication

- Built on [Hyperswarm](https://github.com/hyperswarm/hyperswarm)
- DHT-based peer discovery
- NAT traversal included
- End-to-end encryption

## Error Handling

Errors are propagated from server to client with:
- Original error message
- Stack trace (in development)
- Error code preservation
