/* eslint-disable */
import React, { useState, useEffect, useCallback, useRef, useMemo } from 'react'
import { Card, Badge, Button as BSButton, ProgressBar } from 'react-bootstrap'

import swal from 'sweetalert'
import { Button, CardBody, Input } from '@evofinance9/uikit'
import { DateTimePicker } from '@material-ui/pickers'
import { TextField, withStyles } from '@material-ui/core'
import { Checkbox, useCheckboxState } from 'pretty-checkbox-react'
import '@djthoms/pretty-checkbox'
import { Link } from 'react-router-dom'
import moment from 'moment'
import { TelegramIcon, TwitterIcon, WWWIcon } from '../../../assets/images'
import { SocialIcon } from 'react-social-icons'

import { ethers } from 'ethers'
import Form from 'react-bootstrap/Form'

import { BigNumber } from '@ethersproject/bignumber'
import { TransactionResponse } from '@ethersproject/providers'
import Container from 'components/Container'

import { useActiveWeb3React } from 'hooks'
import { useFarmContract, useDateTimeContract, useTokenContract } from 'hooks/useContract'
import { getFarmContract, getTokenContract, getSigCheckContract } from 'utils'
import getUnixTimestamp from 'utils/getUnixTimestamp'
// import CountDownTimer from '../CountDownTimer'
import { FARM_ADDRESS } from 'constants/abis/farm'
import { Oval } from 'react-loader-spinner'

import './style.css'

import { AppBodyExtended } from 'pages/AppBody'
import TransactionConfirmationModal from 'components/TransactionConfirmationModal'
import { RouteComponentProps } from 'react-router-dom'
import { getFarmUserById, updateFarmUser } from './apicalls'
import { setFlagsFromString } from 'v8'
import {
  TableWrapper,
  Table,
  TableHeader,
  FarmCardWrapper,
  FarmCard,
  FarmCardBody,
  FarmHeader,
  FarmSubHeader,
  TableWrapperExtended,
  IconsWrapper,
  LoaderWrapper,
  Heading,
  Flex as FlexExtended,
  InputExtended,
  ButtonContainer,
} from './styleds'
import { addFarmOwner } from '../CreateFarms/apicalls'

interface FormComponentProps {
  match: {
    params: { farmId }
  }
}

const currentTimeInitialState = async () => {}

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

