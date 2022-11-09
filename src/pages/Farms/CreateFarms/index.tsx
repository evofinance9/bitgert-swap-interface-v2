/* eslint-disable */
import React, { useState, useEffect } from 'react'
import swal from 'sweetalert'
import { Button, CardBody, Input, CardHeader } from '@evofinance9/uikit'
import { Link } from 'react-router-dom'

import { TransactionResponse } from '@ethersproject/providers'

import { FaInfoCircle } from 'react-icons/fa'

import { getSigCheckContract } from 'utils'

import './style.css'
import { AppBodyExtended } from 'pages/AppBody'

import { useActiveWeb3React } from 'hooks'
import { Heading, Flex, Text, InputExtended } from './styleds'

import Container from 'components/Container'
import TransactionConfirmationModal from 'components/TransactionConfirmationModal'
import Tooltip from 'components/Tooltip'

export default function Farm() {
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
    allocation_point: '',
    allocated_owner: '',
  })

  // destructure
  const { allocated_owner } = formData

  useEffect(() => {
    const fetch = async () => {
      if (!chainId || !library || !account) return
      const farm = getSigCheckContract(chainId, library, account)

      const owner_addr = await farm?.callStatic.superman()
      setOwner(owner_addr)

      const approved_owner = await farm?.callStatic.isOwner(account)
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
    const farm = getSigCheckContract(chainId, library, account)

    const payload = [allocated_owner]

    const method: (...args: any) => Promise<TransactionResponse> = farm!.addOwners
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
    const farm = getSigCheckContract(chainId, library, account)

    const payload = [allocated_owner]

    const method: (...args: any) => Promise<TransactionResponse> = farm!.removeOwners
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
        <TransactionConfirmationModal
          isOpen={isOpen}
          onDismiss={handleDismissConfirmation}
          attemptingTxn={attemptingTxn}
          hash={txHash}
          content={() => <></>}
          pendingText="Please wait..."
        />
        <AppBodyExtended>
          <CardHeader>
            <Heading>Farms</Heading>
          </CardHeader>
          <CardBody>
            {account && (owner === account || ownerFlag) && (
              <>
                <Flex direction="column" margin="2rem">
                  <Text>Make a token eligible for farming!</Text>

                  <Button>
                    <Link to={`/create-farms/owner`}>Create Farm</Link>
                  </Button>
                </Flex>

                <Flex direction="column" margin="0 0 2rem 0">
                  <Text>View all User requests For farming!</Text>
                  <Link to={`/farm`}>
                    <Button>User Farm Requests</Button>
                  </Link>
                </Flex>
                {owner === account && (
                  <>
                    <Flex direction="column" margin="2rem">
                      <Text>View all Owner requests For farming!</Text>
                      <Link to={`/farmCreated`}>
                        <Button>Owner Farm Requests</Button>
                      </Link>
                    </Flex>

                    <Flex justifyContent="space-between" margin="2rem">
                      <InputExtended
                        placeholder="Allocated Owner"
                        className="mt-3"
                        scale="lg"
                        value={allocated_owner}
                        onChange={handleChange('allocated_owner')}
                      />
                      <Tooltip show={feeTooltip} placement="top" text={`Owner can be either added in farms or stakes `}>
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
                <Flex direction="column" margin="3rem">
                  <Text>View all Existing farms!</Text>

                  <Link to={`/farmApproved`}>
                    <Button>Existing Farms</Button>
                  </Link>
                </Flex>
              </>
            )}
            {account && owner !== account && !ownerFlag && (
              <>
                <Flex direction="column" margin="3rem 0">
                  <Text>Raise a request to create your token eligible for farming!</Text>

                  <Link to={`/create-farms/user`}>
                    <Button>Create Farm</Button>
                  </Link>
                </Flex>

                <Flex direction="column" margin="0 0 3rem 0">
                  <Text>View all farms! Invest to earn more!</Text>

                  <Link to={`/farmApproved`}>
                    <Button>Farms</Button>
                  </Link>
                </Flex>
              </>
            )}
          </CardBody>
        </AppBodyExtended>
      </Container>
      <div className="mt-5"> </div>
    </>
  )
}