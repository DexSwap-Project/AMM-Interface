import React, { ReactNode } from 'react'
import { AbstractConnector } from '@web3-react/abstract-connector'
import {
  ChainId,
  JSBI,
  Percent,
  CurrencyAmount,
  WETH,
  WONE,
  xDEXS,
  Token,
  Currency,
  RoutablePlatform
} from 'dexswap-sdk'
import { authereum, injected, walletConnect, walletConnectHARMONY } from '../connectors'
import UniswapLogo from '../assets/svg/uniswap-logo.svg'
import DexGradientLogo from '../assets/images/grad-grey.png'
import SushiswapLogo from '../assets/svg/sushiswap-logo.svg'


import ViperswapLogo from '../assets/images/venomswap.png'

import SwoppswapLogo from '../assets/svg/swoop.svg'

export const ZERO_ADDRESS = '0x0000000000000000000000000000000000000000'

// a list of tokens by chain
type ChainTokenList = {
  readonly [chainId in ChainId]: Token[]
}


export const DAI: { [key: number]: Token } = {
  [ChainId.MAINNET]: new Token(ChainId.MAINNET, '0x6B175474E89094C44Da98b954EedeAC495271d0F',18, 'DAI', 'Dai Stablecoin'),
  [ChainId.RINKEBY]: new Token(
    ChainId.RINKEBY,
    '0x146942dE725f2d28857e3B22356433c54FBf9daD',
    18,
    'DAI', 'Dai Stablecoin'
  ),
  [ChainId.HARMONY]: new Token(
    ChainId.HARMONY,
    '0xEf977d2f931C1978Db5F6747666fa1eACB0d0339',
    18,
    '1DAI', 'Dai Stablecoin'
  ),
  [ChainId.HARMONY_TESTNET]: new Token(
    ChainId.HARMONY_TESTNET,
    '0xC27255D7805Fc79e4616d5CD50D6f4464AEa75A3',
    18,
    '1DAI', 'OneDAI'
  )
}

export const USDC: { [key: number]: Token } = {
  [ChainId.MAINNET]: new Token(ChainId.MAINNET, '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48', 6, 'USDC', 'USD//C'),
  [ChainId.RINKEBY]: new Token(
    ChainId.RINKEBY,
    '0x03C8551611D4C718A1C3599A933d7E7c2e8038DC',
    18,
    'USDC',
    'USD//C'
  ),
  [ChainId.HARMONY]: new Token(
    ChainId.HARMONY,
    '0x985458E523dB3d53125813eD68c274899e9DfAb4',
    6,
    '1USDC',
    'USD Coin'
  ),
  [ChainId.HARMONY_TESTNET]: new Token(
    ChainId.HARMONY_TESTNET,
    '0x33B465B61EBb322E6336437b2624F705a34a0Df0',
    18,
    '1USDC',
    'OneUSDC'
  )
}

export const USDT: { [key: number]: Token } = {
  [ChainId.MAINNET]: new Token(ChainId.MAINNET, '0xdAC17F958D2ee523a2206206994597C13D831ec7', 6, 'USDT', 'Tether USD'),
  [ChainId.RINKEBY]: new Token(
    ChainId.RINKEBY,
    '0x1dbdFBF4787b14c2D0936E1B48546641E33A8418',
    18, 'USDT', 'Tether USD'
  ),
  [ChainId.HARMONY]: new Token(
    ChainId.HARMONY,
    '0x3C2B8Be99c50593081EAA2A724F0B8285F5aba8f',
    6, '1USDT', 'Tether USD'
  ),
  [ChainId.HARMONY_TESTNET]: new Token(
    ChainId.HARMONY_TESTNET,
    '0x12f839b098d1446ba9b25c4F6f7Ef49cc1846dEd',
    18, '1USDT', 'OneUSDT'
  )
}

