/* eslint-disable */
import React, { useState, useEffect } from 'react'
import swal from 'sweetalert'
import { Button, CardBody, Input, CardHeader, Flex } from '@evofinance9/uikit'
import { Link } from 'react-router-dom'
import { ethers } from 'ethers'

// import { BigNumber } from '@ethersproject/bignumber'
// import { DateTimePicker } from '@material-ui/pickers'
import { TextField, withStyles } from '@material-ui/core'
import { TransactionResponse } from '@ethersproject/providers'

import { FaInfoCircle } from 'react-icons/fa'

import { addFarmOwner } from './apicalls'

import { useFarmContract, useDateTimeContract } from 'hooks/useContract'
import { getFarmContract, getTokenContract, getSigCheckContract } from 'utils'
// import getUnixTimestamp from 'utils/getUnixTimestamp'
import { FARM_ADDRESS } from 'constants/abis/farm'

import './style.css'
import { AppBodyExtended } from 'pages/AppBody'

import { useActiveWeb3React } from 'hooks'
import styled from 'styled-components'
import { Heading, Flex as FlexExtended, InputExtended, ButtonContainer } from './styleds'

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

export default function Farm() {
  const { account, chainId, library } = useActiveWeb3React()
  const farmContract = useFarmContract(true)

  const dateTimeContract = useDateTimeContract()

  const [txHash, setTxHash] = useState<string>('')
  const [owner, setOwner] = useState<string>('')
  const [isOpen, setIsOpen] = useState<boolean>(false)
  const [showConfirm, setShowConfirm] = useState<boolean>(false)
  const [attemptingTxn, setAttemptingTxn] = useState<boolean>(false)
  const [allowcationTooltip, setAllowcationTooltip] = useState<boolean>(false)
  const [allowcationAmountTooltip, setAllowcationAmountTooltip] = useState<boolean>(false)
  const [feeTooltip, setFeeTooltip] = useState<boolean>(false)

  const [formData, setFormData] = useState({
    chain_id: '32520',
    owner_address: '',
    token_address: '',
    token_name: '',
    token_symbol: '',
    token_decimal: '',
    allocation_point: '',
    rewardPerBlock: '',
    allocated_owner: '',
  })

  // destructure
  const { token_address, token_name, token_decimal, token_symbol, allocation_point, rewardPerBlock, allocated_owner } =
    formData

  useEffect(() => {
    const fetch = async () => {
      if (!chainId || !library || !account) return

      const sigCheck = getSigCheckContract(chainId, library, account)

      const owner_addr = await sigCheck?.callStatic.superman()
      setOwner(owner_addr)

      const tokenContract = getTokenContract(token_address, library, account)
      console.log('yes coming')
      console.log(tokenContract)
      const TName = await tokenContract?.callStatic.name()
      const TSymbol = await tokenContract?.callStatic.symbol()
      const TDecimals = await tokenContract?.callStatic.decimals()

      console.log(TName, TSymbol, TDecimals)
      setFormData((prev) => ({ ...prev, token_name: TName, token_symbol: TSymbol, token_decimal: TDecimals }))
    }
    if (account && token_address && library instanceof ethers.providers.Web3Provider) {
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

  const createFarm = async (formData) => {
    if (!chainId || !library || !account) return

    const farm = getSigCheckContract(chainId, library, account)

    const payload = [FARM_ADDRESS, 'add(address,uint256,uint256)', token_address, allocation_point, rewardPerBlock]

    const method: (...args: any) => Promise<TransactionResponse> =
      farm['submitTransaction(address,string,address,uint256,uint256)']
    const args: Array<object | string[] | string | boolean | number> = payload

    setAttemptingTxn(true)
    setIsOpen(true)

    await method(...args)
      .then(async (response: any) => {
        const txReceipt = await response.wait()
        console.log('farm details :', txReceipt)
        console.log('farmID :', txReceipt.events[0])
        const farmID = txReceipt.events[0].args.txIndex.toNumber()
        //       const farmID = txReceipt.events[0].args.pid.toNumber()
        setAttemptingTxn(false)
        setTxHash(response.hash)

        addFarmOwner({ ...formData, owner_address: account, farmOwner_id: farmID })
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
                allocation_point: '',
                rewardPerBlock: '',
              })
              swal('Congratulations!', 'Farm is Created! It will be live soon!', 'success')
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

  // const createFarm = async (formData) => {
  //   if (!chainId || !library || !account) return
  //   const farm = getFarmContract(chainId, library, account)

  //   const payload = [
  //     // ethers.utils.parseUnits(allocation_point, parseInt(token_decimal)).toString(),
  //     allocation_point,
  //     token_address,
  //     false
  //   ]

  //   const method: (...args: any) => Promise<TransactionResponse> = farm!.add
  //   const args: Array<object | string[] | string | boolean | number> = payload

  //   setAttemptingTxn(true)
  //   await method(...args)
  //     .then(async (response: any) => {
  //       const txReceipt = await response.wait()
  //       const farmID = txReceipt.events[0].args.pid.toNumber()

  //       setAttemptingTxn(false)
  //       setTxHash(response.hash)

  //       addFarmOwner({ ...formData, owner_address: account, farmOwner_id: farmID })
  //         .then((data) => {
  //           if (data.error) {
  //             swal('Oops', 'Something went wrong!', 'error')
  //           } else {
  //             setFormData({
  //               ...formData,
  //               chain_id: '32520',
  //               owner_address: '',
  //               token_address: '',
  //               token_name: '',
  //               token_symbol: '',
  //               token_decimal: '',
  //               allocation_point: '',
  //             })
  //             swal('Congratulations!', 'Farm is added!', 'success')
  //           }
  //         })
  //         .catch((err) => console.log(`error is ${err}`))
  //     })
  //     .catch((e) => {
  //       setAttemptingTxn(false)
  //       // we only care if the error is something _other_ than the user rejected the tx
  //       if (e?.code !== "ACTION_REJECTED") {
  //         console.error(e)
  //         alert(e.message)
  //       }
  //     })
  // }

  const handleSubmit = (e) => {
    e.preventDefault()

    if (!account) {
      swal('Are you sure?', 'There are incomplete fields in your submission!', 'warning')
      return
    }

    createFarm(formData)
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
              <Heading>Create Farm</Heading>

              <Tooltip show={feeTooltip} placement="right" text="Make a pair token eligible for farming!">
                <FaInfoCircle onMouseEnter={() => setFeeTooltip(true)} onMouseLeave={() => setFeeTooltip(false)} />
              </Tooltip>
            </Flex>
          </CardHeader>
          <CardBody>
            <FlexExtended>
              {/* <div className="row">
              <div className="col-md-6 mb-3"> */}
              <InputExtended
                placeholder="Token Address"
                className="mt-3"
                scale="lg"
                value={token_address}
                onChange={handleChange('token_address')}
              />
              {/* </div> */}

              {/* <div className="col-md-6 mb-3"> */}
              <InputExtended
                placeholder="Token Name"
                scale="lg"
                className="mt-3"
                value={token_name}
                onChange={handleChange('token_name')}
              />
            </FlexExtended>
            {/* </div>

              <div className="col-md-6 mb-3"> */}
            <FlexExtended>
              <InputExtended
                placeholder="Token Symbol"
                scale="lg"
                className="mt-3"
                value={token_symbol}
                onChange={handleChange('token_symbol')}
              />
              {/* </div>

              <div className="col-md-6 mb-3"> */}
              <InputExtended
                placeholder="Token Decimal"
                className="mt-3"
                scale="lg"
                value={token_decimal}
                onChange={handleChange('token_decimal')}
              />
            </FlexExtended>
            {/* </div>
            </div> */}

            {/* <div className="mb-3"> */}
            <FlexExtended>
              <InputExtended
                placeholder="Allocation Point"
                className="mt-3"
                scale="lg"
                value={allocation_point}
                onChange={handleChange('allocation_point')}
              />
              <InputExtended
                placeholder="Reward Per Block"
                className="mt-3"
                scale="lg"
                value={rewardPerBlock}
                onChange={handleChange('rewardPerBlock')}
              />
            </FlexExtended>
            {/* </div> */}
          </CardBody>

          <ButtonContainer>
            <Button onClick={handleSubmit}>Submit</Button>
            <Link to={`/create-farms`}>
              <Button>Back</Button>
            </Link>
          </ButtonContainer>
        </AppBodyExtended>
      </Container>
      <div className="mt-5"> </div>
    </>
  )
}
