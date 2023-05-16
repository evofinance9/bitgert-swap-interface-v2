import React from 'react'
import styled from 'styled-components'
import { Link } from 'react-router-dom'
import { ButtonMenu, ButtonMenuItem } from '@evofinance9/uikit'
import useI18n from 'hooks/useI18n'

const StyledNav = styled.div`
  margin-bottom: 25px;
`

function BridgeCardNav({ activeIndex = 0 }: { activeIndex?: number }) {
  const TranslateString = useI18n()
  return (
    <StyledNav>
      <ButtonMenu activeIndex={activeIndex} scale="md" variant="primary">
        <ButtonMenuItem id="swap-nav-link" to="/bridge" as={Link} radius="6px" >
          {TranslateString(1142, 'Bridge')}
        </ButtonMenuItem>
        <ButtonMenuItem id="pool-nav-link" to="/add-bridge" as={Link} radius="6px">
          {TranslateString(262, 'Liquidity')}
        </ButtonMenuItem>
        <ButtonMenuItem id="pool-nav-link" to="/remove-bridge" as={Link} radius="6px">
          {TranslateString(262, 'Withdraw')}
        </ButtonMenuItem>
      </ButtonMenu>
    </StyledNav>
  )
}

export default BridgeCardNav