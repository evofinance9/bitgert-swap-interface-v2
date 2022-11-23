/* eslint-disable */
import React, { useState, useEffect } from 'react'
// , useCallback, useRef, useMemo
// import { Card, Badge, Button as BSButton, ProgressBar } from 'react-bootstrap'

import swal from 'sweetalert'
import { Button, CardBody, Input, Flex } from '@evofinance9/uikit'
// import { Button } from '@evofinance9/uikit'
// import { DateTimePicker } from '@material-ui/pickers'
import { TextField, withStyles } from '@material-ui/core'
// import { Checkbox, useCheckboxState } from 'pretty-checkbox-react'
import '@djthoms/pretty-checkbox'
import { Link } from 'react-router-dom'
import moment from 'moment'
// import { TelegramIcon, TwitterIcon, WWWIcon } from '../../../assets/images'
// import { SocialIcon } from 'react-social-icons'

// import { ethers } from 'ethers'
// import Form from 'react-bootstrap/Form'

// import { BigNumber } from '@ethersproject/bignumber'
import { TransactionResponse } from '@ethersproject/providers'
import Container from 'components/Container'

import { useActiveWeb3React } from 'hooks'
import { useStakeContract, useDateTimeContract, useTokenContract } from 'hooks/useContract'
import { getStakeContract, getTokenContract, getSigCheckContract } from 'utils'
// import getUnixTimestamp from 'utils/getUnixTimestamp'
import { STAKE_ADDRESS } from 'constants/abis/stake'
import { Oval } from 'react-loader-spinner'

import './style.css'

// import { AppBodyExtended } from 'pages/AppBody'
import TransactionConfirmationModal from 'components/TransactionConfirmationModal'
// import { RouteComponentProps } from 'react-router-dom'
import { getStakeUserById, updateStakeUser } from './apicalls'
// import { setFlagsFromString } from 'v8'
import {
  TableWrapper,
  Table,
  TableHeader,
  StakeCardWrapper,
  StakeCard,
  StakeCardBody,
  StakeHeader,
  StakeSubHeader,
  TableWrapperExtended,
  IconsWrapper,
  LoaderWrapper,
  Flex as FlexExtended,
  InputExtended,
  ButtonContainer,
} from './styleds'
import { addStakeOwner } from '../CreateStakes/apicalls'

interface FormComponentProps {
  match: {
    params: { stakeId }
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

export default function StakeUserDetails({
  match: {
    params: { stakeId },
  },
}: FormComponentProps) {
  const { account, chainId, library } = useActiveWeb3React()
  const stakeContract = useStakeContract(true)
  const dateTimeContract = useDateTimeContract()
  const tokenContract = useTokenContract('0x0eb9036cbE0f052386f36170c6b07eF0a0E3f710', true)

  const [stake, setStake] = useState<any>(null)
  const [totalAmount, setTotalAmount] = useState(0)
  const [balance, setBalance] = useState(0)
  const [totalSupply, setTotalSupply] = useState(0)
  const [finalTime, setFinalTime] = useState<any>()
  // const [attemptingTxn, setAttemptingTxn] = useState<boolean>(false)
  const [startDate, setStartDate] = useState<any>()
  const [isOpen, setIsOpen] = useState<boolean>(false)
  const [showConfirm, setShowConfirm] = useState<boolean>(false)
  const [tokenAddress, setTokenAddress] = useState<any>()
  const [isDeposited, setIsDeposited] = useState<boolean>(false)
  const [isCreated, setIsCreated] = useState<boolean>(false)
  const [currentTime, setCurrentTime] = useState<any>()
  const [addressAmount, setAddressAmount] = useState<any[]>([])
  const [stakeID, setStakeID] = useState<any>()
  const [amounts, setAmounts] = useState<any[]>([])
  const [userContributionBNB, setUserContributionBNB] = useState<any>()
  const [userContributionToken, setUserContributionToken] = useState<any>()
  const [stakeStarted, setStakeStarted] = useState<boolean>(false)
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
    bonusEndBlock: '',
    rewardPerBlock: '',
  })

  // destructure
  const { bonusEndBlock, rewardPerBlock } = formData

