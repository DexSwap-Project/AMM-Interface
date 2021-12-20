import React, { useCallback, useEffect, useState } from 'react'
import { LiquidityMiningCampaign } from 'dexswap-sdk'
import { DarkCard4 } from '../../Card'
import Information from './Information'
import StakeCard from './StakeCard'
import { AutoColumn } from '../../Column'
import { useHistory } from 'react-router-dom'
import styled from 'styled-components/macro'
import { ChevronLeft, Repeat } from 'react-feather'
import { useActiveWeb3React } from '../../../hooks'
import { usePrevious } from 'react-use'
import { useIsSwitchingToCorrectChain } from '../../../state/multi-chain-links/hooks'
import { RowBetween } from '../../Row'

const GoBackContainer = styled.div`
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.08em;
  cursor: pointer;
  text-transform: uppercase;
  display: flex;
  color: ${props => props.theme.text3};
`

// USD native wrapper
const USDValueSwitcherContainer = styled.div` 
  font-size: 11px;
  font-weight: 700;
  line-height: 11px;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  cursor: pointer;
`

const StyledChevronLeft = styled(ChevronLeft)`
  width: 14px;
  height: 14px;
  color: ${props => props.theme.white};
  margin-right: 4px;
`

const StyledSwitch = styled(Repeat)`
  width: 12px;
  height: 12px;
  color: ${props => props.theme.purple3};
  margin-left: 4px;
`

interface PairViewProps {
  campaign?: LiquidityMiningCampaign | null
}

function LiquidityMiningCampaignView({ campaign }: PairViewProps) {
  const history = useHistory()
  const { account, chainId } = useActiveWeb3React()
  const previousChainId = usePrevious(chainId)
  const switchingToCorrectChain = useIsSwitchingToCorrectChain()

  const [showUSDValue, setShowUSDValue] = useState(false)

  useEffect(() => {
    // when the chain is switched, and not as a reaction to following a multi chain link
    // (which might require changing chains) redirect to generic pools page
    if (chainId && previousChainId && chainId !== previousChainId && !switchingToCorrectChain) {
      history.push('/pools')
    }
  }, [chainId, history, previousChainId, switchingToCorrectChain])

  const handleUSDValueClick = useCallback(() => {
    setShowUSDValue(!showUSDValue)
  }, [showUSDValue])

  return (
    <AutoColumn gap="18px">
      <RowBetween>
        <GoBackContainer onClick={history.goBack}>
          <StyledChevronLeft />
          Back to pair
        </GoBackContainer>
        <USDValueSwitcherContainer onClick={handleUSDValueClick}>
          Value in {showUSDValue ? 'crypto' : 'terra ust'}
          <StyledSwitch />
        </USDValueSwitcherContainer>
      </RowBetween>
      <DarkCard4 padding="32px">
        <AutoColumn gap="36px">
          <Information
            targetedPair={campaign?.targetedPair}
            stakingCap={campaign?.stakingCap}
            rewards={campaign?.rewards}
            remainingRewards={campaign?.remainingRewards}
            locked={campaign?.locked}
            startsAt={campaign ? parseInt(campaign.startsAt.toString()) : undefined}
            endsAt={campaign ? parseInt(campaign.endsAt.toString()) : undefined}
            apy={campaign?.apy}
            staked={campaign?.staked}
            showUSDValue={showUSDValue}
          />
          {account && <StakeCard campaign={campaign || undefined} showUSDValue={showUSDValue} />}
        </AutoColumn>
      </DarkCard4>
    </AutoColumn>
  )
}

export default LiquidityMiningCampaignView
