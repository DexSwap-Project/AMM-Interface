import styled from 'styled-components/macro'
import { DarkCard3 } from '../Card'

export const Card = styled(DarkCard3)`
  width: 100%;
  box-shadow: -3.40642px -3.40642px 20.4385px #53587c, 3.40642px 3.40642px 22.92px rgb(0 0 0 / 65%);
  background-color: transparent !important;
`

export const Divider = styled.div`
  height: 100%;
  width: 1px;
  background: ${props => props.theme.bg5};
`
