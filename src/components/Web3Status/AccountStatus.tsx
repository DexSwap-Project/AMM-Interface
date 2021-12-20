import { ChainId } from 'dexswap-sdk';
import React from 'react'
import { Text } from 'rebass';
import styled from 'styled-components/macro';
import { useNetworkSwitcherPopoverToggle } from '../../state/application/hooks';
import { TYPE } from '../../theme';
import { shortenAddress } from '../../utils';
import Loader from '../Loader';
import NetworkSwitcherPopover from '../NetworkSwitcherPopover';
import { RowBetween } from '../Row';
import EthereumLogo from '../../assets/images/ethereum-logo.png'
import HarmonyLogo from '../../assets/images/harmony.webp'
import { TriangleIcon } from '../Icons';
// TODO:
const ChainLogo: any = {
  [ChainId.MAINNET]: EthereumLogo,
  [ChainId.RINKEBY]: EthereumLogo,
  [ChainId.HARMONY]: HarmonyLogo,
  [ChainId.HARMONY_TESTNET]: HarmonyLogo
}

const ChainLabel: any = {
  [ChainId.MAINNET]: 'Ethereum',
  [ChainId.RINKEBY]: 'Rinkeby',
  [ChainId.HARMONY]: 'Harmony',
  [ChainId.HARMONY_TESTNET]: 'Harmony Testnet'
}

const View = styled.div`
  border-right: 2px solid #ff5722 !important;
  border-left: 2px solid #ff5722 !important;
  display: flex;
  align-items: center;
  background-color: ${({ theme }) => theme.dark1};
  border: solid 2px transparent;
  color: ${({ theme }) => theme.purple2};
  border-radius: 12px;
  white-space: nowrap;
  box-shadow: rgb(15 10 12) -8px 8px 16px 0px, rgb(255 255 255 / 8%) 8px -8px 16px 0px;
`;

const Web3StatusConnected = styled.button<{ pending?: boolean }>`
  height: 29px;
  padding: 0 0 0 8px;
  background: none;
  border: none;
  color: ${({ pending, theme }) => (pending ? theme.white : theme.text4)};
  font-weight: 700;
  font-size: 11px;
  line-height: 13px;
  letter-spacing: 0.08em;
  cursor: pointer;
`;

const Web3StatusNetwork = styled.button<{ pendingTransactions?: boolean }>`
  display: flex;
  align-items: center;
  height: 29px;
  padding: 7px 8px;
  margin-left: 10px;
  font-size: 12px;
  line-height: 15px;
  text-align: center;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: #FFFFFF;
  border-radius: 12px;
  background: linear-gradient(271deg, #7d2d087d 0%, #222231 100%);
  border: none;

  &:hover {
    cursor: pointer;
  }
`

const IconWrapper = styled.div<{ size?: number | null }>`
  ${({ theme }) => theme.flexColumnNoWrap};
  align-items: center;
  justify-content: center;

  & > img,
  span {
    height: ${({ size }) => (size ? size + 'px' : '30px')};
  }

  ${({ theme }) => theme.mediaWidth.upToMedium`
    align-items: center;
  `};
`

const NetworkName = styled.div`
  ${({ theme }) => theme.mediaWidth.upToMedium`
    display: none;
  `};
`;

const AddressDesktop = styled.span`
  display: block;
  ${({ theme }) => theme.mediaWidth.upToMedium`
    display: none;
  `};
`;

const AddressMobile = styled.span`
  display: none;
  ${({ theme }) => theme.mediaWidth.upToMedium`
    display: block;
  `};
`;

interface AccountStatusProps {
  pendingTransactions: string[];
  ENSName?: string;
  account: string;
  networkConnectorChainId: ChainId;
  onAddressClick: () => void;
}

export function AccountStatus({pendingTransactions, ENSName, account, networkConnectorChainId, onAddressClick}: AccountStatusProps) {
  const hasPendingTransactions = !!pendingTransactions.length
  const toggleNetworkSwitcherPopover = useNetworkSwitcherPopoverToggle()
  
  return (
    <View>
      <Web3StatusConnected id="web3-status-connected" onClick={onAddressClick} pending={hasPendingTransactions}>
        {hasPendingTransactions ? (
          <RowBetween>
            <Text fontSize={13}>{pendingTransactions?.length} Pending</Text> <Loader />
          </RowBetween>
        ) : (
          ENSName || (
            <>
              <AddressDesktop>{shortenAddress(account)}</AddressDesktop>
              <AddressMobile>{shortenAddress(account, 2)}</AddressMobile>
            </>
          )
        )}
      </Web3StatusConnected>
      <NetworkSwitcherPopover>
        <Web3StatusNetwork onClick={toggleNetworkSwitcherPopover}>
          <IconWrapper size={20}>
            <img src={ChainLogo[networkConnectorChainId]} alt="chain logo" />
          </IconWrapper>
          <NetworkName>
            <TYPE.white ml="8px" fontWeight={700} fontSize="12px">
              {ChainLabel[networkConnectorChainId]}
            </TYPE.white>
          </NetworkName>
          <TriangleIcon/>
        </Web3StatusNetwork>
      </NetworkSwitcherPopover>
    </View>
  )
}
