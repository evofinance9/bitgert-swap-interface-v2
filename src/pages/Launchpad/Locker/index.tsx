/* eslint-disable */
import React, { useState, useEffect } from 'react'
import swal from 'sweetalert'
import { Button, CardHeader, CardBody, Checkbox as CheckboxUI } from '@evofinance9/uikit'
import { DateTimePicker } from '@material-ui/pickers'
import { TextField, withStyles } from '@material-ui/core'
import { Checkbox, useCheckboxState } from 'pretty-checkbox-react'
import '@djthoms/pretty-checkbox'
import moment from 'moment'

import { ethers } from 'ethers'

import { TransactionResponse } from '@ethersproject/providers'

import addBitgertLock from './apicalls'

import { useBitgertLockContract, useDateTimeContract } from 'hooks/useContract'
import { getBitgertLockContract, getTokenContract } from 'utils'

import './style.css'

import { useActiveWeb3React } from 'hooks'

import Container from 'components/Container'
import TransactionConfirmationModal from 'components/TransactionConfirmationModal'

import { AppBodyExtended } from 'pages/AppBody'
import { LOCK_ADDRESS } from 'constants/abis/lock'

import { InputExtended, Heading, CheckboxContainer, Flex, ButtonContainer, TextArea } from './styleds'

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