export const WBTC: { [key: number]: Token } = {
  [ChainId.MAINNET]: new Token(
    ChainId.MAINNET,
    '0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599',
    18,
    'WBTC',
    'Wrapped BTC'
  ),
  [ChainId.RINKEBY]: new Token(
    ChainId.RINKEBY,
    '0x15f3Adb465bBc6e880093EC70C8559Fd054aD439',
    18,
    'WBTC',
    'Wrapped BTC'
  ),
  [ChainId.HARMONY]: new Token(
    ChainId.HARMONY,
    '0x3095c7557bCb296ccc6e363DE01b760bA031F2d9',
    8,
    '1WBTC',
    'Wrapped BTC'
  ),
  [ChainId.HARMONY_TESTNET]: new Token(
    ChainId.HARMONY_TESTNET,
    '0x6c4387C4f570Aa8cAdcaFFc5E73ecb3D0F8Fc593',
    8, 'WBTC', 'Wrapped BTC'
  )
}



// used to construct intermediary pairs for trading
export const BASES_TO_CHECK_TRADES_AGAINST: ChainTokenList = {
  [ChainId.MAINNET]: [
    WETH[ChainId.MAINNET],
    USDC[ChainId.MAINNET],
    WBTC[ChainId.MAINNET],
    USDT[ChainId.MAINNET]
  ],
  [ChainId.RINKEBY]: [
    WETH[ChainId.RINKEBY], 
    USDC[ChainId.RINKEBY],
    USDT[ChainId.RINKEBY],
    xDEXS[ChainId.RINKEBY],
    WBTC[ChainId.RINKEBY]
  ],
  [ChainId.HARMONY]: [
    WETH[ChainId.HARMONY], 
    WONE[ChainId.HARMONY], 
    USDC[ChainId.HARMONY],
    USDT[ChainId.HARMONY],
    xDEXS[ChainId.HARMONY],
    WBTC[ChainId.HARMONY]
  ],
  [ChainId.HARMONY_TESTNET]: [
    WETH[ChainId.HARMONY_TESTNET], 
    WONE[ChainId.HARMONY_TESTNET], 
    USDC[ChainId.HARMONY_TESTNET],
    USDT[ChainId.HARMONY_TESTNET],
    xDEXS[ChainId.HARMONY_TESTNET],
    WBTC[ChainId.HARMONY_TESTNET],
  ],

}

// used for display in the default list when adding liquidity (native currency is already shown
// by default, so no need to add the wrapper to the list)
export const SUGGESTED_BASES: ChainTokenList = {
  [ChainId.MAINNET]: [USDC[ChainId.MAINNET], USDT[ChainId.MAINNET], WBTC[ChainId.MAINNET]],
  [ChainId.RINKEBY]: [xDEXS[ChainId.RINKEBY]],
  [ChainId.HARMONY]: [WONE[ChainId.HARMONY]],
  [ChainId.HARMONY_TESTNET]: [WONE[ChainId.HARMONY_TESTNET],  xDEXS[ChainId.HARMONY_TESTNET]],
}

// used to construct the list of all pairs we consider by default in the frontend
export const BASES_TO_TRACK_LIQUIDITY_FOR: ChainTokenList = {
  [ChainId.MAINNET]: [WETH[ChainId.MAINNET], USDC[ChainId.MAINNET], USDT[ChainId.MAINNET],  DAI[ChainId.MAINNET]],
  [ChainId.RINKEBY]: [
    WETH[ChainId.RINKEBY], 
    WBTC[ChainId.RINKEBY], 
    DAI[ChainId.RINKEBY], 
    USDC[ChainId.RINKEBY], 
    USDT[ChainId.RINKEBY], 
    xDEXS[ChainId.RINKEBY], 
  ],
  [ChainId.HARMONY]: [
    WETH[ChainId.HARMONY], 
    WONE[ChainId.HARMONY], 
    WBTC[ChainId.HARMONY], 
    DAI[ChainId.HARMONY], 
    USDC[ChainId.HARMONY], 
    USDT[ChainId.HARMONY]
  ],
  [ChainId.HARMONY_TESTNET]: [
    WETH[ChainId.HARMONY_TESTNET], 
    WONE[ChainId.HARMONY_TESTNET], 
    DAI[ChainId.HARMONY_TESTNET], 
    USDC[ChainId.HARMONY_TESTNET], 
    USDT[ChainId.HARMONY_TESTNET], 
    WBTC[ChainId.HARMONY_TESTNET], 
    xDEXS[ChainId.HARMONY_TESTNET]
  ],
}

