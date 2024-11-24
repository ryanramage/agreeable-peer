# Getting Started with Agreeable RPC

## Installation

```bash
npm install @agree-able/contract @agreeable/rpc
```

## Basic Usage

### 1. Define an Agreement

The agreement is your API contract. It defines the shape and types of your RPC interface:

```js
import { z, addRoute } from '@agree-able/contract'

export const MyFunction = z.function()
  .args(z.object({
    input: z.string()
  }))
  .returns(z.promise(z.string()))

export default {
  role: 'myService',
  version: '1.0.0',
  routes: {
    myFunction: addRoute(MyFunction)
  }
}
```

### 2. Implement the Server

```js
import { loadAgreement, host } from '@agree-able/rpc'

const implementation = {
  myFunction: async ({input}) => `Processed: ${input}`
}

host(await loadAgreement('./agreement.mjs'), implementation)
```

### 3. Create a Client

```js
import { Caller } from '@agree-able/rpc'
import agreement from './agreement.mjs'

const caller = new Caller(peerKey)
const api = caller.proxy(agreement)

const result = await api.myFunction({ input: 'test' })
console.log(result) // "Processed: test"
```

## Next Steps

- Read about [Core Concepts](./core-concepts.md)
- Check the [API Reference](./api-reference.md)
- Explore [Advanced Usage](./advanced-usage.md)
