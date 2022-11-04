/* eslint-disable */
import React, { useState, useEffect } from 'react'
import swal from 'sweetalert'
import { Button, CardBody, Input, CardHeader } from '@evofinance9/uikit'
import { Link } from 'react-router-dom'
import { ethers } from 'ethers'

// import { BigNumber } from '@ethersproject/bignumber'
// import { DateTimePicker } from '@material-ui/pickers'
import { TextField, withStyles } from '@material-ui/core'
import { TransactionResponse } from '@ethersproject/providers'

import { FaInfoCircle } from 'react-icons/fa'

import { addStakeOwner } from './apicalls'

import { useStakeContract, useDateTimeContract } from 'hooks/useContract'
import { getStakeContract, getTokenContract, getSigCheckContract } from 'utils'
import { STAKE_ADDRESS } from 'constants/abis/stake'
// import getUnixTimestamp from 'utils/getUnixTimestamp'

import './style.css'
import { AppBodyExtended } from 'pages/AppBody'

import { useActiveWeb3React } from 'hooks'
import { Heading, Flex } from './styleds'

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
  const stakeContract = useStakeContract(true)

  const dateTimeContract = useDateTimeContract()

  const [txHash, setTxHash] = useState<string>('')
  const [owner, setOwner] = useState<string>('')
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
  })

  // destructure
  const {
    token_address,
    token_name,
    token_decimal,
    token_symbol,
  } = formData

  useEffect(() => {
    const fetch = async () => {
      if (!library || !account || !chainId || !token_address) return

      const sigCheck = getSigCheckContract(chainId, library, account)

      const owner_addr = await sigCheck?.callStatic.superman()
      setOwner(owner_addr)

      const tokenContract = getTokenContract(token_address, library, account)
      const TName = await tokenContract?.callStatic.name()
      const TSymbol = await tokenContract?.callStatic.symbol()
      const TDecimals = await tokenContract?.callStatic.decimals()

      setFormData((prev) => ({ ...prev, token_name: TName, token_symbol: TSymbol, token_decimal: TDecimals }))
    }
    if (account && library instanceof ethers.providers.Web3Provider) {
      fetch()
    }
  }, [token_address, account, library])

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

    const payload = [STAKE_ADDRESS, 'add(address)', token_address]

    const method: (...args: any) => Promise<TransactionResponse> = stake['submitTransaction(address,string,address)']
    const args: Array<object | string[] | string | boolean | number> = payload

    setAttemptingTxn(true)
    setIsOpen(true)
    
    await method(...args)
      .then(async (response: any) => {
        const txReceipt = await response.wait()
        const stakeID = txReceipt.events[0].args.txIndex.toNumber()
        setAttemptingTxn(false)
        setTxHash(response.hash)

        addStakeOwner({ ...formData, owner_address: account, 
          stakeOwner_id: stakeID,
        })
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
              })
              swal('Congratulations!', 'Stake is Created! It will be live soon!', 'success')
            }
          })
          .catch((err) => console.log(`error is ${err}`))
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
          {/* <CardHeader className="d-flex justify-content-between"> */}
          <Heading>
            Create Stake
            <Tooltip show={feeTooltip} placement="right" text="Create a token to be eligible for staking">
              <FaInfoCircle onMouseEnter={() => setFeeTooltip(true)} onMouseLeave={() => setFeeTooltip(false)} />
            </Tooltip>
          </Heading>

          <CardBody>
            <div className="row">
              <div className="col-md-6 mb-3">
                <Input
                  placeholder="Token Address"
                  className="mt-3"
                  scale="lg"
                  value={token_address}
                  onChange={handleChange('token_address')}
                />
              </div>

              <div className="col-md-6 mb-3">
                <Input
                  placeholder="Token Name"
                  scale="lg"
                  className="mt-3"
                  value={token_name}
                  onChange={handleChange('token_name')}
                />
              </div>

              <div className="col-md-6 mb-3">
                <Input
                  placeholder="Token Symbol"
                  scale="lg"
                  className="mt-3"
                  value={token_symbol}
                  onChange={handleChange('token_symbol')}
                />
              </div>

              <div className="col-md-6 mb-3">
                <Input
                  placeholder="Token Decimal"
                  className="mt-3"
                  scale="lg"
                  value={token_decimal}
                  onChange={handleChange('token_decimal')}
                />
              </div>
            </div>
          </CardBody>

          {/* <div className="d-flex justify-content-around  mb-5"> */}
          <Flex justifyContent="space-around" margin="3rem">
            <Button onClick={handleSubmit}>Submit</Button>
            <Link to={`/create-stakes`}>
              <Button>Back</Button>
            </Link>
          </Flex>
        </AppBodyExtended>
      </Container>
      <div className="mt-5"> </div>
    </>
  )
}