export default function Locker() {
  const checkbox = useCheckboxState({ state: [] })
  const { account, chainId, library } = useActiveWeb3React()
  const bitgertLockContract = useBitgertLockContract(true)
  const dateTimeContract = useDateTimeContract()

  const [currentSaleId, setCurrentSaleId] = useState(0)
  const [tokenName, setTokenName] = useState<any>()
  const [tokenSymbol, setTokenSymbol] = useState<any>()
  const [tokenDecimal, setTokenDecimal] = useState(0)
  const [txHash, setTxHash] = useState<string>('')
  const [showConfirm, setShowConfirm] = useState<boolean>(false)
  const [showApprove, setShowApprove] = useState<boolean>(false)
  const [attemptingTxn, setAttemptingTxn] = useState<boolean>(false)
  const [approveSuccess, setApproveSuccess] = useState<boolean>(false)

  const [formData, setFormData] = useState({
    chain_id: '32520',
    owner_address: '',
    token_address: '',
    token_name: '',
    token_symbol: '',
    token_decimal: '',
    isLPToken: false,
    title: '',
    amount: '',
    is_another: false,
    is_vesting: false,
    tge_percent: '',
    release_cycle: '',
    release_percent: '',
    release_date: new Date(),
    tge_date: new Date(),
    description: '',
  })

  // destructure
  const {
    token_address,
    token_name,
    token_decimal,
    token_symbol,
    isLPToken,
    title,
    amount,
    owner_address,
    is_another,
    is_vesting,
    tge_percent,
    release_cycle,
    release_percent,
    tge_date,
    release_date,
    description,
  } = formData

  useEffect(() => {
    const fetch = async () => {
      if (!library || !account) return
      const tokenContract = getTokenContract(token_address, library, account)
      const TName = await tokenContract?.callStatic.name()
      const TSymbol = await tokenContract?.callStatic.symbol()
      const TDecimals = await tokenContract?.callStatic.decimals()

      setFormData((prev) => ({ ...prev, token_name: TName, token_symbol: TSymbol, token_decimal: TDecimals }))
      setTokenName(TName)
      setTokenName(TSymbol)
      setTokenName(TDecimals)
    }
    if (account && token_address && library instanceof ethers.providers.Web3Provider) {
      fetch()
    }
  }, [token_address, account, library])

  const handleDismissConfirmation = () => {
    setShowConfirm(false)
    setTxHash('')
  }

  const handleChange = (name) => (event) => {
    if (name === 'is_another' || name === 'is_vesting' || name === 'isLPToken') {
      const value = event.target.checked
      setFormData({ ...formData, [name]: value })
    } else {
      const value = event.target.value
      setFormData({ ...formData, [name]: value })
    }
  }

  const handleDateChange = (name, value) => {
    setFormData({ ...formData, [name]: value })
  }

  const createBitgertLock = async (formData) => {
    if (!chainId || !library || !account) return
    const bitgertLock = getBitgertLockContract(chainId, library, account)

    if (!is_vesting) {
      const payload_1 = [
        owner_address ? owner_address : account,
        token_address,
        isLPToken,
        ethers.utils.parseUnits(amount, parseInt(token_decimal)).toString(),
        moment(release_date).format('X'),
        description,
      ]

      const method: (...args: any) => Promise<TransactionResponse> = bitgertLock!.lock
      const args: Array<string | number | boolean> = payload_1

      setAttemptingTxn(true)
      await method(...args)
        .then(async (response: any) => {
          const txReceipt = await response.wait()
          const lockId = txReceipt.events[2].args.id.toNumber()
          setAttemptingTxn(false)
          addBitgertLock({ ...formData, owner_address: owner_address ? owner_address : account, lock_id: lockId })
            .then((data) => {
              setFormData({
                ...formData,
                chain_id: '32520',
                owner_address: '',
                token_address: '',
                token_name: '',
                token_symbol: '',
                token_decimal: '',
                isLPToken: false,
                title: '',
                amount: '',
                is_another: false,
                is_vesting: false,
                tge_percent: '',
                release_cycle: '',
                release_percent: '',
                release_date: new Date(),
                tge_date: new Date(),
                description: '',
              })
              if (data.error) {
                swal('Oops', 'Something went wrong!', 'error')
              }
            })
            .catch((err) => console.log('Error in signup'))
          swal('Congratulations!', 'Bitgert Lock is added!', 'success')
          setTxHash(response.hash)
        })
        .catch((e) => {
          setAttemptingTxn(false)
          // we only care if the error is something _other_ than the user rejected the tx
          if (e?.code !== 4001) {
            console.error(e)
            alert(e.message)
          }
        })
    } else {
      const payload_2 = [
        owner_address ? owner_address : account,
        token_address,
        isLPToken,
        ethers.utils.parseUnits(amount, parseInt(token_decimal)).toString(),
        moment(tge_date).format('X'),
        tge_percent,
        release_cycle,
        release_percent,
        description,
      ]

      const method: (...args: any) => Promise<TransactionResponse> = bitgertLock!.vestingLock
      const args: Array<string | number | boolean> = payload_2

      setAttemptingTxn(true)
      await method(...args)
        .then(async (response: any) => {
          const txReceipt = await response.wait()
          const lockId = txReceipt.events[2].args.id.toNumber()
          setAttemptingTxn(false)
          addBitgertLock({ ...formData, owner_address: owner_address ? owner_address : account, lock_id: lockId })
            .then((data) => {
              setFormData({
                ...formData,
                chain_id: '32520',
                owner_address: '',
                token_address: '',
                token_name: '',
                token_symbol: '',
                token_decimal: '',
                isLPToken: false,
                title: '',
                amount: '',
                is_another: false,
                is_vesting: false,
                tge_percent: '',
                release_cycle: '',
                release_percent: '',
                release_date: new Date(),
                tge_date: new Date(),
                description: '',
              })
              if (data.error) {
                swal('Oops', 'Something went wrong!', 'error')
              }
            })
            .catch((err) => console.log('Error in signup'))

          swal('Congratulations!', 'Bitgert Lock is added!', 'success')
          setTxHash(response.hash)
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
  }

  const handleAllowance = async () => {
    if (!account || !token_address) return
    if (!chainId || !library || !account) return

    const tokenContract = getTokenContract(token_address, library, account)

    const payload = [LOCK_ADDRESS, ethers.utils.parseUnits(amount, parseInt(token_decimal)).toString()]

    const method: (...args: any) => Promise<TransactionResponse> = tokenContract!.approve
    const args: Array<string | string[] | number> = payload

    setAttemptingTxn(true)
    setApproveSuccess(false)
    await method(...args)
      .then((response) => {
        setAttemptingTxn(false)
        setTxHash(response.hash)
        setApproveSuccess(true)
      })
      .catch((e) => {
        setAttemptingTxn(false)
        setApproveSuccess(false)
        // we only care if the error is something _other_ than the user rejected the tx
        if (e?.code !== 4001) {
          console.error(e)
          alert(e.message)
        }
      })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (false) {
      swal('Are you sure?', 'There are incomplete fields in your submission!', 'warning')
      return
    }

    createBitgertLock(formData)
  }

  return (
    <>
      <Container>
        <AppBodyExtended>
          <CardHeader>
            <Heading>Lock Your Token</Heading>
          </CardHeader>
          {txHash && (
            <TransactionConfirmationModal
              isOpen={true}
              onDismiss={handleDismissConfirmation}
              attemptingTxn={false}
              hash={txHash}
              content={() => <></>}
              pendingText={''}
            />
          )}

          <CardBody>
            <InputExtended
              placeholder="Token or LP Token address"
              scale="lg"
              type="text"
              value={token_address}
              onChange={handleChange('token_address')}
            />

            <Flex>
              <InputExtended
                placeholder="Token Name"
                scale="lg"
                type="text"
                value={token_name}
                onChange={handleChange('token_name')}
              />

              <InputExtended
                placeholder="Token Symbol"
                scale="lg"
                type="text"
                value={token_symbol}
                onChange={handleChange('token_symbol')}
              />
            </Flex>

            <Flex>
              <InputExtended
                placeholder="Token Decimal"
                scale="lg"
                type="number"
                value={token_decimal}
                onChange={handleChange('token_decimal')}
              />
            </Flex>

            <Flex>
              <CheckboxContainer>
                <CheckboxUI
                  id="isLPToken_checbox"
                  scale="sm"
                  checked={isLPToken}
                  onChange={handleChange('isLPToken')}
                />

                <label htmlFor="isLPToken_checbox">use LP token?</label>
              </CheckboxContainer>

              <CheckboxContainer>
                <CheckboxUI
                  id="is_another_checbox"
                  scale="sm"
                  checked={is_another}
                  onChange={handleChange('is_another')}
                />

                <label htmlFor="is_another_checbox">use another owner?</label>
              </CheckboxContainer>
            </Flex>

            {is_another && (
              <InputExtended
                placeholder="Owner Address"
                scale="lg"
                value={owner_address}
                onChange={handleChange('owner_address')}
              />
            )}

            <InputExtended placeholder="Lock Title" scale="lg" value={title} onChange={handleChange('title')} />

            <CheckboxContainer>
              <CheckboxUI
                id="is_vesting_checbox"
                scale="sm"
                checked={is_vesting}
                onChange={handleChange('is_vesting')}
              />

              <label htmlFor="is_vesting_checbox">use vesting?</label>
            </CheckboxContainer>

            {!is_vesting && (
              <DateTimePicker
                size="small"
                color="primary"
                label="Lock until (UTC time)"
                fullWidth
                inputVariant="outlined"
                value={release_date}
                onChange={(date) => {
                  handleDateChange('release_date', date)
                }}
                TextFieldComponent={(params) => {
                  return <CssTextField {...params} />
                }}
              />
            )}

            {is_vesting && (
              <>
                <DateTimePicker
                  size="small"
                  color="primary"
                  label="TGE Date (UTC time)"
                  fullWidth
                  inputVariant="outlined"
                  value={tge_date}
                  onChange={(date) => {
                    handleDateChange('tge_date', date)
                  }}
                  TextFieldComponent={(params) => {
                    return <CssTextField {...params} />
                  }}
                />
                <Flex>
                  <InputExtended
                    placeholder="TGE Percent"
                    scale="lg"
                    value={tge_percent}
                    onChange={handleChange('tge_percent')}
                  />
                  <InputExtended
                    placeholder="Cycle (minutes)"
                    scale="lg"
                    value={release_cycle}
                    onChange={handleChange('release_cycle')}
                  />
                  <InputExtended
                    placeholder="Cycle Release Percent"
                    scale="lg"
                    value={release_percent}
                    onChange={handleChange('release_percent')}
                  />
                </Flex>
              </>
            )}

            <InputExtended placeholder="Amount" scale="lg" value={amount} onChange={handleChange('amount')} />

            <TextArea rows={5} placeholder="Description" value={description} onChange={handleChange('description')} />
          </CardBody>

          <ButtonContainer>
            {!approveSuccess && <Button onClick={handleAllowance}>Approve</Button>}

            {approveSuccess && <Button onClick={handleSubmit}>Submit</Button>}
          </ButtonContainer>
        </AppBodyExtended>
      </Container>
    </>
  )
}
