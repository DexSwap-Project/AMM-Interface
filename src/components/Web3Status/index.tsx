import { UnsupportedChainIdError, useWeb3React } from '@web3-react/core'
import { AbstractConnector } from '@web3-react/abstract-connector'
import React, { useMemo, useState } from 'react'
import styled from 'styled-components/macro'
import { NetworkContextName } from '../../constants'
import useENSName from '../../hooks/useENSName'
import { isTransactionRecent, useAllTransactions } from '../../state/transactions/hooks'
import { TransactionDetails } from '../../state/transactions/reducer'
import { useActiveWeb3React } from '../../hooks'
import { ConnectWalletPopover } from './ConnectWalletPopover'
import WalletModal from '../WalletModal'
import { AccountStatus } from './AccountStatus'
import { WalletConnectConnector } from '@web3-react/walletconnect-connector'
import NetworkSwitcherPopover from '../NetworkSwitcherPopover'
import { useNetworkSwitcherPopoverToggle, useWalletSwitcherPopoverToggle } from '../../state/application/hooks'
import { TriangleIcon } from '../Icons'
import { useTranslation } from 'react-i18next'

const Web3StatusError = styled.div`
  display: flex;
  align-items: center;
  padding: 0 0 0 10px;
  color: ${({ theme }) => theme.text1};
  text-transform: uppercase;
  font-weight: bold;
  font-size: 10px;
  line-height: 12px;
  letter-spacing: 0.08em;
  background-color: ${({ theme }) => theme.red1};
  border-radius: 12px;
`

const SwitchNetworkButton = styled.button`
  height: 29px;
  padding: 8px 14px;
  margin-left: 8px;
  background-color: ${({ theme }) => theme.primary1};
  color: ${({ theme }) => theme.text1};
  border-radius: 12px;
  text-transform: uppercase;
  font-weight: bold;
  font-size: 11px;
  line-height: 12px;
  letter-spacing: 0.08em;
  border: none;
  cursor: pointer;
`

const Button = styled.button`
  height: 32px;
  padding: 10.5px 14px;
  background-color: ${({ theme }) => theme.primary1};
  color: ${({ theme }) => theme.text1};
  border-radius: 12px;
  text-transform: uppercase;
  font-weight: bold;
  font-size: 12px;
  line-height: 12px;
  letter-spacing: 0.08em;
  border: none;
  cursor: pointer;
  background-image: linear-gradient(134deg , #3E3E3E 0%, #1d202f 100%);
  box-shadow: -3.40642px -3.40642px 20.4385px #262933, 3.40642px 3.40642px 22.92px rgb(0 0 0 / 65%);
`

// we want the latest one to come first, so return negative if a is after b
function newTransactionsFirst(a: TransactionDetails, b: TransactionDetails) {
  return b.addedTime - a.addedTime
}

export enum ModalView {
  Pending,
  Account
}

export default function Web3Status() {
  const { active, activate, account, error } = useWeb3React()
  const { chainId: networkConnectorChainId } = useActiveWeb3React()
  const contextNetwork = useWeb3React(NetworkContextName)

  const { ENSName } = useENSName(account ?? undefined)

  const allTransactions = useAllTransactions()

  const sortedRecentTransactions = useMemo(() => {
    const txs = Object.values(allTransactions)
    return txs.filter(isTransactionRecent).sort(newTransactionsFirst)
  }, [allTransactions])

  const pending = sortedRecentTransactions.filter(tx => !tx.receipt).map(tx => tx.hash)
  const confirmed = sortedRecentTransactions.filter(tx => tx.receipt).map(tx => tx.hash)

  const [modal, setModal] = useState<ModalView | null>(null);

  const [pendingError, setPendingError] = useState<boolean>()
  const [pendingWallet, setPendingWallet] = useState<AbstractConnector | undefined>()
  
  const toggleNetworkSwitcherPopover = useNetworkSwitcherPopoverToggle()
  
  const tryActivation = async (connector: AbstractConnector | undefined) => {
    setPendingWallet(connector)
    setModal(ModalView.Pending)

    // if the connector is walletconnect and the user has already tried to connect, manually reset the connector
    if (connector instanceof WalletConnectConnector && connector.walletConnectProvider?.wc?.uri) {
      connector.walletConnectProvider = undefined
    }

    connector &&
      activate(connector, undefined, true).catch(error => {
        if (error instanceof UnsupportedChainIdError) {
          activate(connector)
        } else {
          setPendingError(true)
        }
      })
  }

  const toggleWalletSwitcherPopover = useWalletSwitcherPopoverToggle()
  const { t } = useTranslation();
  
  if (!contextNetwork.active && !active) {
    return null
  }
  
  if (error) {
    return (
      <NetworkSwitcherPopover>
        <Web3StatusError>
          {error instanceof UnsupportedChainIdError ? 'Wrong Network' : 'Error'}
          <SwitchNetworkButton onClick={toggleNetworkSwitcherPopover}>
            Switch network
            <TriangleIcon/>
          </SwitchNetworkButton>
        </Web3StatusError>
      </NetworkSwitcherPopover>
    )
  }
  
  return (
    <>
      <ConnectWalletPopover
        setModal={setModal}
        tryActivation={tryActivation}
      >
        {(networkConnectorChainId && !account) && (
          <Button id="connect-wallet" onClick={toggleWalletSwitcherPopover}>
            {t('Connect wallet')}
          </Button>
        )}
        {(networkConnectorChainId && !!account) && (
          <AccountStatus
            pendingTransactions={pending}
            ENSName={ENSName ?? undefined}
            account={account}
            networkConnectorChainId={networkConnectorChainId}
            onAddressClick={() => setModal(ModalView.Account)}
          />
        )}
      </ConnectWalletPopover>
      <WalletModal
        modal={modal}
        setModal={setModal}
        ENSName={ENSName ?? undefined}
        pendingTransactions={pending}
        confirmedTransactions={confirmed}
        setPendingError={setPendingError}
        pendingWallet={pendingWallet}
        pendingError={pendingError}
        tryActivation={tryActivation}
      />
    </>
  )
}
