import React, { useContext } from 'react'
import styled, { ThemeContext } from 'styled-components'
import { DarkCard } from '../components/Card'


export const BodyWrapper = styled(DarkCard)<{ tradeDetailsOpen?: boolean }>`
  position: relative;
  max-width: 520px;
  width: 100%;
  border-radius: 12px;
  background-color: transparent !important;
  padding: 12px;
  transition: box-shadow 0.3s ease;
  box-shadow: -3.40642px -3.40642px 20.4385px #53587c, 3.40642px 3.40642px 22.92px rgb(0 0 0 / 65%);
  ::before {
    border-radius: 12px;
   background-color: transparent !important;
  }
`

interface AppBodyProps {
  tradeDetailsOpen?: boolean
  children: React.ReactNode
}

/**
 * The styled container element that wraps the content of most pages and the tabs.
 */
export default function AppBody({ children, tradeDetailsOpen }: AppBodyProps) {
  const theme = useContext(ThemeContext)
  return (
    <BodyWrapper backgroundColor={theme.bg1} tradeDetailsOpen={tradeDetailsOpen}>
      
      {children}
    </BodyWrapper>
  )
}
