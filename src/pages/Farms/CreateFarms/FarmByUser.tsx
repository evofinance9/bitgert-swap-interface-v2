/* eslint-disable */
import React, { useState, useEffect } from 'react'
import swal from 'sweetalert'
import { Button, CardBody, Input, CardHeader, Flex } from '@evofinance9/uikit'
import { Link } from 'react-router-dom'
import { ethers } from 'ethers'

// import { BigNumber } from '@ethersproject/bignumber'
import { DateTimePicker, DatePicker } from '@material-ui/pickers'
import { TextField, withStyles } from '@material-ui/core'
// import { TransactionResponse } from '@ethersproject/providers'

import { FaInfoCircle } from 'react-icons/fa'

import addFarmUser from './apicalls'

import { useFarmContract, useDateTimeContract } from 'hooks/useContract'
import { getFarmContract, getTokenContract, getSigCheckContract } from 'utils'
// import getUnixTimestamp from 'utils/getUnixTimestamp'

import './style.css'
import { Checkbox, useCheckboxState } from 'pretty-checkbox-react'
import { AppBodyExtended } from 'pages/AppBody'

import { useActiveWeb3React } from 'hooks'

import styled from 'styled-components'
import { Heading, Flex as FlexExtended, InputExtended, ButtonContainer } from './styleds'
// import { Heading, FlexH1, Flex } from './styleds'

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
  // const farmContract = useFarmContract(true)

  // const dateTimeContract = useDateTimeContract()

  const checkbox = useCheckboxState({ state: [] })
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
    project_name: '',
    start_date: new Date(),
    email_id: '',
    telegram_id: '',
    logo_url: '',
  })

  // destructure
  const {
    token_address,
    token_name,
    token_decimal,
    token_symbol,
    project_name,
    start_date,
    email_id,
    telegram_id,
    logo_url,
  } = formData

  useEffect(() => {
    const fetch = async () => {
      if (!library || !account) return
      const tokenContract = getTokenContract(token_address, library, account)
      const TName = await tokenContract?.callStatic.name()
      const TSymbol = await tokenContract?.callStatic.symbol()
      const TDecimals = await tokenContract?.callStatic.decimals()

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

    const sigCheck = getSigCheckContract(chainId, library, account)

    const owner_addr = await sigCheck?.callStatic.superman()

    setAttemptingTxn(true)
    setIsOpen(true)

    // opens up metamask extension and connects Web2 to Web3
    await (window as any).ethereum.send('eth_requestAccounts') 
    
    //create provider
    const provider = new ethers.providers.Web3Provider(
      (window as any).ethereum
    ) 
    
    const signer = provider.getSigner()
          
    let amount = 5
    const etherAmount = ethers.utils.parseUnits(amount.toString(), 'ether')

    const tx = await signer.sendTransaction({
      to: owner_addr, //destination wallet address
      value: etherAmount, // amount of native token to be sent
    })

    await tx.wait()
    setAttemptingTxn(false)

      addFarmUser({
        ...formData,
        owner_address: account,
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
              project_name: '',
              start_date: new Date(),
              email_id: '',
              telegram_id: '',
              logo_url: '',
            })
            swal('Congratulations!', 'Farm is added!', 'success')
          }
        })
        .catch((err) => console.log('Error in signup' + err))
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

    if (!account || !token_address || !project_name || !email_id || !telegram_id) {
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

            <Heading>
              Create Farm
            </Heading>

            <Tooltip show={feeTooltip} placement="right" text="Create using LP Token Address">
              <FaInfoCircle onMouseEnter={() => setFeeTooltip(true)} onMouseLeave={() => setFeeTooltip(false)} />
            </Tooltip>
          </Flex>
          </CardHeader>
          <CardBody>
            {/* <h1 className="d-flex justify-content-center">Bitgert will be creating the pool for investors to stake or Farm!</h1>
            <h1 className="d-flex justify-content-center">Please log the details below and submit!! </h1>
            <h1 className="d-flex justify-content-center mb-3">Kindly expect the response within 1 week.</h1>
            <h1 className="d-flex justify-content-center mb-3">To submit your stake creation request, you must pay 5 BRISE.</h1> */}

            <Flex justifyContent="center" margin="0rem">Bitgert will be creating the pool for investors to stake or Farm!</Flex>
            <Flex justifyContent="center" margin="0rem">Please log the details below and submit!! </Flex>
            <Flex justifyContent="center" margin="1rem">Kindly expect the response within 1 week.</Flex>
            <Flex justifyContent="center" margin="1rem">To submit your stake creation request, you must pay 5 BRISE.</Flex>


            <h1>Token Details</h1>

            {/* <div className="row">
              <div className="col-md-6 mb-3"> */}
              <FlexExtended>
              <InputExtended
                  placeholder="Token Address"
                  className="mt-3"
                  scale="lg"
                  value={token_address}
                  onChange={handleChange('token_address')}
                />
                {/* </FlexExtended> */}
              {/* </div>

              <div className="col-md-6 mb-3"> */}
              <InputExtended
                  placeholder="Token Name"
                  scale="lg"
                  className="mt-3"
                  value={token_name}
                  onChange={handleChange('token_name')}
                />


              {/* <div className="col-md-6 mb-3"> */}
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
              {/* </div> */}
            </FlexExtended>

            <h1> Project Name </h1>

            {/* <div className="mt-2 mb-3"> */}
            <FlexExtended>
              <InputExtended
                placeholder="Project Name"
                className="mt-3"
                scale="lg"
                value={project_name}
                onChange={handleChange('project_name')}
              />
            {/* </div> */}
            </FlexExtended>

            <h1> Date Of Launch </h1>

            {/* <div className=" d-flex justify-content-center my-4"> */}
            {/* <Flex justifyContent="center" margin="1.5rem"> */}
            <FlexExtended>

              <DatePicker
                size="small"
                color="primary"
                fullWidth
                inputVariant="outlined"
                value={start_date}
                onChange={(date) => {
                  handleDateChange('start_date', date)
                }}
                TextFieldComponent={(params) => {
                  return <CssTextField {...params} />
                }}
                />
                </FlexExtended>

              

            <FlexExtended>
            <h1> Email to contact </h1>


            {/* <div className="mb-3"> */}

              <Input
                placeholder="Email ID"
                className="mt-3"
                scale="lg"
                value={email_id}
                onChange={handleChange('email_id')}
              />
            {/* </div> */}

            <h1> Telegram </h1>
            {/* <div className="mb-3"> */}
              <Input
                placeholder="Telegram ID"
                className="mt-3"
                scale="lg"
                value={telegram_id}
                onChange={handleChange('telegram_id')}
              />
            {/* </div> */}
            </FlexExtended>

            <FlexExtended>
            
            <h1> Project Logo </h1>
            {/* <div className="mb-3"> */}
              <Input
                placeholder="Logo Url"
                className="mt-3"
                scale="lg"
                value={logo_url}
                onChange={handleChange('logo_url')}
              />
            {/* </div> */}
            </FlexExtended>

          </CardBody> 

          {/* <div className="d-flex justify-content-center mb-5"> */}
          {/* <Flex justifyContent="center" margin="3rem"> */}
          <ButtonContainer>

            <Button className="mx-2" onClick={handleSubmit}>Submit</Button>
            <Link to={`/create-farms`}>
              <Button>
                Back
              </Button>
            </Link> 
          </ButtonContainer>

          {/* </Flex> */}
          
        </AppBodyExtended>
      </Container>
      <div className="mt-5"> </div>
    </>
  )
}
