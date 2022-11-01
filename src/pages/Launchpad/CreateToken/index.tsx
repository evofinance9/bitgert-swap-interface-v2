/* eslint-disable */
import React, { useState, useEffect } from 'react'
import { ethers, BigNumber as BN } from 'ethers'
import { TransactionResponse } from '@ethersproject/providers'
import { BigNumber } from '@ethersproject/bignumber'
import { Button, CardHeader, CardBody, Flex } from '@evofinance9/uikit'

import { useActiveWeb3React } from 'hooks'
import { getTokenCreatorContract, bnMultiplyByDecimal } from 'utils'

import Container from 'components/Container'
import TransactionConfirmationModal from 'components/TransactionConfirmationModal'
import { FaInfoCircle } from 'react-icons/fa'
import Tooltip from 'components/Tooltip'

import { AppBodyExtended } from 'pages/AppBody'

import { InputExtended, Heading, ButtonContainer, List, ListItem } from './styleds'

const CreateToken = () => {
  const { account, chainId, library } = useActiveWeb3React()

  const [txHash, setTxHash] = useState<string>('')
  const [showConfirm, setShowConfirm] = useState<boolean>(false)
  const [attemptingTxn, setAttemptingTxn] = useState<boolean>(false)
  const [success, setSuccess] = useState<boolean>(false)
  const [currentFee, setCurrentFee] = useState('0')
  const [tokenAddress, setTokenAddress] = useState<string>('')
  const [feeTooltip, setFeeTooltip] = useState<boolean>(false)

  const [formData, setFormData] = useState({
    token_name: '',
    token_symbol: '',
    token_decimal: '',
    total_supply: '',
  })

  const { token_name, token_symbol, token_decimal, total_supply } = formData

  const handleChange = (name) => (event) => {
    const value = event.target.value
    setFormData({ ...formData, [name]: value })
  }

  const handleDismissConfirmation = () => {
    setShowConfirm(false)
    setTxHash('')
  }

  const createToken = async () => {
    if (!chainId || !library || !account) return
    const tokenCreator = getTokenCreatorContract(chainId, library, account)

    const payload = [
      token_name,
      token_symbol,
      token_decimal,
      ethers.utils.parseUnits(total_supply, parseInt(token_decimal)).toString(),
    ]

    const method: (...args: any) => Promise<TransactionResponse> = tokenCreator!.createToken
    const args: Array<string | number | boolean> = payload
    const value: BigNumber = ethers.utils.parseEther(`${currentFee}`)

    setAttemptingTxn(true)
    await method(...args, {
      value: value,
    })
      .then(async (response) => {
        setAttemptingTxn(false)
        setTxHash(response.hash)
        const txReceipt: any = await response.wait()
        setTokenAddress(txReceipt?.events[2]?.args?.token)
        setSuccess(true)
      })
      .catch((e) => {
        setAttemptingTxn(false)
        // we only care if the error is something _other_ than the user rejected the tx
        if (e?.code !== 4001) {
          console.error(e)
          setSuccess(false)
          alert(e.message)
        }
      })
  }

  useEffect(() => {
    if (!chainId || !library || !account) return
    const fetch = async () => {
      const tokenCreator = getTokenCreatorContract(chainId, library, account)
      const fee = await tokenCreator?.callStatic.fee()
      setCurrentFee(ethers.utils.formatEther(fee.toString()))
    }
    fetch()
  }, [chainId, library, account])

  return (
    <>
      <Container>
        {txHash && (
          <TransactionConfirmationModal
            isOpen={true}
            onDismiss={handleDismissConfirmation}
            attemptingTxn={false}
            hash={txHash}
            content={() => (
              <>
                <p>Token Address </p>
              </>
            )}
            pendingText={''}
          />
        )}
        <AppBodyExtended>
          <CardHeader>
            <Flex alignItems={'center'} justifyContent={'space-between'}>
              <Heading>Create BRC20 Token</Heading>
              <Tooltip show={feeTooltip} placement="right" text="Fee: 200000000 BRISE">
                <FaInfoCircle onMouseEnter={() => setFeeTooltip(true)} onMouseLeave={() => setFeeTooltip(false)} />
              </Tooltip>
            </Flex>
          </CardHeader>

          <CardBody>
            {success ? (
              <div>
                <div className="col-md-6 mb-3">
                  <List>
                    <ListItem>Token: {tokenAddress}</ListItem>
                    <ListItem>Name: {token_name}</ListItem>
                    <ListItem>Symbol: {token_symbol}</ListItem>
                    <ListItem>Decimal: {token_decimal} </ListItem>
                    <ListItem>Total Supply: {total_supply} </ListItem>
                  </List>
                </div>
              </div>
            ) : (
              <>
                <InputExtended
                  placeholder="Name"
                  className="mt-3"
                  scale="lg"
                  value={token_name}
                  onChange={handleChange('token_name')}
                />

                <InputExtended
                  placeholder="Symbol"
                  className="mt-3"
                  scale="lg"
                  value={token_symbol}
                  onChange={handleChange('token_symbol')}
                />

                <InputExtended
                  placeholder="Decimals"
                  className="mt-3"
                  scale="lg"
                  value={token_decimal}
                  onChange={handleChange('token_decimal')}
                />

                <InputExtended
                  placeholder="Total supply"
                  className="mt-3"
                  scale="lg"
                  value={total_supply}
                  onChange={handleChange('total_supply')}
                />

                <ButtonContainer>
                  <Button onClick={createToken}>Create Token</Button>
                </ButtonContainer>
              </>
            )}
          </CardBody>
        </AppBodyExtended>
      </Container>
    </>
  )
}

export default CreateToken
