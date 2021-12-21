import React, { useCallback, useState } from 'react'
import styled from 'styled-components/macro'
import { Link } from 'react-router-dom'
import { SwapPoolTabs } from '../../components/NavigationTabs'
import { PageWrapper } from './styleds'

import { TYPE } from '../../theme'
import { Box, Flex, Text } from 'rebass'
import { RowBetween, RowFixed } from '../../components/Row'
import { ButtonPrimary, ButtonSecondary  } from '../../components/Button'
import { AutoColumn } from '../../components/Column'

import { useActiveWeb3React } from '../../hooks'
import threeBlurredCircles from '../../assets/svg/three-blurred-circles.svg'
import { ChevronDown, X } from 'react-feather'
import { CardSection } from '../../components/earn/styled'
import CurrencySearchModal from '../../components/SearchModal/CurrencySearchModal'
import { Currency, Token } from 'dexswap-sdk'
import { useLiquidityMiningFeatureFlag } from '../../hooks/useLiquidityMiningFeatureFlag'
import { useAllPairsWithLiquidityAndMaximumApyAndStakingIndicator } from '../../hooks/useAllPairsWithLiquidityAndMaximumApyAndStakingIndicator'
import ListFilter, { PairsFilterType } from '../../components/Pool/ListFilter'
import { useLPPairs } from '../../hooks/useLiquidityPositions'
import PairsList from '../../components/Pool/PairsList'
import CurrencyLogo from '../../components/CurrencyLogo'

const VoteCard = styled.div`
  overflow: hidden;
  border: 1px solid ${({ theme }) => theme.bg2};
  border-radius: 8px;
  box-shadow:  inset -3.40642px -3.40642px 20.4385px #00bcd4, 3.40642px 3.40642px 22.92px rgb(0 0 0 / 65%);
`

const TitleRow = styled(RowBetween)`
  ${({ theme }) => theme.mediaWidth.upToSmall`
    flex-wrap: wrap;
    gap: 12px;
    width: 100%;
    flex-direction: column-reverse;
  `};
`

const ButtonRow = styled(RowFixed)`
  gap: 12px;
  ${({ theme }) => theme.mediaWidth.upToSmall`
    width: 100%;
    flex-direction: column;
    justify-content: space-between;
    margin-bottom: 8px;
  `};
`

const ResponsiveButtonPrimary = styled(ButtonPrimary)`
  box-shadow: rgb(15 10 12) -8px 8px 16px 0px, rgb(255 255 255 / 8%) 8px -8px 16px 0px;
  width: fit-content;
  background: none;
  ${({ theme }) => theme.mediaWidth.upToSmall`
    width: 100%;
  `};
  transition: background all 420ms cubic-bezier(0.165, 0.84, 0.44, 1);
  &:hover {
    background: none;
    box-shadow: rgb(15 10 12) -8px 8px 16px 0px, rgb(255 255 255 / 8%) 8px -8px 16px 0px;
  }
`

const ResponsiveButtonSecondary = styled(ButtonSecondary)`
  box-shadow: rgb(15 10 12) -8px 8px 16px 0px, rgb(255 255 255 / 8%) 8px -8px 16px 0px;
  width: fit-content;
  border: none;
  color: ${({ theme }) => theme.white};
  background: none;
  ${({ theme }) => theme.mediaWidth.upToSmall`
  width: 100%;
  `};
  transition: background all 420ms cubic-bezier(0.165, 0.84, 0.44, 1);
  &:hover {
  background: none;
  box-shadow: rgb(15 10 12) -8px 8px 16px 0px, rgb(255 255 255 / 8%) 8px -8px 16px 0px;
  }
`

const PointableFlex = styled(Flex)`
  border-radius: 8px;
  height: 36px;
  align-items: center;
  padding: 0 10px;
  cursor: pointer;
  box-shadow: -3.40642px -3.40642px 20.4385px #53587c, 3.40642px 3.40642px 22.92px rgb(0 0 0 / 65%);
`

const ResetFilterIconContainer = styled(Flex)`
  border: solid 1px ${props => props.theme.bg3};
  border-radius: 8px;
  width: 24px;
  height: 24px;
  align-items: center;
  justify-content: center;
`

const ResetFilterIcon = styled(X)`
  width: 12px;
  height: 12px;
  color: ${props => props.theme.purple3};
`

interface TitleProps {
  filteredToken?: Token
  onCurrencySelection: (currency: Currency) => void
  onFilteredTokenReset: () => void
}

