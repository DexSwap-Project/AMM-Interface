import React from 'react'
import { Box, Flex } from 'rebass'
import { NavLink, withRouter } from 'react-router-dom'

import styled from 'styled-components/macro'

import { useActiveWeb3React } from '../../hooks'
import { useDarkModeManager } from '../../state/user/hooks'
import { useNativeCurrencyBalances } from '../../state/wallet/hooks'

import Settings from '../Settings'

import Row, { RowFixed, RowFlat } from '../Row'
import Web3Status from '../Web3Status'
import { useTranslation } from 'react-i18next'
import MobileOptions from './MobileOptions'
import Badge from '../Badge'
import { useNativeCurrency } from '../../hooks/useNativeCurrency'
// TODO:
import DexswapVersionLogo from '../DexswapVersionLogo'
import DexSwapLine from '../../assets/svg/liners.svg'
const HeaderFrame = styled.div`
  max-width: 1100px;
  margin: 0 auto;
  display: flex;
  width: 100%;
  justify-content: space-between;
  align-items: center;
  position: relative;
  padding: 3rem;
  z-index: 2;
  ${({ theme }) => theme.mediaWidth.upToMedium`
    grid-template-columns: 1fr;
    width: calc(100%);
    position: relative;
  `};

  ${({ theme }) => theme.mediaWidth.upToExtraSmall`
        padding: 0.5rem 1rem;
        box-shadow: rgb(15 10 12) -2px 2px 4px, rgb(255 255 255 / 8%) 2px -2px 4px;
  `}
`

const HeaderControls = styled.div`
  ${({ theme }) => theme.mediaWidth.upToMedium`
    position: fixed;
    bottom: 0px;
    left: 0px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    flex-direction: row-reverse;
    width: 100%;
    height: 72px;
    max-width: 960px;
    padding: 1rem;
    z-index: 99;
    background-color: ${({ theme }) => theme.bg2};
  `};
`

const HeaderElement = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;

  ${({ theme }) => theme.mediaWidth.upToMedium`
   flex-direction: row-reverse;
    align-items: center;
  `};
`

const MoreLinksIcon = styled(HeaderElement)`
  display: none;
  ${({ theme }) => theme.mediaWidth.upToSmall`
    display: flex;
  `};
`

const HeaderRow = styled(RowFixed)<{ isDark: boolean }>`
  ${({ theme }) => theme.mediaWidth.upToMedium`
    width: 100%;
  `};
`

const HeaderLinks = styled(Row)`
  justify-content: center;
  ${({ theme }) => theme.mediaWidth.upToMedium`
    justify-content: flex-end;
  `};
`


const Title = styled.a`
  display: flex;
  align-items: center;
  pointer-events: auto;
  justify-self: flex-start;
  margin-right: 12px;
  margin-left: 8px;
  ${({ theme }) => theme.mediaWidth.upToSmall`
    justify-self: center;
  `};
  ${({ theme }) => theme.mediaWidth.upToExtraSmall`
    margin-right: 0px;
  `};
  :hover {
    cursor: pointer;
  }
`

export const StyledNavLink = styled(NavLink)`
  align-items: center;
  background-color: #262637;
  border: solid 2px transparent;
  color: #C0BAF6;
  border-radius: 12px;
  white-space: nowrap;
  box-shadow: inset rgb(15 10 12) -8px 8px 16px 0px, rgb(255 255 255 / 8%) 8px -8px 16px 0px;
  width: 150px;
  justify-content: center;
  text-align: center;
  border-right: 1px solid #ff5722 !important;
  border-left: 1px solid #ff5722 !important;
  position: relative;
  margin: 0px 12px;
  cursor: pointer;
  font-weight: 400;
  font-size: 16px;
  line-height: 19.5px;
  color: ${({ theme }) => theme.white};

  &.active {
    font-weight: 900;
    color: #00bcd4;
  }

  ${({ theme }) => theme.mediaWidth.upToLarge`
    margin: 0 8px;
  `};
  ${({ theme }) => theme.mediaWidth.upToSmall`
    display: none;
  `};
`


const AbsoluteComingSoonBadgeFlex = styled(Flex)`
  position: absolute;
  top: 20px;
`


const HeaderSubRow2 = styled(RowFlat)`
  align-items: center;
  justify-content: flex-end;
  margin-top: 7px;
  ${({ theme }) => theme.mediaWidth.upToMedium`
    margin: 0;
  `};
