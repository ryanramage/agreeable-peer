import b4a from 'b4a'
import DHT from 'hyperdht'
import Protomux from 'protomux'
import Channel from 'jsonrpc-mux'
import { enact, proxy } from 'agreeable'
export { enact, loadAgreement, z } from 'agreeable'

export async function host (agreement, implementation, opts) {
  if (!opts) opts = {}
  if (!opts.validator) opts.validator = async () => {}
  const dht = new DHT(opts.dhtOpts)
  const seedBuf = opts.seed ? b4a.from(opts.seed, 'hex') : null
  const keyPair = DHT.keyPair(seedBuf)
  const connect = c => enact(new Channel(new Protomux(c)), agreement, implementation, opts.validator)
  const server = dht.createServer(connect)

  await server.listen(keyPair)
  console.log('listening on:', b4a.toString(keyPair.publicKey, 'hex'))
  return { dht, keyPair, server }
}

export function seedFromArgv () {
  let seed = null
  if (global.Bare) seed = global.Bare.argv[2]
  else seed = process.argv[2]
  return seed
}

export function Caller (peerKey, setHeaders) {
  if (!setHeaders) setHeaders = () => {}
  this.setHeaders = setHeaders
  this.publicKey = b4a.from(peerKey, 'hex')
  this.node = new DHT()
  this.conn = this.node.connect(this.publicKey)
  this.framed = new Channel(new Protomux(this.conn))
}

Caller.prototype.proxy = function (agreement) {
  return proxy(this.framed, agreement, this.setHeaders)
}

Caller.prototype.destroy = function () {
  this.node.destroy()
}
