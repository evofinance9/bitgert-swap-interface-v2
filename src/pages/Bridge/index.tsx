import React, { useEffect, useState } from 'react'

import { BigNumber } from '@ethersproject/bignumber'
import { ethers } from 'ethers'
import { TransactionResponse } from '@ethersproject/providers'
import { Token } from '@evofinance9/sdk'
import { Text, CardBody, IconButton, ArrowDownIcon, Button } from '@evofinance9/uikit'

import Card from 'components/Card'
import Container from 'components/Container'
import PageHeader from 'components/PageHeader'
import { AutoRow, RowBetween } from 'components/Row'
import { AutoColumn } from 'components/Column'
import { Input as NumericalInput } from 'components/NumericalInput'
import { ArrowWrapper, Wrapper } from 'components/swap/styleds'
import TransactionConfirmationModal from 'components/TransactionConfirmationModal'

import { useActiveWeb3React } from 'hooks'

import { getBriseBridgeContract, getBscBridgeContract } from 'utils'
import { useTransactionAdder } from '../../state/transactions/hooks'

import ApproveButton from './ApproveButton'

import AppBody from '../AppBody'
import { InputRow, CurrencySelect, LabelRow, Aligner, InputPanel, Container as ContainerExt } from './styleds'
import { valuesProps } from './types'

