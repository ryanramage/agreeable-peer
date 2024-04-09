Agreeable Peer
==============

Easy RPC using an agreement between [agreeable](https://github.com/ryanramage/agreeable) peers. A [🍐](https://docs.pears.com) project.

This project is a helper to create and consume remote services over a p2p network. It is built over strong foundations of HyperDHT, protomux and jsonrpc-mux, but makes
using them very easy, and should help web developers convert over to p2p.

Here are a few other reasons to use it:

 - Validates input and output data for both peers at runtime (runtime type safety)
 - Compile type checking to help coding (using JSDoc and ts compatable)
 - reduces boilerplate p2p code
 - allows for growing an ecosystem of trusting p2p rpc peers
 - dynamic UI for testing and form submission via [agreeable-ui](https://github.com/ryanramage/agreeable-ui)

The following example can be run in the [demo folder](https://github.com/ryanramage/agreeable-peer/tree/master/demo) of this project

Host an agreeable RPC
=====================

in your working directory, please use npm to install the following two dependencies

```
npm i agreeable agreeable-peer
```

Create an agreement
-------------------

Here is a simple example of an agreeable compatable agreement. [Zod](https://zod.dev/) functions have been carefully chosen to provide the 
best programmatic descriptive power with strong jsdoc infer compatablility. 

agreement.mjs
```
import { z, addRoute } from 'agreeable'

// define the shape of the functions available
export const AddTwo = z.function().args(z.object({
  a: z.number().describe('the first number'),
  b: z.number().describe('the second number')
})).returns(z.promise(z.number().describe('the sum of a and b')))

export const Ping = z.function().args().returns(z.promise())

export const GenerateNickname = z.function().args(z.object({
  first: z.string().describe('the first name'),
  last: z.string().describe('the last name')
})).returns(z.promise(z.string()))

// describe the api, using the functions as routes
const api = { 
  role: 'exampleRpc', 
  version: '1.0.0',
  description: 'a simple example api',
  routes: {
    addTwo: addRoute(AddTwo),
    ping: addRoute(Ping),
    generateNickname: addRoute(GenerateNickname)
  }
}
export default api 

```

Enact the agreement
-------------------

Here we provide in implementation of the agreement. Notice the type checking we get from jsdocs that will provide compile time
information using zod infer and jsdoc types. At runtime any params coming into the implementation will also be rejected back to the client
if they dont match the agreement.

index.mjs
```
// @ts-check
import { loadAgreement, host, z }  from 'agreeable-peer'
import { AddTwo, Ping, GenerateNickname } from './agreement.mjs'

/** @type { z.infer<AddTwo> } addTwo */
const addTwo = async ({a, b}) => a + b
   
/** @type { z.infer<Ping> } ping */
const ping = async () => console.log('pinged!')

/** @type { z.infer<GenerateNickname> } generateNickname */
const generateNickname = async ({first}) => `silly ${first}`

host(await loadAgreement('./agreement.mjs', import.meta.url), { 
  addTwo, ping, generateNickname 
})

```

Run the peer 
------------

With the agreement in place, you can now run the peer. Simply run it in node (or bare/pear) and get the public key.

```
node index.mjs
listening on: 3e32bb2d191316d952ae77439f7ec00a5c4fea8a01953b84d1b4eee36173e1ca
```

Call an agreeable RPC
=====================

Now lets see what the client needs to do to call an rpc on an agreeable peer.

get the agreement
-----------------

The peer does have to give you the public key. In the future we will provide a registry lookup up services. But for now its up to you to obtain.
You must also get the agreement.mjs file. They can send it to you on another channel, or you can use the agreeable-ui to fetch it

Agreeable-UI

```
pear run pear://qrxbzxyqup1egwjnrmp7fcikk31nekecn43xerq65iq3gjxiaury
```
or visit the github [agreeable-ui](https://github.com/ryanramage/agreeable-ui) and pear dev it


and then paste the public key of the service into the UI. Once it connects, you can download the agreement.mjs file that way from your peer


code the caller
---------------

This small example, the client uses the type checking of the agreement. Again this is balanced to use the zod infer into jsdocs, and agreeable check the types
going to and from the host.


client.mjs
```
// @ts-check
import { z, Caller } from 'agreeable-peer'
import agreement, { AddTwo, Ping, GenerateNickname } from './agreement.mjs';

const peerKey = process.argv[2]
const caller = new Caller(peerKey)
/** @type{{ 
 *   addTwo: z.infer<AddTwo> 
 *   ping: z.infer<Ping>
 *   generateNickname: z.infer<GenerateNickname>
 * }} */
// @ts-expect-error
const { addTwo, ping, generateNickname } = caller.proxy(agreement)

const results = await addTwo({ a: 1, b: 2 })
console.log(results)
await ping()
const nickname = await generateNickname({ first: 'steve', last: 'smith' })
console.log(nickname)
caller.destroy()

```

Note: The @ts-expect-error annotation is to remove one small compile time error with the destructring the proxy assignment. 
It is shown here for completeness as a way to have no warnings in your editor. 

run the caller
--------------

Now we run the client, passing in the host public key to connect to. 

```
node client.mjs 3e32bb2d191316d952ae77439f7ec00a5c4fea8a01953b84d1b4eee36173e1ca
3
silly steve
```


