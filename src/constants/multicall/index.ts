import { ChainId } from 'dexswap-sdk'
import MULTICALL_ABI from './abi.json'

// TODO: Add the missing networks here
// @ts-ignore
// const MULTICALL_NETWORKS: { [chainId in ChainId]: string } = {
//   [ChainId.MAINNET]: '',
//   [ChainId.RINKEBY]: '0x54CAa59be2b41139d88436b17e1b65a6A71b9029',
//   [ChainId.HARMONY]: '0xBd4B558b77301CEd3D4E4BDC45a876FFdDEDe744',
//   [ChainId.HARMONY_TESTNET]: '0x8ea37510a18233d6b081fb54c36f76c0d58a8734',
// }

const MULTICALL_NETWORKS: { [chainId in ChainId]: string } = {
  [ChainId.MAINNET]: '',
  [ChainId.HARMONY]: '0x4e24A3D6B6D47A4F56e4025C8A514b45C66e6d7A',
  [ChainId.RINKEBY]: '0x8c9E7447ABE0607a610a1C3E7cCC1A7B51f729C2',
  [ChainId.HARMONY_TESTNET]: '0x4122Ac56767382fA7b2BfbdCC62D6aeDF8D4cE32'
}

export { MULTICALL_ABI, MULTICALL_NETWORKS }
