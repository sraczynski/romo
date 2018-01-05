import { Connect, SimpleSigner } from 'uport-connect'

export let uport = new Connect('RoMo', {
   clientId: '2oxHdSqkCp8rcaP6wwfgVDoC1gygjJutmz5',
   network: 'rinkeby',
   signer: SimpleSigner('c6e257f4c961783a873ad9b8194a74fd84bec9a421a7289a8db9e4d87be35375')
})

export const web3 = uport.getWeb3()
