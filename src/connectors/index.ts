import { InjectedConnector } from '@web3-react/injected-connector'
import { AuthereumConnector } from '@web3-react/authereum-connector'
import { WalletConnectConnector } from '@web3-react/walletconnect-connector'
import { CustomNetworkConnector } from './CustomNetworkConnector'
import { ChainId } from 'dexswap-sdk'
import { providers } from 'ethers'
import getLibrary from '../utils/getLibrary'

export const INFURA_PROJECT_ID = 'da9c85c80bd0432dad730f1d5fbfd70b'
// TODO:
export const network = new CustomNetworkConnector({
  urls: {
    [ChainId.MAINNET]: `https://mainnet.infura.io/v3/${INFURA_PROJECT_ID}`,
    [ChainId.RINKEBY]: `https://rinkeby.infura.io/v3/${INFURA_PROJECT_ID}`,
    [ChainId.HARMONY]: 'https://api.s0.t.hmny.io',
    [ChainId.HARMONY_TESTNET]: 'https://api.s0.b.hmny.io'
  },
  defaultChainId: ChainId.MAINNET
})

export const injected = new InjectedConnector({
  supportedChainIds: [ChainId.MAINNET, ChainId.RINKEBY, ChainId.HARMONY, ChainId.HARMONY_TESTNET]
})

// mainnet only
export const walletConnect = new WalletConnectConnector({
  rpc: {
    1: `https://mainnet.infura.io/v3/${INFURA_PROJECT_ID}`
  },
  bridge: 'https://bridge.walletconnect.org',
  qrcode: true,
  pollingInterval: 15000
})

export const walletConnectHARMONY = new WalletConnectConnector({
  rpc: {
    1666600000: 'https://api.s0.t.hmny.io'
  },
  bridge: 'https://bridge.harmony.one/',
  qrcode: true,
  pollingInterval: 15000
})

// mainnet only
export const authereum = new AuthereumConnector({ chainId: 1 })

let networkLibrary: providers.Web3Provider | undefined
export function getNetworkLibrary(): providers.Web3Provider {
  return (networkLibrary = networkLibrary ?? getLibrary(network.provider))
}
