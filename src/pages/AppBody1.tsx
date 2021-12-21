import React, { useContext } from 'react'
import styled, { ThemeContext } from 'styled-components'
import { DarkCard1 } from '../components/Card'


export const BodyWrapper1 = styled(DarkCard1)<{ tradeDetailsOpen?: boolean }>`
  position: relative;
  max-width: 520px;
  width: 100%;
  border-radius: 12px;
  background-color: transparent !important;
  transition: box-shadow 0.3s ease;
  ::before {
    border-radius: 50px;
    background-color: transparent !important;
    box-shadow: -3.40642px -3.40642px 20.4385px #53587c, 3.40642px 3.40642px 22.92px rgb(0 0 0 / 65%);
  }
`

interface AppBodyProps {
  tradeDetailsOpen?: boolean
  children: React.ReactNode
}


/**
 * The styled container element that wraps the content of most pages and the tabs.
 */
 export default function AppBody1({ children, tradeDetailsOpen }: AppBodyProps) {
  const theme = useContext(ThemeContext)
  return (
    <BodyWrapper1 backgroundColor={theme.bg1} tradeDetailsOpen={tradeDetailsOpen}>
      
      {children}
    </BodyWrapper1>
  )
}