export const PINNED_PAIRS: { readonly [chainId in ChainId]?: [Token, Token][] } = {
  [ChainId.MAINNET]: [
    [USDC[ChainId.MAINNET], USDT[ChainId.MAINNET]],
    [USDT[ChainId.MAINNET], DAI[ChainId.MAINNET]]
  ],
  [ChainId.RINKEBY]: [
    [xDEXS[ChainId.RINKEBY], WETH[ChainId.RINKEBY]],
    [xDEXS[ChainId.RINKEBY], WBTC[ChainId.RINKEBY]],
  ],
  [ChainId.HARMONY]: [
    [WONE[ChainId.HARMONY], xDEXS[ChainId.HARMONY]],
    [WONE[ChainId.HARMONY], USDC[ChainId.HARMONY]],
    [WONE[ChainId.HARMONY], USDT[ChainId.HARMONY]],
    [WONE[ChainId.HARMONY], DAI[ChainId.HARMONY]],
    [WONE[ChainId.HARMONY], WBTC[ChainId.HARMONY]],
  ],
  [ChainId.HARMONY_TESTNET]: [
    [xDEXS[ChainId.HARMONY_TESTNET], WONE[ChainId.HARMONY_TESTNET]],
    [xDEXS[ChainId.HARMONY_TESTNET], USDC[ChainId.HARMONY_TESTNET]],
    [xDEXS[ChainId.HARMONY_TESTNET], USDT[ChainId.HARMONY_TESTNET]],
    [xDEXS[ChainId.HARMONY_TESTNET], DAI[ChainId.HARMONY_TESTNET]],
    [xDEXS[ChainId.HARMONY_TESTNET], WBTC[ChainId.HARMONY_TESTNET]],
    [WONE[ChainId.HARMONY_TESTNET], WBTC[ChainId.HARMONY_TESTNET]],
  ],
}

export interface WalletInfo {
  connector?: AbstractConnector
  name: string
  iconName: string
  description: string
  href: string | null
  color: string
  primary?: true
  mobile?: true
  mobileOnly?: true
}

export const SUPPORTED_WALLETS: { [key: string]: WalletInfo } = {
  INJECTED: {
    connector: injected,
    name: 'Injected',
    iconName: 'arrow-right.svg',
    description: 'Injected web3 provider.',
    href: null,
    color: '#010101',
    primary: true
  },
  METAMASK: {
    connector: injected,
    name: 'MetaMask',
    iconName: 'metamask.png',
    description: 'Easy-to-use browser extension.',
    href: null,
    color: '#E8831D'
  },
  WALLET_CONNECT: {
    connector: walletConnect,
    name: 'WalletConnect',
    iconName: 'wallet-connect.svg',
    description: 'Connect to Trust Wallet, Rainbow Wallet and more...',
    href: null,
    color: '#4196FC',
    mobile: true
  },
  WALLET_CONNECT_HARMONY: {
    connector: walletConnectHARMONY,
    name: 'WalletConnect Harmony',
    iconName: 'wallet-connect.svg',
    description: 'Connect to Trust Wallet, Rainbow Wallet and more...',
    href: null,
    color: '#4196FC',
    mobile: true
  },
  AUTHEREUM: {
    connector: authereum,
    name: 'Authereum',
    iconName: 'authereum.svg',
    description: 'Connect using Authereum.',
    href: null,
    color: '#4196FC',
    mobile: true
  }
}


export const NetworkContextName = 'NETWORK'

// default allowed slippage, in bips
export const INITIAL_ALLOWED_SLIPPAGE = 50
// 20 minutes, denominated in seconds
export const DEFAULT_DEADLINE_FROM_NOW = 60 * 20
export const DEFAULT_USER_MULTIHOP_ENABLED = true

export const BIG_INT_ZERO = JSBI.BigInt(0)

