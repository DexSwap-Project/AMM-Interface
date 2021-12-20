import React, { ReactNode, useCallback, useRef } from 'react'
import { ChainId } from 'dexswap-sdk'
import styled from 'styled-components/macro'
import Option from './Option'
import { ApplicationModal } from '../../state/application/actions'
import { useModalOpen, useCloseModals, useWalletSwitcherPopoverToggle } from '../../state/application/hooks'

// import EthereumLogo from '../../assets/images/ethereum-logo.png'
import HarmonyLogo from '../../assets/images/harmony.webp'
import Popover from '../Popover'
import { useActiveWeb3React } from '../../hooks'
import { useOnClickOutside } from '../../hooks/useOnClickOutside'
import { NETWORK_DETAIL } from '../../constants'
import { CustomNetworkConnector } from '../../connectors/CustomNetworkConnector'

const StyledPopover = styled(Popover)`
  padding: 0;
  background-color: ${({ theme }) => theme.bg1};
  border-color: ${({ theme }) => theme.dark2};
  border-style: solid;
  border-width: 1.2px;
  border-radius: 12px;
  border-image: none;
  overflow: hidden;
`;

const OptionGrid = styled.div`
  display: grid;
  grid-gap: 10px;
  padding: 22px 7px 15px;
  ${({ theme }) => theme.mediaWidth.upToMedium`
    grid-template-columns: 1fr;
    grid-gap: 10px;
    `};
`

const ChangeWalletButton = styled.button`
  width: 100%;
  padding: 20px 18px;
  font-weight: bold;
  font-size: 11px;
  line-height: 13px;
  text-align: center;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  cursor: pointer;
  font-weight: bold;
  color: #ff5722;
  background-color: #1d202f29;
  border: none;
  box-shadow: -3.40642px -3.40642px 20.4385px #53587c, 3.40642px 3.40642px 22.92px rgb(0 0 0 / 65%);
`;

interface NetworkSwitcherPopoverProps {
  children: ReactNode;
}

export default function NetworkSwitcherPopover({ children}: NetworkSwitcherPopoverProps) {
  const { connector, chainId, account } = useActiveWeb3React()
  const networkSwitcherPopoverOpen = useModalOpen(ApplicationModal.NETWORK_SWITCHER)
  const popoverRef = useRef(null)
  const closeModals = useCloseModals()
  useOnClickOutside(popoverRef, () => {
    if (networkSwitcherPopoverOpen) closeModals()
  })


  const selectNetwork = useCallback(
    (optionChainId: ChainId) => {
      if (optionChainId === chainId) return
      if (!!!account && connector instanceof CustomNetworkConnector) {
        connector.changeChainId(optionChainId)
      }
      if (
        window.ethereum &&
        window.ethereum.request &&
        window.ethereum.isMetaMask &&
        NETWORK_DETAIL[optionChainId] &&
        NETWORK_DETAIL[optionChainId].metamaskAddable
      ) {
        window.ethereum.request({
          method: 'wallet_addEthereumChain',
          params: [{ ...NETWORK_DETAIL[optionChainId], metamaskAddable: undefined }]
        })
        .catch(error => {
          console.error(`error adding network to metamask`, error)
        })
      }
      closeModals()
    },
    [account, chainId, closeModals, connector]
  )
  
  const toggleWalletSwitcherPopover = useWalletSwitcherPopoverToggle()
  // TODO:
  return (
    <div ref={popoverRef}>
      <StyledPopover
        placement="bottom-end"
        content={
          <>
            <OptionGrid>
              <Option
                onClick={() => {
                  selectNetwork(ChainId.HARMONY)
                }}
                header={'HARMONY'}
                logoSrc={HarmonyLogo}
                disabled={chainId === ChainId.HARMONY}
              />
              <Option
                onClick={() => {
                  // selectNetwork(ChainId.HARMONY_TESTNET)
                }}
                header={'TESTNET'}
                logoSrc={HarmonyLogo}
                comingSoon
              />
            </OptionGrid>
            <ChangeWalletButton onClick={toggleWalletSwitcherPopover}>Change wallet</ChangeWalletButton>
          </>
        }
        show={networkSwitcherPopoverOpen}
      >
        {children}
      </StyledPopover>
    </div>
  )
}
