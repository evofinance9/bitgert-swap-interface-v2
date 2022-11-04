/* eslint-disable */
import React, { useState, useEffect } from 'react'
import swal from 'sweetalert'
import { Button, CardBody, Input, CardHeader } from '@evofinance9/uikit'
import { Link } from 'react-router-dom'
// import { ethers } from 'ethers'

// import { BigNumber } from '@ethersproject/bignumber'
// import { DateTimePicker } from '@material-ui/pickers'
import { TextField, withStyles } from '@material-ui/core'
import { TransactionResponse } from '@ethersproject/providers'

import { FaInfoCircle } from 'react-icons/fa'

// import addStake from './apicalls'
import { Heading, Flex } from './styleds'

import { useStakeContract, useDateTimeContract } from 'hooks/useContract'
import { getStakeContract, getTokenContract, getSigCheckContract } from 'utils'
// import getUnixTimestamp from 'utils/getUnixTimestamp'

import './style.css'
import { AppBodyExtended } from 'pages/AppBody'

import { useActiveWeb3React } from 'hooks'

import Container from 'components/Container'
import TransactionConfirmationModal from 'components/TransactionConfirmationModal'
import Tooltip from 'components/Tooltip'

const CssTextField = withStyles({
  root: {
    '&': {
      border: 'red',
      borderRadius: '16px',
    },
    '& label.Mui-focused': {
      color: '#aaa',
    },

    '& .MuiInputBase-input': {
      color: '#F4EEFF',
      backgroundColor: '#18191A',
      borderRadius: '16px',
      boxShadow: 'inset 0px 2px 2px -1px rgb(74 74 104 / 10%)',
      display: 'block',
      fontSize: '16px',
      height: '48px',
      outline: '0',
      padding: '0 16px',
    },
    '& .MuiInputBase-input:focus': {
      boxShadow: '0px 0px 0px 1px #7645D9,0px 0px 0px 4pxrgba(118,69,217,0.6)',
    },
  },
})(TextField)

export default function Stake() {
  const { account, chainId, library } = useActiveWeb3React()
  // const stakeContract = useStakeContract(true)

  // const dateTimeContract = useDateTimeContract()

  const [txHash, setTxHash] = useState<string>('')
  const [owner, setOwner] = useState<string>('')
  const [ownerFlag, setOwnerFlag] = useState<boolean>(false)
  const [isOpen, setIsOpen] = useState<boolean>(false)
  const [showConfirm, setShowConfirm] = useState<boolean>(false)
  const [attemptingTxn, setAttemptingTxn] = useState<boolean>(false)
  // const [allowcationTooltip, setAllowcationTooltip] = useState<boolean>(false)
  // const [allowcationAmountTooltip, setAllowcationAmountTooltip] = useState<boolean>(false)
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
  const {
    token_address,
    token_name,
    token_decimal,
    token_symbol,
    allocated_owner,
  } = formData

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

  const handleDateChange = (name, value) => {
    setFormData({ ...formData, [name]: value })
  }

  const handleAddOwner = async () => {
    if (!chainId || !library || !account) return
    const stake = getSigCheckContract(chainId, library, account)

    const payload = [
      allocated_owner
    ]

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
        if (e?.code !== "ACTION_REJECTED") {
          console.error(e)
          alert(e.message)
        }
      })
  }

  const handleRemoveOwner = async () => {
    if (!chainId || !library || !account) return
    const stake = getSigCheckContract(chainId, library, account)

    const payload = [
      allocated_owner
    ]

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
        if (e?.code !== "ACTION_REJECTED") {
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
          {/* <CardHeader className="d-flex justify-content-between"> */}
          <Heading>
            Stakes
          </Heading>
          {/* </CardHeader> */}

          {account && (owner===account || ownerFlag) && (
          <>
            {/* <div className="d-flex justify-content-around my-5"> */}
            <Flex justifyContent="space-around" margin="3rem">
              <h1>Make a token eligible for staking!</h1>
            </Flex>
            {/* <div className="d-flex justify-content-around my-5"> */}
            <Flex justifyContent="space-around" margin="3rem">
              <Button >
              <Link to={`/create-stakes/owner`}>
                Create Stake
              </Link>
              </Button>
            </Flex>
            {/* <div className="d-flex justify-content-around my-5"> */}
            <Flex justifyContent="space-around" margin="3rem">
              <h1>View all User requests For staking!</h1>
              </Flex>
            {/* <div className="d-flex justify-content-around my-5"> */}
            <Flex justifyContent="space-around" margin="3rem">
              <Link to={`/stake`}>
              <Button >
                User Stake Requests
              </Button>
              </Link>
            </Flex>
          { owner===account && (
            <>
            {/* <div className="d-flex justify-content-around my-5"> */}
            <Flex justifyContent="space-around" margin="3rem">
              <h1>View all Owner requests For staking!</h1>
            </Flex>
            {/* <div className="d-flex justify-content-around my-5"> */}
            <Flex justifyContent="space-around" margin="3rem">
              <Link to={`/stakeCreated`}>
              <Button >
                Owner Stake Requests
              </Button>
              </Link>
            </Flex>
              {/* <div className="d-flex justify-content-between mb-5"> */}
            <Flex justifyContent="space-between" margin="3rem">
              <Input
                placeholder="Allocated Owner"
                className="mt-3"
                scale="lg"
                value={allocated_owner}
                onChange={handleChange('allocated_owner')}
              />
              <Tooltip show={feeTooltip} placement="top" text={` Owner can be either added in farms or stakes `}>
              <FaInfoCircle
                className="mx-2" color='grey'
                onMouseEnter={() => setFeeTooltip(true)}
                onMouseLeave={() => setFeeTooltip(false)}
              />
              </Tooltip>
            </Flex>

              {/* <div className="d-flex justify-content-around mb-5"> */}
              <Flex justifyContent="space-around" margin="3rem">
                <Button onClick={handleAddOwner}>Add Owners</Button>
                <Button onClick={handleRemoveOwner}>Remove Owners</Button>
              </Flex>
            </>
          )}
          {/* <div className="d-flex justify-content-around my-5"> */}
          <Flex justifyContent="space-around" margin="3rem">
            <h1>View all Existing stakes!</h1>
          </Flex>
          {/* <div className="d-flex justify-content-around my-5"> */}
          <Flex justifyContent="space-around" margin="3rem">
            <Link to={`/stakeApproved`}>
            <Button >
              Existing Stakes
            </Button>
            </Link>
          </Flex>
          </>
          )} 
          {account && owner!==account && !ownerFlag && (
          <>
          {/* <div className="d-flex justify-content-around my-5"> */}
          <Flex justifyContent="space-around" margin="3rem">
            <h1>Raise a request to create your token eligible for staking!</h1>
          </Flex>
          {/* <div className="d-flex justify-content-around my-5"> */}
          <Flex justifyContent="space-around" margin="3rem">
            <Link to={`/create-stakes/user`}>
            <Button >
              Create Stake
            </Button>
            </Link>
          </Flex>
          {/* <div className="d-flex justify-content-around my-5"> */}
          <Flex justifyContent="space-around" margin="3rem">
            <h1>View all stakes! Invest to earn more!</h1>
          </Flex>
          {/* <div className="d-flex justify-content-around my-5"> */}
          <Flex justifyContent="space-around" margin="3rem">
            <Link to={`/stakeApproved`}>
            <Button >
              Stakes
            </Button>
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
