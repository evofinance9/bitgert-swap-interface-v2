/* eslint-disable */
import React, { useState, useEffect } from 'react'
import swal from 'sweetalert'
import { Button, CardBody, Input, CardHeader, Flex } from '@evofinance9/uikit'
import { Link } from 'react-router-dom'
import { ethers } from 'ethers'

import { TransactionResponse } from '@ethersproject/providers'

import { FaInfoCircle } from 'react-icons/fa'

import { addStakeOwner } from './apicalls'

import { useStakeContract, useDateTimeContract } from 'hooks/useContract'
import { getStakeContract, getTokenContract, getSigCheckContract } from 'utils'
import { STAKE_ADDRESS } from 'constants/abis/stake'

import './style.css'
import { AppBodyExtended } from 'pages/AppBody'

import { useActiveWeb3React } from 'hooks'
import { Heading, Flex as FlexExtended, InputExtended, ButtonContainer } from './styleds'

import Container from 'components/Container'
import TransactionConfirmationModal from 'components/TransactionConfirmationModal'
import Tooltip from 'components/Tooltip'

export default function Stake() {
  const { account, chainId, library } = useActiveWeb3React()

  const [txHash, setTxHash] = useState<string>('')
  const [owner, setOwner] = useState<string>('')
  const [isOpen, setIsOpen] = useState<boolean>(false)
  const [showConfirm, setShowConfirm] = useState<boolean>(false)
  const [attemptingTxn, setAttemptingTxn] = useState<boolean>(false)
  const [feeTooltip, setFeeTooltip] = useState<boolean>(false)

  const [formData, setFormData] = useState({
    chain_id: '32520',
    owner_address: '',
    token_address: '',
    token_name: '',
    token_symbol: '',
    token_decimal: '',
    reward_token_address: '',
    reward_token_name: '',
    reward_token_symbol: '',
    reward_token_decimal: '',
    bonusEndBlock: '',
    rewardPerBlock: '',
  })

  // destructure
  const {
    token_address,
    token_name,
    token_decimal,
    token_symbol,
    reward_token_address,
    reward_token_name,
    reward_token_decimal,
    reward_token_symbol,
    bonusEndBlock,
    rewardPerBlock,
  } = formData

  useEffect(() => {
    const fetch = async () => {
      if (!library || !account || !chainId || !token_address || !reward_token_address) return

      const sigCheck = getSigCheckContract(chainId, library, account)

      const owner_addr = await sigCheck?.callStatic.superman()
      setOwner(owner_addr)

      const tokenContract = getTokenContract(token_address, library, account)
      const TName = await tokenContract?.callStatic.name()
      const TSymbol = await tokenContract?.callStatic.symbol()
      const TDecimals = await tokenContract?.callStatic.decimals()

      const rewardTokenContract = getTokenContract(reward_token_address, library, account)
      const RTName = await rewardTokenContract?.callStatic.name()
      const RTSymbol = await rewardTokenContract?.callStatic.symbol()
      const RTDecimals = await rewardTokenContract?.callStatic.decimals()

      setFormData((prev) => ({
        ...prev,
        token_name: TName,
        token_symbol: TSymbol,
        token_decimal: TDecimals,
        reward_token_name: RTName,
        reward_token_symbol: RTSymbol,
        reward_token_decimal: RTDecimals,
      }))
    }
    if (account && library instanceof ethers.providers.Web3Provider) {
      fetch()
    }
  }, [token_address, reward_token_address, account, library])

  const handleDismissConfirmation = () => {
    setIsOpen(false)
    setShowConfirm(false)
    setTxHash('')
  }

  const handleChange = (name) => (event) => {
    const value = event.target.value
    setFormData({ ...formData, [name]: value })
  }

  const handleDateChange = (name, value) => {
    setFormData({ ...formData, [name]: value })
  }

  const createStake = async (formData) => {
    if (!chainId || !library || !account) return

    const stake = getSigCheckContract(chainId, library, account)

    const payload = [
      STAKE_ADDRESS,
      'add(address,address,uint256,uint256)',
      token_address,
      reward_token_address,
      bonusEndBlock,
      rewardPerBlock,
    ]

    const method: (...args: any) => Promise<TransactionResponse> =
      stake['submitTransaction(address,string,address,address,uint256,uint256)']
    const args: Array<object | string[] | string | boolean | number> = payload

    setAttemptingTxn(true)
    setIsOpen(true)

    await method(...args)
      .then(async (response: any) => {
        const txReceipt = await response.wait()
        const stakeID = txReceipt.events[0].args.txIndex.toNumber()
        setAttemptingTxn(false)
        setTxHash(response.hash)

        addStakeOwner({ ...formData, owner_address: account, stakeOwner_id: stakeID, stakeCreator_id: account })
          .then((data) => {
            if (data.error) {
              swal('Oops', 'Something went wrong!', 'error')
            } else {
              setFormData({
                ...formData,
                chain_id: '32520',
                owner_address: '',
                token_address: '',
                token_name: '',
                token_symbol: '',
                token_decimal: '',
                reward_token_address: '',
                reward_token_name: '',
                reward_token_symbol: '',
                reward_token_decimal: '',
                bonusEndBlock: '',
                rewardPerBlock: '',
              })
              swal('Congratulations!', 'Stake is Created! It will be live soon!', 'success')
            }
          })
          .catch((err) => console.log(`error is ${err}`))
      })
      .catch((e) => {
        setAttemptingTxn(false)
        // we only care if the error is something _other_ than the user rejected the tx
        if (e?.code !== 'ACTION_REJECTED') {
          console.error(e)
          alert(e.message)
        }
      })
  }

  const handleSubmit = (e) => {
    e.preventDefault()

    if (!account) {
      swal('Are you sure?', 'There are incomplete fields in your submission!', 'warning')
      return
    }

    createStake(formData)
  }

  return (
    <>
      <Container>
        <AppBodyExtended>
          <TransactionConfirmationModal
            isOpen={isOpen}
            onDismiss={handleDismissConfirmation}
            attemptingTxn={attemptingTxn}
            hash={txHash}
            content={() => <></>}
            pendingText="Please wait..."
          />
          <CardHeader>
            <Flex alignItems={'center'} justifyContent={'space-between'}>
              <Heading>Create Stake</Heading>
              <Tooltip show={feeTooltip} placement="right" text="Create a token to be eligible for staking">
                <FaInfoCircle onMouseEnter={() => setFeeTooltip(true)} onMouseLeave={() => setFeeTooltip(false)} />
              </Tooltip>
            </Flex>
          </CardHeader>
          <CardBody>
            <FlexExtended>
              <InputExtended
                placeholder="Stake Token Address"
                className="mt-3"
                scale="lg"
                value={token_address}
                onChange={handleChange('token_address')}
              />
              <InputExtended
                placeholder="Stake Token Name"
                scale="lg"
                className="mt-3"
                value={token_name}
                onChange={handleChange('token_name')}
              />
            </FlexExtended>
            <FlexExtended>
              <InputExtended
                placeholder="Stake Token Symbol"
                scale="lg"
                className="mt-3"
                value={token_symbol}
                onChange={handleChange('token_symbol')}
              />
              <InputExtended
                placeholder="Stake Token Decimal"
                className="mt-3"
                scale="lg"
                value={token_decimal}
                onChange={handleChange('token_decimal')}
              />
            </FlexExtended>
            <FlexExtended>
              <InputExtended
                placeholder="Reward Token Address"
                className="mt-3"
                scale="lg"
                value={reward_token_address}
                onChange={handleChange('reward_token_address')}
              />
              <InputExtended
                placeholder="Reward Token Name"
                scale="lg"
                className="mt-3"
                value={reward_token_name}
                onChange={handleChange('reward_token_name')}
              />
            </FlexExtended>
            <FlexExtended>
              <InputExtended
                placeholder="Reward Token Symbol"
                scale="lg"
                className="mt-3"
                value={reward_token_symbol}
                onChange={handleChange('reward_token_symbol')}
              />
              <InputExtended
                placeholder="Reward Token Decimal"
                className="mt-3"
                scale="lg"
                value={reward_token_decimal}
                onChange={handleChange('reward_token_decimal')}
              />
            </FlexExtended>
            <FlexExtended>
              <InputExtended
                placeholder="Bonus End Block"
                className="mt-3"
                scale="lg"
                value={bonusEndBlock}
                onChange={handleChange('bonusEndBlock')}
              />
              <InputExtended
                placeholder="Reward Per Block"
                className="mt-3"
                scale="lg"
                value={rewardPerBlock}
                onChange={handleChange('rewardPerBlock')}
              />
            </FlexExtended>
          </CardBody>

          <ButtonContainer>
            <Button onClick={handleSubmit}>Submit</Button>
            <Link to={`/create-stakes`}>
              <Button>Back</Button>
            </Link>
          </ButtonContainer>
        </AppBodyExtended>
      </Container>
      <div className="mt-5"> </div>
    </>
  )
}