const Bridge = () => {
  const { account, chainId, library } = useActiveWeb3React()
  const briseERC20 = chainId ? new Token(chainId, '0x8FFf93E810a2eDaaFc326eDEE51071DA9d398E83', 9) : null
  const addTransaction = useTransactionAdder()

  const [values, setValues] = useState<valuesProps>({
    input: 0,
    output: 0,
  })

  const [txHash, setTxHash] = useState<string>('')
  const [showConfirm, setShowConfirm] = useState<boolean>(false)
  const [attemptingTxn, setAttemptingTxn] = useState<boolean>(false)
  const [isOpen, setIsOpen] = useState<boolean>(false)
  const [showSettings] = useState<boolean>(true)
  const [hideSllipage] = useState<boolean>(true)

  const [isBnb, setIsBnb] = useState<boolean>(false)

  const handleChangeInput = (val: number) => {
    setValues({ input: val, output: val - val * (5 / 10000) })
  }

  const handleDismissConfirmation = () => {
    setIsOpen(false)
    setShowConfirm(false)
    setTxHash('')
  }

  const initiateBrise = async () => {
    if (!chainId || !library || !account) return
    if (!values.input || values.input < 10000000 || values.input > 500000000) return

    const briseBridgeContract = getBriseBridgeContract(library, account)

    const method: (...args: any) => Promise<TransactionResponse> = briseBridgeContract!.initiate
    const args: Array<string> = []
    const value: BigNumber = ethers.utils.parseUnits(values.input.toString(), 'ether')

    setAttemptingTxn(true)
    setIsOpen(true)

    await method(...args, { value })
      .then((response) => {
        setAttemptingTxn(false)
        setTxHash(response.hash)
        addTransaction(response, {
          summary: "Bridged Brise to BSC"
        })
      })
      .catch((e) => {
        setAttemptingTxn(false)
        // we only care if the error is something _other_ than the user rejected the tx
        if (e?.code !== 4001) {
          console.error(e)
          alert(e.message)
        }
      })
  }

  const initiateBsc = async (amount: string) => {
    if (!chainId || !library || !account) return
    if (!values.input || parseFloat(amount) < 10000000 || parseFloat(amount) > 500000000) return

    const bscBridgeContract = getBscBridgeContract(library, account)

    const method: (...args: any) => Promise<TransactionResponse> = bscBridgeContract!.initiate
    const args: Array<string> = [amount]
    const value: BigNumber | null = null

    setAttemptingTxn(true)
    setIsOpen(true)

    await method(...args, value ? { value } : {})
      .then((response) => {
        setAttemptingTxn(false)
        setTxHash(response.hash)
        addTransaction(response, {
          summary: "Bridged BSC to Brise"
        })
      })
      .catch((e) => {
        setAttemptingTxn(false)
        // we only care if the error is something _other_ than the user rejected the tx
        if (e?.code !== 4001) {
          console.error(e)
          alert(e.message)
        }
      })
  }

  useEffect(() => {
    if (chainId === 56 || chainId === 97) {
      setIsBnb(true)
    }
  }, [chainId])

  useEffect(() => {
    async function checkAndSetNetwork() {
      if (!window.ethereum) return
      try {
        await window.ethereum.request({
          method: 'wallet_switchEthereumChain',
          params: [{ chainId: ethers.utils.hexlify(56) }],
        })
      } catch (err) {
        // This error code indicates that the chain has not been added to MetaMask
        if (err) {
          await window.ethereum.request({
            method: 'wallet_addEthereumChain',
            params: [
              {
                chainName: 'Binance Smart Chain',
                chainId: ethers.utils.hexlify(56),
                nativeCurrency: { name: 'BNB', decimals: 18, symbol: 'BNB' },
                rpcUrls: ['https://bsc-dataseed.binance.org/'],
              },
            ],
          })
        }
      }
    }

    if (isBnb === true) {
      checkAndSetNetwork()
    }
  }, [isBnb])

  return (
    <Container>
      <TransactionConfirmationModal
        isOpen={isOpen}
        onDismiss={handleDismissConfirmation}
        attemptingTxn={attemptingTxn}
        hash={txHash}
        content={() => <></>}
        pendingText="It may take 5-20 minutes to receive. Please wait..."
      />

      <AppBody>
        <Wrapper id="swap-page">
          <PageHeader title="Bridge" description="Bridge tokens in an instant" showSettings={showSettings} hideSllipage={hideSllipage} />
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
                      type="number"
                      value={values.input}
                      onUserInput={(val) => {
                        handleChangeInput(parseFloat(val) || 0)
                      }}
                    />
                    <CurrencySelect selected={false}>
                      <Aligner>
                        <Text id="pair" color="#000">
                          {isBnb ? 'BNB Chain' : 'BRISE Chain'}
                        </Text>
                      </Aligner>
                    </CurrencySelect>
                  </InputRow>
                </ContainerExt>
              </InputPanel>
            </AutoColumn>
            <AutoColumn justify="space-between">
              <AutoRow justify="center" style={{ padding: '0 1rem', margin: '1rem 0' }}>
                <ArrowWrapper clickable>
                  <IconButton
                    variant="tertiary"
                    onClick={() => {
                      setIsBnb((prev) => !prev)
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
                      value={values.output}
                      type="number"
                      onUserInput={(val) => {
                        // handleChangeInput(parseFloat(val))
                      }}
                    />
                    <CurrencySelect selected={false}>
                      <Aligner>
                        <Text id="pair" color="#000">
                          {isBnb ? 'BRISE Chain' : 'BNB Chain'}
                        </Text>
                      </Aligner>
                    </CurrencySelect>
                  </InputRow>
                </ContainerExt>
              </InputPanel>
            </AutoColumn>

            <Card padding="1rem .75rem 0 .75rem" borderRadius="20px">
              <AutoColumn gap="4px" />
            </Card>
            {isBnb && briseERC20 && (values.input >= 10000000 && values.input <= 500000000) && (
              <ApproveButton token={briseERC20} amount={values.input} func={initiateBsc} />
            )}
            {!isBnb && (
              <Button
                style={{ width: '100%', margin: '1rem 0 0 0' }}
                onClick={initiateBrise}
                disabled={!(values.input >= 10000000 && values.input <= 500000000)}
              >
                Enter
              </Button>
            )}
            <Card padding="1rem .75rem 0 .75rem" borderRadius="20px">
              <AutoColumn gap="4px">
                <Text fontSize="15px" color="#000">
                  Note
                </Text>

                <RowBetween align="center">
                  <Text fontSize="14px" color="#333">
                    Fee
                  </Text>
                  <Text fontSize="14px" color="#333">
                    0.05%
                  </Text>
                </RowBetween>
                <RowBetween align="center">
                  <Text fontSize="14px" color="#333">
                    Minimum amount
                  </Text>
                  <Text fontSize="14px" color="#333">
                    10000000 BRISE
                  </Text>
                </RowBetween>

                <RowBetween align="center">
                  <Text fontSize="14px" color="#333">
                    Maximum amount
                  </Text>
                  <Text fontSize="14px" color="#333">
                    500000000 BRISE
                  </Text>
                </RowBetween>
              </AutoColumn>
            </Card>
          </CardBody>
        </Wrapper>
      </AppBody>
    </Container>
  )
}

export default Bridge
