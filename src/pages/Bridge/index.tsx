import React, { useState } from 'react'

import { Text, CardBody, IconButton, ArrowDownIcon, Button } from '@evofinance9/uikit'

import Container from 'components/Container'
import PageHeader from 'components/PageHeader'
import { AutoRow, RowBetween } from 'components/Row'
import { AutoColumn } from 'components/Column'
import { Input as NumericalInput } from 'components/NumericalInput'
import { ArrowWrapper , Wrapper } from 'components/swap/styleds'

import AppBody from '../AppBody'

import { InputRow, CurrencySelect, LabelRow, Aligner, InputPanel, Container as ContainerExt } from './styleds'

const Bridge = () => {
  const [value, setValue] = useState<number>(0)
  return (
    <Container>
      <AppBody>
        <Wrapper id="swap-page">
          <PageHeader title="Bridge" description="Bridge tokens in an instant" showSettings={false} />
          <CardBody>
            <AutoColumn gap="md">
              <InputPanel id="input_panel_1">
                <ContainerExt hideInput={false}>
                  <LabelRow>
                    <RowBetween>
                      <Text fontSize="14px" color="textSubtle">
                        From
                      </Text>
                    </RowBetween>
                  </LabelRow>
                  <InputRow selected={false}>
                    <NumericalInput
                      className="token-amount-input-1"
                      value={value}
                      onUserInput={(val) => {
                        setValue(parseFloat(val))
                      }}
                    />
                    <CurrencySelect selected={false}>
                      <Aligner>
                        <Text id="pair" color="#000">
                          BRISE Chain
                        </Text>
                      </Aligner>
                    </CurrencySelect>
                  </InputRow>
                </ContainerExt>
              </InputPanel>
            </AutoColumn>

            <AutoColumn justify="space-between">
              <AutoRow justify="center" style={{ padding: '0 1rem', margin: "1rem 0" }}>
                <ArrowWrapper clickable>
                  <IconButton
                    variant="tertiary"
                    onClick={() => {
                      // setApprovalSubmitted(false)
                      // onSwitchTokens()
                    }}
                    style={{ borderRadius: '50%' }}
                    scale="sm"
                  >
                    <ArrowDownIcon color="primary" width="24px" />
                  </IconButton>
                </ArrowWrapper>
              </AutoRow>
            </AutoColumn>

            <AutoColumn gap="md">
              <InputPanel id="input_panel_2">
                <ContainerExt hideInput={false}>
                  <LabelRow>
                    <RowBetween>
                      <Text fontSize="14px" color="textSubtle">
                        To
                      </Text>
                    </RowBetween>
                  </LabelRow>
                  <InputRow selected={false}>
                    <NumericalInput
                      className="token-amount-input-2"
                      value={value}
                      onUserInput={(val) => {
                        setValue(parseFloat(val))
                      }}
                    />
                    <CurrencySelect selected={false}>
                      <Aligner>
                        <Text id="pair" color="#000">
                          BNB Chain
                        </Text>
                      </Aligner>
                    </CurrencySelect>
                  </InputRow>
                </ContainerExt>
              </InputPanel>
            </AutoColumn>

            <Button style={{ width: "100%", margin: "2rem 0 0 0"}}>Enter</Button>
          </CardBody>
        </Wrapper>
      </AppBody>
    </Container>
  )
}

export default Bridge