// decoupling the title from the rest of the component avoids full-rerender everytime the pair selection modal is opened
function Title({ onCurrencySelection, filteredToken, onFilteredTokenReset }: TitleProps) {
  const [openTokenModal, setOpenTokenModal] = useState(false)
  const liquidityMiningEnabled = useLiquidityMiningFeatureFlag()

  const handleAllClick = useCallback(() => {
    setOpenTokenModal(true)
  }, [])

  const handleModalClose = useCallback(() => {
    setOpenTokenModal(false)
  }, [])

  const handleResetFilterLocal = useCallback(
    (e: any) => {
      onFilteredTokenReset()
      e.stopPropagation()
    },
    [onFilteredTokenReset]
  )

  return (
    <>
      <TitleRow style={{ marginTop: '1rem' }} padding={'0'}>
        <Flex alignItems="center">
          <Box mr="8px">
            <Text fontSize="26px" lineHeight="32px">
              Pairs
            </Text>
          </Box>
          <Box mr="8px">
            <Text fontSize="26px" lineHeight="32px">
              /
            </Text>
          </Box>
          <PointableFlex onClick={handleAllClick}>
            {!filteredToken && (
              <Box mr="6px" height="21px">
                <img src={threeBlurredCircles} alt="Circles" />
              </Box>
            )}
            {filteredToken && (
              <Box mr="8px">
                <CurrencyLogo currency={filteredToken} size="21px" />
              </Box>
            )}
            <Text mr="8px" fontWeight="600" fontSize="16px" lineHeight="20px">
              {filteredToken ? filteredToken.symbol : 'ALL'}
            </Text>
            <Box>
              <ChevronDown size={12} />
            </Box>
            {filteredToken && (
              <Box ml="6px">
                <ResetFilterIconContainer onClick={handleResetFilterLocal}>
                  <ResetFilterIcon />
                </ResetFilterIconContainer>
              </Box>
            )}
          </PointableFlex>
        </Flex>
        <ButtonRow>
          <ResponsiveButtonPrimary id="join-pool-button" as={Link} padding="8px 14px" to="/create">
            <Text fontWeight={700} fontSize={12}>
              CREATE TOKEN PAIR
            </Text>
          </ResponsiveButtonPrimary>
          {liquidityMiningEnabled && (
            <ResponsiveButtonSecondary className="join-liquidity" as={Link} padding="8px 14px" to="/liquidity-mining/create">
              <Text fontWeight={700} fontSize={12} lineHeight="15px">
              CREATE TOKEN REWARDS
              </Text>
            </ResponsiveButtonSecondary>
          )}
        </ButtonRow>
      </TitleRow>
      <CurrencySearchModal
        isOpen={openTokenModal}
        onDismiss={handleModalClose}
        onCurrencySelect={onCurrencySelection}
        showNativeCurrency={false}
      />
    </>
  )
}

export default function Pools() {
  const { account } = useActiveWeb3React()
  const [filterToken, setFilterToken] = useState<Token | undefined>()
  const [aggregatedDataFilter, setAggregatedDataFilter] = useState(PairsFilterType.ALL)
  const { loading: loadingAggregatedData, aggregatedData } = useAllPairsWithLiquidityAndMaximumApyAndStakingIndicator(
    aggregatedDataFilter,
    filterToken
  )
  const { loading: loadingUserLpPositions, data: userLpPairs } = useLPPairs(account || undefined)

  const handleCurrencySelect = useCallback(token => {
    setFilterToken(token as Token)
  }, [])

  const handleFilterTokenReset = useCallback(() => {
    setFilterToken(undefined)
  }, [])

  return (
    <>
      <PageWrapper>
        <SwapPoolTabs active={'pool'} />
        <AutoColumn gap="lg" justify="center">
          <AutoColumn gap="32px" style={{ width: '100%' }}>
            <Title
              onCurrencySelection={handleCurrencySelect}
              filteredToken={filterToken}
              onFilteredTokenReset={handleFilterTokenReset}
            />
            <ListFilter filter={aggregatedDataFilter} onFilterChange={setAggregatedDataFilter} />
            <PairsList
              showMyPairs
              loading={loadingUserLpPositions || loadingAggregatedData}
              aggregatedPairs={aggregatedData}
              userLpPairs={userLpPairs}
            />
          </AutoColumn>
        </AutoColumn>
        <VoteCard style={{ marginTop: '32px' }}>
          <CardSection>
            <AutoColumn gap="md">
              <RowBetween>
                <TYPE.body fontWeight={600} lineHeight="8px" color="#3ec6fd" textAlign="center" width="100%" fontSize="12px">
                  MADE WITH <span role="img" aria-label="love">❤️</span> FOR HARMONY NETWORK
                </TYPE.body>
              </RowBetween>
            </AutoColumn>
          </CardSection>
        </VoteCard>
      </PageWrapper>
    </>
  )
}