`;

const Amount = styled.p`
  padding: 8px 12px;
  margin: 0;
  font-weight: bold;
  font-size: 10px;
  line-height: 12px;
  text-align: center;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  box-shadow: inset rgb(15 10 12) -8px 8px 16px 0px, rgb(255 255 255 / 8%) 8px -8px 16px 0px;
  color: #00bcd4;
  border-radius: 12px;

  & + & {
    margin-left: 7px;
  }
`;

const DesktopSettingsWrapper = styled.div`
  ${({ theme }) => theme.mediaWidth.upToMedium`
    display: none;
  `};
`;

const MobileSettingsWrapper = styled.div`
  display: none;

  ${({ theme }) => theme.mediaWidth.upToMedium`
    display: block;
  `};
`;

const AmountDesktop = styled(Amount)`
  display: block;
  ${({ theme }) => theme.mediaWidth.upToMedium`
    display: none;
  `};
`;

const AmountMobile = styled(Amount)`
  display: none;
  ${({ theme }) => theme.mediaWidth.upToMedium`
    display: block;
  `};
`;

const Texter = styled.div`
  color: pink;
  font-size: 11px;
`;

const HeaderLine = styled.div`
  background: url(${DexSwapLine}) no-repeat center;
  position: absolute;
  width: 100%;
  height: 76px;
  right: 70px;
  bottom: 35px;
  z-index: -1;
  ${({ theme }) => theme.mediaWidth.upToMedium`
  display: none;
 `};
`;


function Header({ history }: { history: any }) {
  const { account } = useActiveWeb3React()
  const { t } = useTranslation()

  const nativeCurrency = useNativeCurrency()
  const userNativeCurrencyBalances = useNativeCurrencyBalances(account ? [account] : [])
  const userNativeCurrencyBalance = userNativeCurrencyBalances?.[account || '']
  const [isDark] = useDarkModeManager()

  
  return (
    <HeaderFrame>
      <HeaderRow isDark={isDark}>
        <Title href=".">
          <DexswapVersionLogo />
        </Title>
        <HeaderLinks>
        <StyledNavLink
            id="pool-nav-link"
            to="/pools"
            activeClassName="active"
          >
            {t('LIQUIDITY')}
          </StyledNavLink>
        <StyledNavLink
            id="swap-nav-link"
            to="/exchange"
            activeClassName="active"
          >
            {t('EXCHANGE')}
          </StyledNavLink>
          <StyledNavLink
            id="bridge-nav-link"
            to="/bridge"
            activeClassName="active"
          >
            {t('BRIDGE')}
            <AbsoluteComingSoonBadgeFlex justifyContent="center" width="100%">
              <Box>
                <Badge label="BETA UI/UX" />
              </Box>
            </AbsoluteComingSoonBadgeFlex>
          </StyledNavLink>
          <StyledNavLink
            id="governanve-nav-link"
            to="/governance"
            activeClassName="active"
          >
            {t('GOVERNANCE')}
            <AbsoluteComingSoonBadgeFlex justifyContent="center" width="100%">
              <Box>
                <Badge label="COMING SOON" />
              </Box>
            </AbsoluteComingSoonBadgeFlex>
          </StyledNavLink>
          <MoreLinksIcon>
            <MobileOptions history={history} />
          </MoreLinksIcon>
          <MobileSettingsWrapper>
            <Settings />
          </MobileSettingsWrapper>
        </HeaderLinks>
      </HeaderRow>
      <HeaderControls>
      <HeaderLine />
        <HeaderElement>
          <Web3Status />
          <DesktopSettingsWrapper>
            <Settings />
          </DesktopSettingsWrapper>
        </HeaderElement>
        <HeaderSubRow2>
          {account && userNativeCurrencyBalance ? (
            <>
              <AmountDesktop style={{ fontSize:"11px", width: "100%" }}>
                <Texter>My Balances: </Texter> {userNativeCurrencyBalance?.toFixed(2)} {nativeCurrency.symbol}
              </AmountDesktop>
              <AmountMobile>
                {userNativeCurrencyBalance?.toFixed(3)} {nativeCurrency.symbol}
              </AmountMobile>
            </>
          ) : null}
        </HeaderSubRow2>
      </HeaderControls>
    </HeaderFrame>
  )
}

export default withRouter(Header)
