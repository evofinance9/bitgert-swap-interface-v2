/* eslint-disable */
import React, { useState, useEffect } from 'react'
import swal from 'sweetalert'
import { Button, CardBody, Input, CardHeader } from '@evofinance9/uikit'
import { Link } from 'react-router-dom'
import { TransactionResponse } from '@ethersproject/providers'

import { FaInfoCircle } from 'react-icons/fa'

import { Heading, Flex, Text } from './styleds'

import { useStakeContract, useDateTimeContract } from 'hooks/useContract'
import { getStakeContract, getTokenContract, getSigCheckContract } from 'utils'

import './style.css'
import { AppBodyExtended } from 'pages/AppBody'

import { useActiveWeb3React } from 'hooks'

import Container from 'components/Container'
import TransactionConfirmationModal from 'components/TransactionConfirmationModal'
import Tooltip from 'components/Tooltip'

export default function Stake() {
  const { account, chainId, library } = useActiveWeb3React()
  const [txHash, setTxHash] = useState<string>('')
  const [owner, setOwner] = useState<string>('')
  const [ownerFlag, setOwnerFlag] = useState<boolean>(false)
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
    allocated_owner: '',
  })

  // destructure
  const { allocated_owner } = formData

  useEffect(() => {
    const fetch = async () => {
      if (!chainId || !library || !account) return
      const stake = getSigCheckContract(chainId, library, account)

      const owner_addr = await stake?.callStatic.superman()
      setOwner(owner_addr)

      const approved_owner = await stake?.callStatic.isOwner(account)
      setOwnerFlag(approved_owner)
    }

    fetch()
  }, [account, library])

  const handleDismissConfirmation = () => {
    setIsOpen(false)
    setShowConfirm(false)
    setTxHash('')
  }

  const handleChange = (name) => (event) => {
    const value = event.target.value
    setFormData({ ...formData, [name]: value })
  }

  const handleAddOwner = async () => {
    if (!chainId || !library || !account) return
    const stake = getSigCheckContract(chainId, library, account)

    const payload = [allocated_owner]

    const method: (...args: any) => Promise<TransactionResponse> = stake!.addOwners
    const args: Array<object | string[] | string | boolean | number> = payload

    setAttemptingTxn(true)
    setIsOpen(true)

    await method(...args)
      .then((response) => {
        setFormData({
          ...formData,
          chain_id: '32520',
          owner_address: '',
          token_address: '',
          token_name: '',
          token_symbol: '',
          token_decimal: '',
          allocated_owner: '',
        })
        swal('Congratulations!', 'Given Allocated owner has been added!', 'success')
        setAttemptingTxn(false)
        setTxHash(response.hash)
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

  const handleRemoveOwner = async () => {
    if (!chainId || !library || !account) return
    const stake = getSigCheckContract(chainId, library, account)

    const payload = [allocated_owner]

    const method: (...args: any) => Promise<TransactionResponse> = stake!.removeOwners
    const args: Array<object | string[] | string | boolean | number> = payload

    setAttemptingTxn(true)
    setIsOpen(true)

    await method(...args)
      .then((response) => {
        setFormData({
          ...formData,
          chain_id: '32520',
          owner_address: '',
          token_address: '',
          token_name: '',
          token_symbol: '',
          token_decimal: '',
          allocated_owner: '',
        })
        swal('Congratulations!', 'Given Allocated owner has been removed!', 'success')
        setAttemptingTxn(false)
        setTxHash(response.hash)
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
            <Heading>Staking Pools</Heading>
          </CardHeader>

          {account && (owner === account || ownerFlag) && (
            <>
              <Flex direction="column" margin="2rem">
                <Text>Make a token eligible for staking!</Text>
                <Button>
                  <Link to={`/create-stakes/owner`}>Create Staking Pool</Link>
                </Button>
              </Flex>
              <Flex direction="column" margin="0 0 2rem 0">
                <Text>View all User requests For staking!</Text>
                <Link to={`/stake`}>
                  <Button>User Stake Requests</Button>
                </Link>
              </Flex>
              {owner === account && (
                <>
                  <Flex direction="column" margin="2rem">
                    <Text>View all Owner requests For staking!</Text>
                    <Link to={`/stakeCreated`}>
                      <Button>Owner Stake Requests</Button>
                    </Link>
                  </Flex>
                  <Flex justifyContent="space-between" margin="2rem">
                    <Input
                      placeholder="Allocated Owner"
                      className="mt-3"
                      scale="lg"
                      value={allocated_owner}
                      onChange={handleChange('allocated_owner')}
                    />
                    <Tooltip show={feeTooltip} placement="top" text={` Owner can be either added in farms or stakes `}>
                      <FaInfoCircle
                        className="mx-2"
                        color="grey"
                        onMouseEnter={() => setFeeTooltip(true)}
                        onMouseLeave={() => setFeeTooltip(false)}
                      />
                    </Tooltip>
                  </Flex>

                  <Flex justifyContent="center" margin="0 0 2rem 0">
                    <Button onClick={handleAddOwner}>Add Owners</Button>
                    <Button onClick={handleRemoveOwner}>Remove Owners</Button>
                  </Flex>
                </>
              )}
              <Flex direction="column" margin="2rem">
                <Text>View all Existing stakes!</Text>
                <Link to={`/stakeApproved`}>
                  <Button>Existing Stakes</Button>
                </Link>
              </Flex>
            </>
          )}
          {account && owner !== account && !ownerFlag && (
            <>
              <Flex direction="column" margin="3rem 0">
                <Text>Raise a request to create your token eligible for staking!</Text>
                <Link to={`/create-stakes/user`}>
                  <Button>Create Staking Pool</Button>
                </Link>
              </Flex>
              <Flex direction="column" margin="0 0 3rem 0">
                <Text>View all stakes! Invest to earn more!</Text>
                <Link to={`/stakeApproved`}>
                  <Button>Staking Pools</Button>
                </Link>
              </Flex>
            </>
          )}
        </AppBodyExtended>
      </Container>
      <div className="mt-5"> </div>
    </>
  )
}