  // fetch stake info
  useEffect(() => {
    const fetch = async () => {
      setLoading(true)
      getStakeUserById(stakeId)
        .then(async (response) => {
          setStake(response)
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
  }, [stakeId])

  const handleDismissConfirmation = () => {
    setIsOpen(false)
    setShowConfirm(false)
    setTxHash('')
  }

  const handleChange = (name) => (event) => {
    const value = event.target.value
    setFormData({ ...formData, [name]: value })
  }

  const createStake = async (formData) => {
    if (!chainId || !library || !account) return

    const stakeDetails = getSigCheckContract(chainId, library, account)

    const payload = [STAKE_ADDRESS, 'add(address,address,uint256,uint256)', stake.token_address, stake.reward_token_address, bonusEndBlock, rewardPerBlock]

    const method: (...args: any) => Promise<TransactionResponse> =
      stakeDetails['submitTransaction(address,string,address,address,uint256,uint256)']
    const args: Array<object | string[] | string | boolean | number> = payload

    setAttemptingTxn(true)
    setIsOpen(true)

    await method(...args)
      .then(async (response: any) => {
        const txReceipt = await response.wait()
        const stakeID = txReceipt.events[0].args.txIndex.toNumber()


        addStakeOwner({
          ...formData,
          owner_address: account,
          stakeOwner_id: stakeID,
          stakeCreator_id: stake.owner_address,
          token_address: stake.token_address,
          token_name: stake.token_name,
          token_symbol: stake.token_symbol,
          token_decimal: stake.token_decimal,
          reward_token_address: stake.reward_token_address,
          reward_token_name: stake.reward_token_name,
          reward_token_symbol: stake.reward_token_symbol,
          reward_token_decimal: stake.reward_token_decimal,
        })
          .then((data) => {
            if (data.error) {
              swal('Oops', 'Something went wrong!', 'error')
            } else {
              setFormData({
                ...formData,
                chain_id: '32520',
                owner_address: '',
                bonusEndBlock: '',
                rewardPerBlock: '',
              })
              setAttemptingTxn(false)
              setTxHash(response.hash)
              setIsCreated(true)
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
    updateStakeUser(stakeId, { is_ended: true })
  }

  const handleCreate = (e) => {
    e.preventDefault()

    if (!account || !bonusEndBlock || !rewardPerBlock) {
      swal('Are you sure?', 'There are incomplete fields in your submission!', 'warning')
      return
    }

    createStake(formData)
  }

  return (
    <Container>
      <TransactionConfirmationModal
        isOpen={isOpen}
        onDismiss={handleDismissConfirmation}
        attemptingTxn={attemptingTxn}
        hash={txHash}
        content={() => <></>}
        pendingText="Please wait..."
      />
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
      {stake !== null && !loading && (
        <div>
          <StakeCardWrapper>
            <StakeCard>
              <StakeCardBody>
                <TableWrapperExtended>
                  <Table>
                    <tbody>
                      <tr>
                        <td>Token Address</td>
                        <td>{stake.token_address}</td>
                      </tr>

                      <tr>
                        <td>Token Name </td>
                        <td>{stake.token_name}</td>
                      </tr>

                      <tr>
                        <td>Token Symbol</td>
                        <td>{stake.token_symbol}</td>
                      </tr>

                      <tr>
                        <td>Token Decimal</td>
                        <td>{stake.token_decimal}</td>
                      </tr>

                      <tr>
                        <td>Reward Token Address</td>
                        <td>{stake.reward_token_address}</td>
                      </tr>

                      <tr>
                        <td>Reward Token details </td>
                        <td>{stake.reward_token_name} - {stake.reward_token_symbol} - {stake.reward_token_decimal}</td>
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
                    <FlexExtended>
                      <ButtonContainer>
                        <Button scale="md" variant="secondary" onClick={handleCreate}>
                          Create
                        </Button>
                      </ButtonContainer>
                      <ButtonContainer>
                        <Link to={`/stake`}>
                          <Button scale="md" variant="secondary">
                            Back
                          </Button>
                        </Link>
                      </ButtonContainer>
                    </FlexExtended>
                  </>
                )}
              </StakeCardBody>
            </StakeCard>
          </StakeCardWrapper>
        </div>
      )}
    </Container>
  )
}
