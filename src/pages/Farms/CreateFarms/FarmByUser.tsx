/* eslint-disable */
import React, { useState, useEffect } from 'react'
import swal from 'sweetalert'
import { Button, CardBody, CardHeader } from '@evofinance9/uikit'
import { Link } from 'react-router-dom'
import { ethers } from 'ethers'

import { DatePicker } from '@material-ui/pickers'
import { TextField, withStyles } from '@material-ui/core'

import { FaInfoCircle } from 'react-icons/fa'

import addFarmUser from './apicalls'

import { getTokenContract, getSigCheckContract } from 'utils'

import './style.css'
import { AppBodyExtended } from 'pages/AppBody'

import { useActiveWeb3React } from 'hooks'

import Container from 'components/Container'
import TransactionConfirmationModal from 'components/TransactionConfirmationModal'
import Tooltip from 'components/Tooltip'
import { Heading, Flex, Text, InputExtended } from './styleds'

const CssTextField = withStyles({
  root: {
    '&': {
      borderRadius: '6px',
      margin: '1rem 0',
    },
    '& label.Mui-focused': {
      color: '#aaa',
    },
    '& label': {
      color: '#000',
    },

    '& .MuiInputBase-input': {
      color: '#000',
      backgroundColor: '#fff',
      borderRadius: '6px',
      display: 'block',
      fontSize: '16px',
      height: '48px',
      outline: '0',
      borderColor: '#2669f5',
      padding: '0 16px',
    },
    '& .MuiInputBase-input:active': {
      border: '0',
    },
  },
})(TextField)

export default function Farm() {
  const { account, chainId, library } = useActiveWeb3React()
  const [txHash, setTxHash] = useState<string>('')
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

    const signer = library.getSigner()

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
          swal('Congratulations!', 'Farm request is created!', 'success')
        }
      })
      .catch((err) => console.log('Error in signup' + err))
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

    if (!account || !token_address || !project_name || !email_id || !telegram_id) {
      swal('Are you sure?', 'There are incomplete fields in your submission!', 'warning')
      return
    }

    createFarm(formData)
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
            <Flex alignItems={'center'} justifyContent={'space-between'}>
              <Heading>Create Farm</Heading>
              <Tooltip show={feeTooltip} placement="right" text="Create using LP Token Address">
                <FaInfoCircle onMouseEnter={() => setFeeTooltip(true)} onMouseLeave={() => setFeeTooltip(false)} />
              </Tooltip>
            </Flex>
          </CardHeader>

          <CardBody>
            <Flex direction="column" alignItems="start">
              <Text>Evo will be creating the pool for investors to stake or Farm!</Text>
              <Text>Please log the details below and submit!!</Text>
              <Text>Kindly expect the response within 7 to 10 days.</Text>
              <Text>To submit your stake creation request, you must pay 5 BRISE.</Text>
            </Flex>

            <Flex>
              <InputExtended
                placeholder="Token Address"
                className="mt-3"
                scale="lg"
                value={token_address}
                onChange={handleChange('token_address')}
              />
              <InputExtended
                placeholder="Token Name"
                scale="lg"
                className="mt-3"
                value={token_name}
                onChange={handleChange('token_name')}
              />
            </Flex>

            <Flex>
              <InputExtended
                placeholder="Token Symbol"
                scale="lg"
                className="mt-3"
                value={token_symbol}
                onChange={handleChange('token_symbol')}
              />
              <InputExtended
                placeholder="Token Decimal"
                className="mt-3"
                scale="lg"
                value={token_decimal}
                onChange={handleChange('token_decimal')}
              />
            </Flex>

            <Flex>
              <InputExtended
                placeholder="Project Name"
                className="mt-3"
                scale="lg"
                value={project_name}
                onChange={handleChange('project_name')}
              />

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
            </Flex>

            <Flex>
              <InputExtended
                placeholder="Email ID"
                className="mt-3"
                scale="lg"
                value={email_id}
                onChange={handleChange('email_id')}
              />

              <InputExtended
                placeholder="Telegram ID"
                className="mt-3"
                scale="lg"
                value={telegram_id}
                onChange={handleChange('telegram_id')}
              />
            </Flex>

            <Flex>
              <InputExtended
                placeholder="Logo Url"
                className="mt-3"
                scale="lg"
                value={logo_url}
                onChange={handleChange('logo_url')}
              />
            </Flex>

            <Flex justifyContent="center">
              <Link to={`/create-farms`}>
                <Button>Back</Button>
              </Link>
              <Button onClick={handleSubmit}>Submit</Button>
            </Flex>
          </CardBody>
        </AppBodyExtended>
        <div style={{ padding: '3rem', margin: '2rem' }} />
      </Container>
    </>
  )
}
