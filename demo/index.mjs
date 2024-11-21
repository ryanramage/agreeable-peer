// @ts-check
import { loadAgreement, host, z }  from '@agree-able/rpc'
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