// one basis point
export const ONE_BIPS = new Percent(JSBI.BigInt(1), JSBI.BigInt(10000))
export const BIPS_BASE = JSBI.BigInt(10000)
// used for warning states
export const ALLOWED_PRICE_IMPACT_LOW: Percent = new Percent(JSBI.BigInt(100), BIPS_BASE) // 1%
export const ALLOWED_PRICE_IMPACT_MEDIUM: Percent = new Percent(JSBI.BigInt(300), BIPS_BASE) // 3%
export const ALLOWED_PRICE_IMPACT_HIGH: Percent = new Percent(JSBI.BigInt(500), BIPS_BASE) // 5%
// if the price slippage exceeds this number, force the user to type 'confirm' to execute
export const PRICE_IMPACT_WITHOUT_FEE_CONFIRM_MIN: Percent = new Percent(JSBI.BigInt(1000), BIPS_BASE) // 10%
// for non expert mode disable swaps above this
export const BLOCKED_PRICE_IMPACT_NON_EXPERT: Percent = new Percent(JSBI.BigInt(1500), BIPS_BASE) // 15%

// used to ensure the user doesn't send so much ETH so they end up with <.01
export const MIN_ETH: JSBI = JSBI.exponentiate(JSBI.BigInt(10), JSBI.BigInt(16)) // .01 ETH

export const DEFAULT_TOKEN_LIST = 'https://raw.githubusercontent.com/Agin-DropDisco/crypto-logo-asset/main/dexswap-list.json'

export const ZERO_USD = CurrencyAmount.usd('0')

interface NetworkDetails {
  chainId: string
  chainName: string
  nativeCurrency: {
    name: string
    symbol: string
    decimals: number
  }
  rpcUrls: string[]
  blockExplorerUrls?: string[]
  iconUrls?: string[] // Currently ignored.
  metamaskAddable?: boolean
}

export const NETWORK_DETAIL: { [chainId: number]: NetworkDetails } = {
  [ChainId.HARMONY]: {
    chainId: `0x${ChainId.HARMONY.toString(16)}`,
    chainName: 'HARMONY',
    nativeCurrency: {
      name: Currency.ONE.name || 'ONE',
      symbol: Currency.ONE.symbol || 'ONE',
      decimals: Currency.ONE.decimals || 18
    },
    rpcUrls: ['https://api.s0.t.hmny.io'],
    blockExplorerUrls: ['https://explorer.harmony.one'],
    metamaskAddable: true
  },
  [ChainId.HARMONY_TESTNET]: {
    chainId: `0x${ChainId.HARMONY_TESTNET.toString(16)}`,
    chainName: 'HARMONY',
    nativeCurrency: {
      name: Currency.ONE.name || 'ONE',
      symbol: Currency.ONE.symbol || 'ONE',
      decimals: Currency.ONE.decimals || 18
    },
    rpcUrls: ['https://api.s0.b.hmny.io'],
    blockExplorerUrls: ['https://explorer.testnet.harmony.one'],
    metamaskAddable: true
  },
  [ChainId.RINKEBY]: {
    chainId: `0x${ChainId.RINKEBY.toString(16)}`,
    chainName: 'HARMONY',
    nativeCurrency: {
      name: Currency.ETHER.name || 'Ether',
      symbol: Currency.ETHER.symbol || 'Ether',
      decimals: Currency.ETHER.decimals || 18
    },
    rpcUrls: ['https://rinkeby.infura.io/v3/da9c85c80bd0432dad730f1d5fbfd70b'],
    blockExplorerUrls: ['https://rinkeby.etherscan.io'],
    metamaskAddable: true
  }
}

export const ROUTABLE_PLATFORM_LOGO: { [routablePaltformName: string]: ReactNode } = {
  [RoutablePlatform.UNISWAP.name]: <img width={16} height={16} src={UniswapLogo} alt="uniswap" />,
  [RoutablePlatform.SUSHISWAP.name]: <img width={16} height={16} src={SushiswapLogo} alt="sushiswap" />,
  [RoutablePlatform.DEXSWAP.name]: <img width={16} height={16} src={DexGradientLogo} alt="dexswap" />,
  [RoutablePlatform.VIPERSWAP.name]: <img width={16} height={16} src={ViperswapLogo} alt="viperswap" />,
  [RoutablePlatform.SWOOP.name]: <img width={16} height={16} src={SwoppswapLogo} alt="swoop" />,
}

export const ChainLabel: any = {
  [ChainId.MAINNET]: 'Ethereum',
  [ChainId.RINKEBY]: 'Rinkeby',
  [ChainId.HARMONY]: 'Harmony',
  [ChainId.HARMONY_TESTNET]: 'Harmony'
}
