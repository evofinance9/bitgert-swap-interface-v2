import React from 'react'
import styled from 'styled-components'
import { Text, Button, Link } from '@evofinance9/uikit'

const Wrapper = styled.div`
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-wrap: wrap;
  background-color: ${({ theme }) => theme.colors.tertiary};
  padding: 16px;
  ${({ theme }) => theme.mediaQueries.lg} {
    padding-left: 240px;
  }
`

const ButtonContainer = styled.div`
  margin-left: 1rem;
  display: flex;
`

const VersionBar = () => {
  return (
    <Wrapper>
      <Text color="#000">Version: </Text>

      <ButtonContainer>
        <Button as={Link} external href="https://v1.bitgertswap.com/" scale="sm" variant="text">
          V1
        </Button>
        <Button as={Link} href="/" scale="sm" variant="primary">
          V2
        </Button>
      </ButtonContainer>
    </Wrapper>
  )
}

export default VersionBar