export default function FarmUserDetails({
  match: {
    params: { farmId },
  },
}: FormComponentProps) {
  const { account, chainId, library } = useActiveWeb3React()
  const farmContract = useFarmContract(true)
  const dateTimeContract = useDateTimeContract()
  const tokenContract = useTokenContract('0x0eb9036cbE0f052386f36170c6b07eF0a0E3f710', true)

  const [farm, setFarm] = useState<any>(null)
  const [totalAmount, setTotalAmount] = useState(0)
  const [balance, setBalance] = useState(0)
  const [totalSupply, setTotalSupply] = useState(0)
  const [finalTime, setFinalTime] = useState<any>()
  const [startDate, setStartDate] = useState<any>()
  const [tokenAddress, setTokenAddress] = useState<any>()
  const [isDeposited, setIsDeposited] = useState<boolean>(false)
  const [isCreated, setIsCreated] = useState<boolean>(false)
  const [currentTime, setCurrentTime] = useState<any>()
  const [addressAmount, setAddressAmount] = useState<any[]>([])
  const [farmID, setFarmID] = useState<any>()
  const [amounts, setAmounts] = useState<any[]>([])
  const [isOpen, setIsOpen] = useState<boolean>(false)
  const [showConfirm, setShowConfirm] = useState<boolean>(false)
  const [userContributionBNB, setUserContributionBNB] = useState<any>()
  const [userContributionToken, setUserContributionToken] = useState<any>()
  const [farmStarted, setFarmStarted] = useState<boolean>(false)
  const [startTimeFlag, setStartTimeFlag] = useState<boolean>(false)
  const [started, setStarted] = useState<boolean>(false)
  const [cancelled, setCancelled] = useState<boolean>(false)
  const [txHash, setTxHash] = useState<string>('')
  const [attemptingTxn, setAttemptingTxn] = useState<boolean>(false)
  const [isArroved, setIsArroved] = useState<boolean>(false)
  const [loading, setLoading] = useState<boolean>(false)

  const [formData, setFormData] = useState({
    chain_id: '32520',
    owner_address: '',
    allocation_point: '',
    rewardPerBlock: '',
  })

  // destructure
  const { allocation_point, rewardPerBlock } = formData

  // fetch farm info
  useEffect(() => {
    const fetch = async () => {
      setLoading(true)
      getFarmUserById(farmId)
        .then(async (response) => {
          setFarm(response)
          setTokenAddress(response.token_address)
          setStartDate(moment(response.start_date).format('dddd, MMMM Do YYYY'))
          setLoading(false)
        })
        .catch((err) => {
          setLoading(false)

          console.log(err)
          swal('Oops', 'Something went wrong!', 'error')
        })
    }
    fetch()
  }, [farmId])

  const handleChange = (name) => (event) => {
    const value = event.target.value
    setFormData({ ...formData, [name]: value })
  }

  const handleDismissConfirmation = () => {
    setIsOpen(false)
    setShowConfirm(false)
    setTxHash('')
  }

  // const createFarm = async (formData) => {
  //   if (!chainId || !library || !account) return
  //   const farmDetails = getFarmContract(chainId, library, account)

  //   const payload = [
  //     allocation_point,
  //     farm.token_address,
  //     false
  //   ]

  //   const method: (...args: any) => Promise<TransactionResponse> = farmDetails!.add
  //   const args: Array<object | string[] | string | boolean | number> = payload

  //   setAttemptingTxn(true)
  //   await method(...args)
  //     .then(async (response: any) => {
  //       const txReceipt = await response.wait()
  //       const farmID = txReceipt.events[0].args.pid.toNumber()
  //       setAttemptingTxn(false)
  //       addFarmOwner({
  //         ...formData,
  //         farmOwner_id: farmID,
  //         owner_address: account,
  //         token_address: farm.token_address,
  //         token_symbol: farm.token_symbol,
  //         token_decimal: farm.token_decimal,
  //       })
  //         .then((data) => {
  //           if (data.error) {
  //             swal('Oops', 'Something went wrong!', 'error')
  //           } else {
  //             setFormData({
  //               ...formData,
  //               chain_id: '32520',
  //               owner_address: '',
  //               allocation_point: '',
  //             })
  //             setFarmID(farmID)
  //             setIsCreated(true)
  //             swal('Congratulations!', 'Farm is added!', 'success')
  //           }
  //         })
  //         .catch((err) => console.log('Error in signup'))
  //       setTxHash(response.hash)
  //     })
  //     .catch((e) => {
  //       setAttemptingTxn(false)
  //       // we only care if the error is something _other_ than the user rejected the tx
  //       if (e?.code !== "ACTION_REJECTED") {
  //         console.error(e)
  //         alert(e.message)
  //       }
  //     })
  //     updateFarmUser(farmId, {is_ended: true})
  // }

  const createFarm = async (formData) => {
    if (!chainId || !library || !account) return

    const farmDetails = getSigCheckContract(chainId, library, account)

    const payload = [FARM_ADDRESS, 'add(address,uint256,uint256)', farm.token_address, allocation_point, rewardPerBlock]

    const method: (...args: any) => Promise<TransactionResponse> =
      farmDetails['submitTransaction(address,string,address,uint256,uint256)']
    const args: Array<object | string[] | string | boolean | number> = payload

    setAttemptingTxn(true)
    await method(...args)
      .then(async (response: any) => {
        const txReceipt = await response.wait()
        console.log('farmUser details: ', txReceipt)
        console.log('farmUser details: ', txReceipt.events[0])
        const farmID = txReceipt.events[0].args.txIndex.toNumber()
        //       const farmID = txReceipt.events[0].args.pid.toNumber()

        setAttemptingTxn(false)
        setTxHash(response.hash)

        addFarmOwner({
          ...formData,
          owner_address: account,
          farmOwner_id: farmID,
          token_address: farm.token_address,
          token_name: farm.token_name,
          token_symbol: farm.token_symbol,
          token_decimal: farm.token_decimal,
        })
          .then((data) => {
            if (data.error) {
              swal('Oops', 'Something went wrong!', 'error')
            } else {
              setFormData({
                ...formData,
                chain_id: '32520',
                owner_address: '',
                allocation_point: '',
                rewardPerBlock: '',
              })
              setIsCreated(true)
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
    updateFarmUser(farmId, { is_ended: true })
  }

  const handleCreate = (e) => {
    e.preventDefault()

    if (!account || !allocation_point || !rewardPerBlock) {
      swal('Are you sure?', 'There are incomplete fields in your submission!', 'warning')
      return
    }

    createFarm(formData)
  }

  return (
    <Container>
      {loading && (
        <LoaderWrapper>
          <Oval
            height={80}
            width={80}
            color="#f9d849"
            wrapperStyle={{}}
            wrapperClass=""
            visible={true}
            ariaLabel="oval-loading"
            secondaryColor="#f4d85b"
            strokeWidth={2}
            strokeWidthSecondary={2}
          />
        </LoaderWrapper>
      )}
      {farm !== null && !loading && (
        <div>
          <TransactionConfirmationModal
            isOpen={isOpen}
            onDismiss={handleDismissConfirmation}
            attemptingTxn={attemptingTxn}
            hash={txHash}
            content={() => <></>}
            pendingText="Please wait..."
          />
          <FarmCardWrapper>
            <FarmCard>
              <FarmCardBody>
                <TableWrapperExtended>
                  <Table>
                    <tbody>
                      <tr>
                        <td>Token Address</td>
                        <td>{farm.token_address}</td>
                      </tr>

                      <tr>
                        <td>Token Name </td>
                        <td>{farm.token_name}</td>
                      </tr>

                      <tr>
                        <td>Token Symbol</td>
                        <td>{farm.token_symbol}</td>
                      </tr>

                      <tr>
                        <td>Token Decimal</td>
                        <td>{farm.token_decimal}</td>
                      </tr>

                      <tr>
                        <td>Start Date</td>
                        <td>{startDate}</td>
                      </tr>
                    </tbody>
                  </Table>
                </TableWrapperExtended>
                {!isCreated && (
                  <>
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
                    <FlexExtended>
                      <ButtonContainer>
                        <Button scale="md" variant="secondary" onClick={handleCreate}>
                          Create
                        </Button>
                      </ButtonContainer>
                      <ButtonContainer>
                        <Link to={`/farm`}>
                          <Button scale="md" variant="secondary">
                            Back
                          </Button>
                        </Link>
                      </ButtonContainer>
                    </FlexExtended>
                  </>
                )}
              </FarmCardBody>
            </FarmCard>
          </FarmCardWrapper>
        </div>
      )}
    </Container>
  )
}
