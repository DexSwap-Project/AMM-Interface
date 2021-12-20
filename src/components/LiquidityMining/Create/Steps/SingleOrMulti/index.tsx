import React, { useCallback } from 'react'
import { Text } from 'rebass'
import styled from 'styled-components/macro'
// import { ReactComponent as DexsText } from '../../../../../assets/svg/sg.svg'
// import { ReactComponent as DiamondsSvg } from '../../../../../assets/svg/diamonds.svg'
import { AutoColumn } from '../../../../Column'
import { AutoRow } from '../../../../Row'
import { Card as StyledCard } from '../../../styleds'

const Card = styled(StyledCard)<{ active?: boolean }>`
  width: 100%;
  height: 138px;
  position: relative;
  opacity: ${props => (!props.selectable || props.active ? '1' : '0.4')};
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  ${props => props.theme.mediaWidth.upToExtraSmall`
    width: 100%;
  `}
`

const CardText = styled(Text)`
  font-weight: 700;
  font-size: 14px;
  line-height: 24px;
  letter-spacing: 0.08em;
  text-transform: uppercase;
`

// const DexsTextStyle = styled(DexsText)`
//   position: absolute;
//   right: 6px;
//   bottom: 28px;
//   width: 89px;
//   opacity: 0.6;
//   path {
//     stroke: ${props => props.theme.purple3};
//   }
// `


interface SingleOrMultiStepProps {
  singleReward: boolean | null
  onChange: (newValue: boolean) => void
}

export default function SingleOrMultiStep({ singleReward, onChange }: SingleOrMultiStepProps) {
  const handleSingleRewardClick = useCallback(() => {
    onChange(true)
  }, [onChange])

  return (
    <AutoRow gap="8px">
      <Card selectable active={singleReward === null || !!singleReward} onClick={handleSingleRewardClick}>
        <AutoColumn>
          <CardText>Welcome to DexSwap</CardText>
          <CardText>Liquidity Minning & Token Rewards</CardText>
        </AutoColumn>
        {/* <DexsTextStyle /> */}
      </Card>
    </AutoRow>
  )
}
