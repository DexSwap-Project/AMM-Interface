import { JSBI, LiquidityMiningCampaign, parseBigintIsh, TokenAmount } from 'dexswap-sdk'
import React, { useCallback, useEffect, useState } from 'react'
import Skeleton from 'react-loading-skeleton'
import { Box, Flex } from 'rebass'
import styled from 'styled-components/macro'

import { useActiveWeb3React } from '../../../../hooks'
import { useLiquidityMiningActionCallbacks } from '../../../../hooks/useLiquidityMiningActionCallbacks'
import { useLiquidityMiningCampaignPosition } from '../../../../hooks/useLiquidityMiningCampaignPosition'
import { useLpTokensUnderlyingAssets } from '../../../../hooks/useLpTokensUnderlyingAssets'
import { useTransactionAdder } from '../../../../state/transactions/hooks'
import { useTokenBalance } from '../../../../state/wallet/hooks'
import { TYPE } from '../../../../theme'
import { ButtonDark2 } from '../../../Button'

import { GreyCard } from '../../../Card'
import { AutoColumn } from '../../../Column'
import CurrencyLogo from '../../../CurrencyLogo'
import Row, { RowBetween } from '../../../Row'
import DataDisplayer from '../DataDisplayer'
import TokenAmountDisplayer from '../TokenAmountDisplayer'
import ConfirmClaimModal from './ConfirmClaimModal'
import ConfirmExitModal from './ConfirmExitModal'
import ConfirmStakingModal from './ConfirmStakingModal'
import ConfirmWithdrawalModal from './ConfirmWithdrawalModal'

const StyledPositionCard = styled(GreyCard)`
  border: none;
  padding: 24px 28px;
  color: white;
  position: relative;
  overflow: hidden;
  background: radial-gradient(147.37% 164.97% at 50% 0%, rgba(255, 255, 255, 0.1) 0%, rgba(0, 0, 0, 0) 100%), #1f1d2c;
  background-blend-mode: overlay, normal;
  border-radius: 28px;
  box-shadow: rgb(15 10 12) -2px 2px 4px inset, rgb(255 255 255 / 8%) 2px -2px 4px inset;
  background: radial-gradient(147.37% 164.97% at 50% 0%,rgba(255,255,255,0.1) 0%,rgba(0,0,0,0) 100%),#1f1d2c;
`

