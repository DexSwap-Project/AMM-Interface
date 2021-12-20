import { transparentize } from 'polished'
import styled from 'styled-components/macro'

export const GovernanceText = styled.span`
  color: ${({ theme }) => transparentize(0.6, theme.text5)};
`
