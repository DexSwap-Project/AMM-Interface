import React from 'react'
import styled from 'styled-components/macro'
import logoImage from '../../assets/svg/dexswap_orange.svg'

const Logo = styled.img.attrs({ src: logoImage })`
  height: 25px;
`

const RelativeContainer = styled.div`
  position: relative;
`
function DexswapVersionLogo() {
  return (
    <RelativeContainer>
      <Logo />
    </RelativeContainer>
  )
}

export default DexswapVersionLogo