interface FullPositionCardProps {
  campaign?: LiquidityMiningCampaign
  showUSDValue: boolean
}
// TODO:
export default function StakeCard({ campaign, showUSDValue }: FullPositionCardProps) {
  const { account } = useActiveWeb3React()
  const stakableTokenBalance = useTokenBalance(account || undefined, campaign?.targetedPair.liquidityToken)
  const callbacks = useLiquidityMiningActionCallbacks(campaign?.address)
  const {
    stakedTokenAmount,
    claimableRewardAmounts,
    claimedRewardAmounts,
    totalRewardedAmounts
  } = useLiquidityMiningCampaignPosition(campaign, account || undefined)
  const addTransaction = useTransactionAdder()
  const { loading: loadingLpTokensUnderlyingAssets, underlyingAssets } = useLpTokensUnderlyingAssets(
    campaign?.targetedPair,
    stakedTokenAmount || undefined
  )

  const [attemptingTransaction, setAttemptingTransaction] = useState(false)
  const [transactionHash, setTransactionHash] = useState('')
  const [errorMessage, setErrorMessage] = useState('')
  const [showStakingConfirmationModal, setShowStakingConfirmationModal] = useState(false)
  const [showWithdrawalConfirmationModal, setShowWithdrawalConfirmationModal] = useState(false)
  const [showClaimConfirmationModal, setShowClaimConfirmationModal] = useState(false)
  const [showExitConfirmationModal, setShowExitConfirmationModal] = useState(false)
  const [disabledStaking, setDisabledStaking] = useState(false)
  const [disabledWithdrawing, setDisabledWithdrawing] = useState(false)
  const [disabledClaim, setDisabledClaim] = useState(false)
  const [disabledExit, setDisabledExit] = useState(false)
  const [normalizedStakableTokenBalance, setNormalizedStakableTokenBalance] = useState<TokenAmount | null>(null)

  useEffect(() => {
    if (!campaign) {
      setNormalizedStakableTokenBalance(null)
      return
    }
    if (!stakableTokenBalance) {
      setNormalizedStakableTokenBalance(new TokenAmount(campaign.targetedPair.liquidityToken, '0'))
    } else if (campaign.stakingCap.equalTo('0')) {
      setNormalizedStakableTokenBalance(stakableTokenBalance)
    } else if (campaign.stakingCap.subtract(campaign.staked).lessThan(stakableTokenBalance)) {
      setNormalizedStakableTokenBalance(campaign.stakingCap.subtract(campaign.staked))
    } else {
      setNormalizedStakableTokenBalance(stakableTokenBalance)
    }
  }, [campaign, stakableTokenBalance])

  useEffect(() => {
    setDisabledStaking(
      !campaign ||
        !campaign.currentlyActive ||
        !callbacks ||
        !normalizedStakableTokenBalance ||
        normalizedStakableTokenBalance.equalTo('0')
    )
  }, [callbacks, campaign, normalizedStakableTokenBalance])

  useEffect(() => {
    const now = JSBI.BigInt(Math.floor(Date.now() / 1000))
    setDisabledWithdrawing(
      !campaign ||
        !JSBI.greaterThanOrEqual(now, parseBigintIsh(campaign.startsAt)) ||
        !callbacks ||
        !stakedTokenAmount ||
        stakedTokenAmount.equalTo('0') ||
        (campaign.locked && !JSBI.greaterThanOrEqual(now, parseBigintIsh(campaign.endsAt)))
    )
  }, [callbacks, campaign, stakedTokenAmount])

  useEffect(() => {
    setDisabledClaim(
      !campaign ||
        !callbacks ||
        !JSBI.greaterThanOrEqual(JSBI.BigInt(Math.floor(Date.now() / 1000)), parseBigintIsh(campaign.startsAt)) ||
        !claimableRewardAmounts.find(amount => amount.greaterThan('0'))
    )
  }, [callbacks, campaign, claimableRewardAmounts])

  useEffect(() => {
    const now = JSBI.BigInt(Math.floor(Date.now() / 1000))
    setDisabledExit(
      disabledClaim ||
        !stakedTokenAmount ||
        stakedTokenAmount.equalTo('0') ||
        !!(campaign?.locked && !JSBI.greaterThanOrEqual(now, parseBigintIsh(campaign.endsAt)))
    )
  }, [campaign, disabledClaim, stakedTokenAmount])

  const handleDismiss = useCallback(() => {
    setShowStakingConfirmationModal(false)
    setShowWithdrawalConfirmationModal(false)
    setShowClaimConfirmationModal(false)
    setShowExitConfirmationModal(false)
    setErrorMessage('')
    setTransactionHash('')
  }, [])

  const handleStakingRequest = useCallback(() => {
    setShowStakingConfirmationModal(true)
    setShowWithdrawalConfirmationModal(false)
    setShowClaimConfirmationModal(false)
    setShowExitConfirmationModal(false)
  }, [])

  const handleWithdrawalRequest = useCallback(() => {
    setShowWithdrawalConfirmationModal(true)
    setShowClaimConfirmationModal(false)
    setShowStakingConfirmationModal(false)
    setShowExitConfirmationModal(false)
  }, [])

  const handleClaimRequest = useCallback(() => {
    setShowClaimConfirmationModal(true)
    setShowStakingConfirmationModal(false)
    setShowWithdrawalConfirmationModal(false)
    setShowExitConfirmationModal(false)
  }, [])

  const handleExitRequest = useCallback(() => {
    setShowExitConfirmationModal(true)
    setShowClaimConfirmationModal(false)
    setShowStakingConfirmationModal(false)
    setShowWithdrawalConfirmationModal(false)
  }, [])

  const handleStakeConfirmation = useCallback(
    (amount: TokenAmount) => {
      if (!callbacks || !campaign) return
      setAttemptingTransaction(true)
      callbacks
        .stake(amount)
        .then(transaction => {
          setErrorMessage('')
          setTransactionHash(transaction.hash || '')
          addTransaction(transaction, {
            summary: `Stake ${amount.toSignificant(4)} ${campaign.staked.token.name}`
          })
        })
        .catch(error => {
          console.error(error)
          setErrorMessage('Error broadcasting transaction')
        })
        .finally(() => {
          setAttemptingTransaction(false)
        })
    },
    [addTransaction, callbacks, campaign]
  )

  const handleWithdrawalConfirmation = useCallback(
    (amount: TokenAmount) => {
      if (!callbacks || !campaign) return
      setAttemptingTransaction(true)
      callbacks
        .withdraw(amount)
        .then(transaction => {
          setErrorMessage('')
          setTransactionHash(transaction.hash || '')
          addTransaction(transaction, {
            summary: `Withdraw ${amount.toSignificant(4)} ${campaign.staked.token.name}`
          })
        })
        .catch(error => {
          console.error(error)
          setErrorMessage('Error broadcasting transaction')
        })
        .finally(() => {
          setAttemptingTransaction(false)
        })
    },
    [addTransaction, callbacks, campaign]
  )
  const handleClaimConfirmation = useCallback(
    (amounts: TokenAmount[]) => {
      if (!callbacks || !account) return
      setAttemptingTransaction(true)
      callbacks
        .claim(amounts, account)
        .then(transaction => {
          setErrorMessage('')
          setTransactionHash(transaction.hash || '')
          addTransaction(transaction, {
            summary: `Claim ${amounts.map(amount => `${amount.toSignificant(4)} ${amount.token.symbol}`).join(', ')}`
          })
        })
        .catch(error => {
          console.error(error)
          setErrorMessage('Error broadcasting transaction')
        })
        .finally(() => {
          setAttemptingTransaction(false)
        })
    },
    [account, addTransaction, callbacks]
  )

  const handleExitConfirmation = useCallback(() => {
    if (!callbacks || !account) return
    setAttemptingTransaction(true)
    callbacks
      .exit(account)
      .then(transaction => {
        setErrorMessage('')
        setTransactionHash(transaction.hash || '')
        addTransaction(transaction, {
          summary: 'Claim rewards and withdraw stake'
        })
      })
      .catch(error => {
        console.error(error)
        setErrorMessage('Error broadcasting transaction')
      })
      .finally(() => {
        setAttemptingTransaction(false)
      })
  }, [account, addTransaction, callbacks])

  return (
    <>
      <StyledPositionCard>
        <AutoColumn gap="8px">
          <Flex flexDirection="column">
            <Box mb="20px">
              <TYPE.body color="white" fontWeight="500" lineHeight="19.5px">
                My stake
              </TYPE.body>
            </Box>
            <Flex mb="18px" justifyContent="space-between">
              <Box mr="20px">
                <DataDisplayer
                  title={<Row>STAKED</Row>}
                  data={
                    <AutoColumn gap="4px">
                      {loadingLpTokensUnderlyingAssets || !underlyingAssets ? (
                        <>
                          <Row justifyContent="flex-end">
                            <Skeleton width="40px" height="14px" />
                            <CurrencyLogo marginLeft={4} loading size="14px" />
                          </Row>
                          <Row justifyContent="flex-end">
                            <Skeleton width="40px" height="14px" />
                            <CurrencyLogo marginLeft={4} loading size="14px" />
                          </Row>
                        </>
                      ) : (
                        <>
                          <TokenAmountDisplayer amount={underlyingAssets.token0} showUSDValue={showUSDValue} />
                          <TokenAmountDisplayer amount={underlyingAssets.token1} showUSDValue={showUSDValue} />
                        </>
                      )}
                    </AutoColumn>
                  }
                />
              </Box>
              <Flex>
                <Box mr="20px">
                  <DataDisplayer
                    alignTitleRight
                    title="REWARDED"
                    data={
                      totalRewardedAmounts.length === 0 ? (
                        <Row justifyContent="flex-end">
                          <Skeleton width="40px" height="14px" />
                          <CurrencyLogo loading marginLeft={4} size="14px" />
                        </Row>
                      ) : (
                        totalRewardedAmounts.map(totalRewardedAmount => {
                          return (
                            <TokenAmountDisplayer
                              key={totalRewardedAmount.token.address}
                              amount={totalRewardedAmount}
                              alignRight
                              showUSDValue={showUSDValue}
                            />
                          )
                        })
                      )
                    }
                  />
                </Box>
                <Box mr="20px">
                  <DataDisplayer
                    alignTitleRight
                    title="CLAIMABLE"
                    data={
                      claimableRewardAmounts.length === 0 ? (
                        <Row justifyContent="flex-end">
                          <Skeleton width="40px" height="14px" />
                          <CurrencyLogo loading marginLeft={4} size="14px" />
                        </Row>
                      ) : (
                        claimableRewardAmounts.map(claimableRewardAmount => {
                          return (
                            <TokenAmountDisplayer
                              key={claimableRewardAmount.token.address}
                              amount={claimableRewardAmount}
                              alignRight
                              showUSDValue={showUSDValue}
                            />
                          )
                        })
                      )
                    }
                  />
                </Box>
                <Box>
                  <DataDisplayer
                    title="CLAIMED"
                    alignTitleRight
                    data={
                      claimedRewardAmounts.length === 0 ? (
                        <Row justifyContent="flex-end">
                          <Skeleton width="40px" height="14px" />
                          <CurrencyLogo loading marginLeft={4} size="14px" />
                        </Row>
                      ) : (
                        claimedRewardAmounts.map(claimedRewardAmount => {
                          return (
                            <TokenAmountDisplayer
                              key={claimedRewardAmount.token.address}
                              amount={claimedRewardAmount}
                              alignRight
                              showUSDValue={showUSDValue}
                            />
                          )
                        })
                      )
                    }
                  />
                </Box>
              </Flex>
            </Flex>
          </Flex>
          <RowBetween>
            <ButtonDark2
              padding="8px"
              style={{ fontSize: '12px', fontWeight: 'bold', lineHeight: '15px', background: 'none' }}
              width="100%"
              marginRight="4px"
              disabled={disabledStaking}
              onClick={handleStakingRequest}
            >
              Deposit and stake
            </ButtonDark2>
            <ButtonDark2
              padding="8px"
              style={{ fontSize: '12px', fontWeight: 'bold', lineHeight: '15px', background: 'none' }}
              width="100%"
              marginLeft="4px"
              disabled={disabledClaim}
              onClick={handleClaimRequest}
            >
              Claim rewards
            </ButtonDark2>
          </RowBetween>
          <RowBetween>
            <ButtonDark2
              padding="8px"
              style={{ fontSize: '12px', fontWeight: 'bold', lineHeight: '15px', background: 'none' }}
              width="100%"
              marginRight="4px"
              disabled={disabledWithdrawing}
              onClick={handleWithdrawalRequest}
            >
              Withdraw
            </ButtonDark2>
            <ButtonDark2
              padding="8px"
              style={{ fontSize: '12px', fontWeight: 'bold', lineHeight: '15px', background: 'none' }}
              width="100%"
              marginLeft="4px"
              disabled={disabledExit}
              onClick={handleExitRequest}
            >
              Claim and withdraw
            </ButtonDark2>
          </RowBetween>
        </AutoColumn>
      </StyledPositionCard>
      {campaign && campaign.address && normalizedStakableTokenBalance && (
        <ConfirmStakingModal
          isOpen={showStakingConfirmationModal}
          stakableTokenBalance={normalizedStakableTokenBalance}
          onDismiss={handleDismiss}
          stakablePair={campaign.targetedPair}
          distributionContractAddress={campaign.address}
          attemptingTxn={attemptingTransaction}
          errorMessage={errorMessage}
          onConfirm={handleStakeConfirmation}
          txHash={transactionHash}
          timelocked={campaign.locked}
          endingTimestamp={Number(parseBigintIsh(campaign.endsAt).toString())}
        />
      )}
      <ConfirmWithdrawalModal
        isOpen={showWithdrawalConfirmationModal}
        withdrawablTokenBalance={stakedTokenAmount || undefined}
        onDismiss={handleDismiss}
        stakablePair={campaign?.targetedPair}
        attemptingTxn={attemptingTransaction}
        errorMessage={errorMessage}
        onConfirm={handleWithdrawalConfirmation}
        txHash={transactionHash}
      />
      {claimableRewardAmounts && (
        <ConfirmClaimModal
          isOpen={showClaimConfirmationModal}
          claimableTokenAmounts={claimableRewardAmounts}
          onDismiss={handleDismiss}
          attemptingTxn={attemptingTransaction}
          errorMessage={errorMessage}
          onConfirm={handleClaimConfirmation}
          txHash={transactionHash}
        />
      )}
      <ConfirmExitModal
        isOpen={showExitConfirmationModal}
        onDismiss={handleDismiss}
        stakablePair={campaign?.targetedPair}
        claimableRewards={claimableRewardAmounts}
        stakedTokenBalance={stakedTokenAmount || undefined}
        attemptingTxn={attemptingTransaction}
        errorMessage={errorMessage}
        onConfirm={handleExitConfirmation}
        txHash={transactionHash}
      />
    </>
  )
}
