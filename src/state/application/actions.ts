import { createAction } from '@reduxjs/toolkit'
import { TokenList } from '@uniswap/token-lists'
import { ChainId } from 'dexswap-sdk'

export type PopupContent =
  | {
      txn: {
        hash: string
        success: boolean
        summary?: string
      }
    }
  | {
      newNetworkChainId: ChainId
    }
  | {
      listUpdate: {
        listUrl: string
        oldList: TokenList
        newList: TokenList
        auto: boolean
      }
    }

export enum ApplicationModal {
  WALLET,
  SETTINGS,
  SELF_CLAIM,
  ADDRESS_CLAIM,
  CLAIM_POPUP,
  MENU,
  MOBILE,
  WALLET_SWITCHER,
  NETWORK_SWITCHER,
  ADD_HARMONY,
  ETHEREUM_OPTION,
  NETWORK_SWITCHER_FROM,
  NETWORK_SWITCHER_TO

}

export enum MainnetGasPrice {
  INSTANT = 'INSTANT',
  FAST = 'FAST',
  NORMAL = 'NORMAL'
}

export const updateBlockNumber = createAction<{ chainId: number; blockNumber: number }>('application/updateBlockNumber')
export const updateMainnetGasPrices = createAction<{ [variant in MainnetGasPrice]: string } | null>(
  'application/updateMainnetGasPrices'
)
export const setOpenModal = createAction<ApplicationModal | null>('application/setOpenModal')
