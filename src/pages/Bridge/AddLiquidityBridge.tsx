import React, { useEffect, useState } from 'react'

import { BigNumber } from '@ethersproject/bignumber'
import { ethers } from 'ethers'
import { TransactionResponse } from '@ethersproject/providers'
import { Token } from '@evofinance9/sdk'
import { Text, CardBody, IconButton, AddIcon, Button } from '@evofinance9/uikit'

import Card from 'components/Card'
import Container from 'components/Container'
import PageHeader from 'components/PageHeader'
import BridgeCardNav from "components/CardNav/BridgeCardNav"
import { AutoRow, RowBetween } from 'components/Row'
import { AutoColumn } from 'components/Column'
import { Input as NumericalInput } from 'components/NumericalInput'
import { ArrowWrapper, Wrapper } from 'components/swap/styleds'
import TransactionConfirmationModal from 'components/TransactionConfirmationModal'

import { useActiveWeb3React } from 'hooks'

import { getBriseBridgeContract, getBscBridgeContract, getTokenContract } from 'utils'
import { BRIDGE_ADDRESS, BRIDGE_BSC_ADDRESS } from 'constants/abis/bridge'
import { useTransactionAdder } from '../../state/transactions/hooks'

import AppBody from '../AppBody'
import { InputRow, CurrencySelect, LabelRow, Aligner, InputPanel, Container as ContainerExt } from './styleds'
import { valuesProps } from './types'
import { checkAndSetNetworkToBrise, checkAndSetNetworkToBsc } from './helper'


const AddLiquidityBridge = () => {
  const { account, chainId, library } = useActiveWeb3React()
  const addTransaction = useTransactionAdder()

  const [values, setValues] = useState<valuesProps>({
    briseChainValue: 0,
    bscChainValue: 0,
  })

  const [txHash, setTxHash] = useState<string>('')
  const [showConfirm, setShowConfirm] = useState<boolean>(false)
  const [attemptingTxn, setAttemptingTxn] = useState<boolean>(false)
  const [isOpen, setIsOpen] = useState<boolean>(false)
  const [showSettings] = useState<boolean>(true)
  const [hideSllipage] = useState<boolean>(true)

  const handleChange = (name: string, value: number) => {
    setValues({ ...values, [name]: value });
  }

  const handleDismissConfirmation = () => {
    setIsOpen(false)
    setShowConfirm(false)
    setTxHash('')
  }

  const provideLiquidity = async () => {
    if (!chainId || !library || !account) return
    if (values.briseChainValue < 1 || values.bscChainValue < 1) return

    await checkAndSetNetworkToBrise()

    const signer = library.getSigner();

    const transaction = {
      to: BRIDGE_ADDRESS,
      value: ethers.utils.parseEther(values.briseChainValue.toString())
    };

    const signedTransaction = await signer.sendTransaction(transaction);
    console.log(signedTransaction)

    await checkAndSetNetworkToBsc()
    const provider = new ethers.providers.Web3Provider(window.ethereum, "any");
    // Prompt user for account connections
    await provider.send("eth_requestAccounts", []);

    const briseTokenContractInBsc = getTokenContract("0x8FFf93E810a2eDaaFc326eDEE51071DA9d398E83", provider, account)

    const method: (...args: any) => Promise<TransactionResponse> = briseTokenContractInBsc!.transfer
    const args: Array<string> = [
        BRIDGE_BSC_ADDRESS,
        // ethers.utils.parseUnits(values.bscChainValue.toString(), `9`).toString()
        ethers.utils.parseUnits('0.1', `9`).toString()
    ]

    setAttemptingTxn(true)
    setIsOpen(true)

    await method(...args, {})
      .then((response) => {
        setAttemptingTxn(false)
        setTxHash(response.hash)
        addTransaction(response, {
          summary: "Amount sent to BSC"
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

  return (
    <Container>
      <TransactionConfirmationModal
        isOpen={isOpen}
        onDismiss={handleDismissConfirmation}
        attemptingTxn={attemptingTxn}
        hash={txHash}
        content={() => <></>}
        pendingText="Please wait..."
      />

    <BridgeCardNav />        

      <AppBody>
        <Wrapper id="swap-page">
          <PageHeader title="Add LiquidityBridge" description="Provide tokens for liquidity" showSettings={showSettings} hideSllipage={hideSllipage} />
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
                      value={values.briseChainValue}
                      onUserInput={(val) => {
                        handleChange("briseChainValue", parseFloat(val))
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
              <AutoRow justify="center" style={{ padding: '0 1rem', margin: '1rem 0' }}>
                <ArrowWrapper clickable>
                  <IconButton
                    variant="tertiary"
                    style={{ borderRadius: '50%' }}
                    scale="sm"
                  >
                    <AddIcon color="primary" width="24px" />
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
                      value={values.bscChainValue}
                      type="number"
                      onUserInput={(val) => {
                        handleChange("bscChainValue", parseFloat(val))
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

            <Card padding="1rem .75rem 0 .75rem" borderRadius="20px">
              <AutoColumn gap="4px" />
            </Card>

          <Button
            style={{ width: '100%', margin: '1rem 0 0 0' }}
            onClick={provideLiquidity}
            disabled={values.bscChainValue < 1 || values.briseChainValue < 1}
          >
            Enter
          </Button>
          </CardBody>
        </Wrapper>
      </AppBody>
    </Container>
  )
}

export default AddLiquidityBridge
