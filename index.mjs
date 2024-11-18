import hie from 'hypercore-id-encoding'
import DHT from 'hyperdht'
import Protomux from 'protomux'
import Channel from 'jsonrpc-mux'
import { enact, proxy } from 'agreeable'
export { enact, loadAgreement, z } from 'agreeable'

export async function host (agreement, implementation, opts) {
  if (!opts) opts = {}
  if (!opts.validator) opts.validator = async () => {}
  const dht = opts.dht? opts.dht : new DHT(opts.dhtOpts)
  const seedBuf = opts.seed ? hie.decode(opts.seed) : null
  const keyPair = DHT.keyPair(seedBuf)
  let channel = null
  const connect = c => {
    channel = new Channel(new Protomux(c))
    enact(channel, agreement, implementation, opts.validator)
  }
  const server = dht.createServer(connect)
  await server.listen(keyPair)
  return { dht, keyPair, server, channel }
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
  this.publicKey = hie.decode(peerKey)
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
