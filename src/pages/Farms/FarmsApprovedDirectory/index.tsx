/* eslint-disable */
import React, { useState, useEffect } from 'react'
// import { Link } from 'react-router-dom'
import swal from 'sweetalert'
import { Oval } from 'react-loader-spinner'

import './style.css'

import Container from 'components/Container'
import FarmUser from 'components/FarmUser'
import { Button, CardBody, Input, Flex } from '@evofinance9/uikit'
import { FaCopy, FaInfoCircle } from 'react-icons/fa'
import Tooltip from 'components/Tooltip'

import { ethers } from 'ethers'
// import Form from 'react-bootstrap/Form'

import { MaxUint256 } from '@ethersproject/constants'
import { BigNumber } from '@ethersproject/bignumber'
import { TransactionResponse } from '@ethersproject/providers'
import styled from 'styled-components'

import { useActiveWeb3React } from 'hooks'
import { useFarmContract, useDateTimeContract, useTokenContract } from 'hooks/useContract'
import { getFarmContract, getTokenContract, getSigCheckContract } from 'utils'
import { FARM_ADDRESS } from 'constants/abis/farm'

import { getAllFarmOwner } from './apicalls'
// import getAllFarmUser from './apicalls'
import { TableWrapper, Table, LoaderWrapper, StyledText, Flex as FlexExtended, InputExtended, ButtonContainer, Th } from './styleds'

// const InputExtended = styled(Input)`
//   width: 100px;
// `

export default function FarmsCreatedDirectory() {
  const { account, chainId, library } = useActiveWeb3React()
  const [tokenDetails, setTokenDetails] = useState<any>({})
  const [farms, setFarms] = useState<any[]>([])
  // const [farmID, setFarmID] = useState<any>()
  // const [tokenAddress, setTokenAddress] = useState<string>('')
  const [isOwner, setIsOwner] = useState<boolean>(false)
  const [pause, setPause] = useState<boolean>(false)
  const [isMint, setIsMint] = useState<boolean>(false)
  // const [farmReward, setFarmReward] = useState<boolean>(false)
  const [rewardBalance, setRewardBalance] = useState<string>('')
  const [bitgertToken, setBitgertToken] = useState<string>('')
  const [multiplier, setBonusMultiplier] = useState<string>('')
  const [bitgertPerBlock, setBitgertPerBlock] = useState<string>('')
  const [toBurn, setToBurn] = useState<string>('')
  const [tokenDecimals, setTokenDecimals] = useState<string>('')
  const [allowance, setAllowance] = useState<string>('')
  const [feeTooltip1, setFeeTooltip1] = useState<boolean>(false)
  const [feeTooltip2, setFeeTooltip2] = useState<boolean>(false)
  const [feeTooltip3, setFeeTooltip3] = useState<boolean>(false)
  const [feeTooltip4, setFeeTooltip4] = useState<boolean>(false)
  const [feeTooltip5, setFeeTooltip5] = useState<boolean>(false)
  const [txHash, setTxHash] = useState<string>('')
  const [attemptingTxn, setAttemptingTxn] = useState<boolean>(false)
  const [isApproved, setIsApproved] = useState<boolean>(false)
  const [text, setText] = useState<boolean>(false)
  const [loading, setLoading] = useState<boolean>(false)
  
  const [formData, setFormData] = useState({
    chain_id: '32520',
    owner_address: '',
    RewardToken: '',
    Multiplier: 0,
    EmissionRate: 0,
    ChangeToBurn: 0,
    WithdrawAmount: 0,
    DepositRewardAmount: 0,
  })

  // destructure
  const { owner_address, RewardToken, Multiplier, EmissionRate, ChangeToBurn, WithdrawAmount, DepositRewardAmount } = formData

  useEffect(() => {
    
    const fetchFarmList = async () => {
      setLoading(true)

      if (!chainId || !library || !account) return

      
      const farmDetails = getFarmContract(chainId, library, account)
      
      const pausedOrNot = await farmDetails?.callStatic.isPaused()
      setPause(pausedOrNot)
      
      const farmRewardBalance = await farmDetails?.callStatic.rewardBalance()
      setRewardBalance(ethers.utils.formatEther(farmRewardBalance))

      const farmBitgertToken = await farmDetails?.callStatic.bitgert()
      setBitgertToken(farmBitgertToken)
      
      const farmBonusMultiplier = await farmDetails?.callStatic.BONUS_MULTIPLIER()
      setBonusMultiplier(farmBonusMultiplier.toString())

      const farmBitgertPerBlock = await farmDetails?.callStatic.bitgertPerBlock()
      setBitgertPerBlock(farmBitgertPerBlock.toString())

      const farmToBurn = await farmDetails?.callStatic.toBurn()
      setToBurn(farmToBurn.toString())

      const farmIsMint = await farmDetails?.callStatic.isMint()
      setIsMint(farmIsMint)

      const tokenContract = getTokenContract(farmBitgertToken, library, account)

      const TDecimals = await tokenContract?.callStatic.decimals()
      setTokenDecimals(TDecimals)

      const totalFarmAllowance = await tokenContract?.callStatic.allowance(account, FARM_ADDRESS)
      setAllowance(ethers.utils.formatEther(totalFarmAllowance))

      const sigCheckDetails = getSigCheckContract(chainId, library, account)

      const isOwnerOrNot = await sigCheckDetails?.callStatic.isOwner(account)

      setIsOwner(isOwnerOrNot)

      getAllFarmOwner()
        .then((response) => {
          setLoading(false)
          setFarms(response)

          let count = 0
          for (let i = 0; i < response.length; i++) {
            if (response[i].is_approved === true) {
              break
            } else {
              count++
            }
          }
          if (response.length === count) {
            setText(true)
          }

        })
        .catch((err) => {
          setLoading(false)
          console.log(err)
          swal('Oops', 'Something went wrong!', 'error')
        })
    }

    fetchFarmList()
  }, [account, library, chainId, ChangeToBurn, EmissionRate, Multiplier, RewardToken, WithdrawAmount, DepositRewardAmount])

  const handleChange = (name) => (event) => {
    const value = event.target.value
    setFormData({ ...formData, [name]: value })
  }

  const handlePause = async () => {

    if (!chainId || !library || !account) return

    const farmDetails = getSigCheckContract(chainId, library, account)

    const payload = [FARM_ADDRESS, 'setPause()']

    const method: (...args: any) => Promise<TransactionResponse> = farmDetails['submitTransaction(address,string)']
    const args: Array<string[] | string | boolean | number> = payload

    setAttemptingTxn(true)
    await method(...args)
      .then((response) => {
        swal('Congratulations!', `The request to ${pause ? 'Unpause' : 'Pause'} the stake has been generated`, 'success')
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

  const handleIsMint = async () => {

    if (!chainId || !library || !account) return

    const farmDetails = getSigCheckContract(chainId, library, account)

    const payload = [FARM_ADDRESS, 'updateIsMint()']

    const method: (...args: any) => Promise<TransactionResponse> = farmDetails['submitTransaction(address,string)']
    const args: Array<string[] | string | boolean | number> = payload

    setAttemptingTxn(true)
    await method(...args)
      .then((response) => {
        swal('Congratulations!', `The request to ${isMint ? 'stop Minting' : 'Start Minting'} in the farm has been generated`, 'success')
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

  const handleBitgertToken = async () => {

    if (!chainId || !library || !account || !RewardToken) return

    const farmDetails = getSigCheckContract(chainId, library, account)

    const payload = [
      FARM_ADDRESS, 
      'updateBitgert(address)',  
      RewardToken,
    ]


    const method: (...args: any) => Promise<TransactionResponse> = farmDetails['submitTransaction(address,string,address)']
    const args: Array<string[] | string | boolean | number> = payload

    setAttemptingTxn(true)
    await method(...args)
      .then((response) => {
        setFormData({
          ...formData,
          chain_id: '32520',
          owner_address: '',
          RewardToken: '',
          Multiplier: 0,
          EmissionRate: 0,
          ChangeToBurn: 0,
          WithdrawAmount: 0,
          DepositRewardAmount: 0,
        })
        swal('Congratulations!', 'The request for changing the bitgert reward token has been made!', 'success')
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

  const handleEmergencyRewardWithdraw = async () => {

    if (!chainId || !library || !account || !WithdrawAmount) return

    const farmDetails = getSigCheckContract(chainId, library, account)

    const payload = [
      FARM_ADDRESS, 
      'emergencyWithdrawRewardToken(uint256)',  
      ethers.utils.parseUnits(WithdrawAmount.toString(), parseInt(tokenDecimals)).toString(),
    ]


    const method: (...args: any) => Promise<TransactionResponse> = farmDetails['submitTransaction(address,string,uint256)']
    const args: Array<string[] | string | boolean | number> = payload

    setAttemptingTxn(true)
    await method(...args)
      .then((response) => {
        setFormData({
          ...formData,
          chain_id: '32520',
          owner_address: '',
          RewardToken: '',
          Multiplier: 0,
          EmissionRate: 0,
          ChangeToBurn: 0,
          WithdrawAmount: 0,
          DepositRewardAmount: 0,
        })
        swal('Congratulations!', 'The request for emergency withdraw of reward tokens has been raised!', 'success')
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

  const handlechangeToBurn = async () => {

    if (!chainId || !library || !account || !ChangeToBurn) return

    const farmDetails = getSigCheckContract(chainId, library, account)

    const payload = [
      FARM_ADDRESS, 
      'changeToBurn(uint256)',  
      ChangeToBurn,
    ]


    const method: (...args: any) => Promise<TransactionResponse> = farmDetails['submitTransaction(address,string,uint256)']
    const args: Array<string[] | string | boolean | number> = payload

    setAttemptingTxn(true)
    await method(...args)
      .then((response) => {
        setFormData({
          ...formData,
          chain_id: '32520',
          owner_address: '',
          RewardToken: '',
          Multiplier: 0,
          EmissionRate: 0,
          ChangeToBurn: 0,
          WithdrawAmount: 0,
          DepositRewardAmount: 0,
        })
        swal('Congratulations!', 'The request to change ToBurn has been made!', 'success')
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

  const handleEmissionRate = async () => {

    if (!chainId || !library || !account || !EmissionRate) return

    const farmDetails = getSigCheckContract(chainId, library, account)

    const payload = [
      FARM_ADDRESS, 
      'updateEmissionRate(uint256)',  
      EmissionRate,
    ]

    const method: (...args: any) => Promise<TransactionResponse> = farmDetails['submitTransaction(address,string,uint256)']
    const args: Array<string[] | string | boolean | number> = payload

    setAttemptingTxn(true)
    await method(...args)
      .then((response) => {
        setFormData({
          ...formData,
          chain_id: '32520',
          owner_address: '',
          RewardToken: '',
          Multiplier: 0,
          EmissionRate: 0,
          ChangeToBurn: 0,
          WithdrawAmount: 0,
          DepositRewardAmount: 0,
        })
        swal('Congratulations!', 'The request to change the Bitgert Per Block!', 'success')
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

  const handleMultiplier = async () => {

    if (!chainId || !library || !account || !Multiplier) return

    const farmDetails = getSigCheckContract(chainId, library, account)

    const payload = [
      FARM_ADDRESS, 
      'updateMultiplier(uint256)',  
      Multiplier,
    ]


    const method: (...args: any) => Promise<TransactionResponse> = farmDetails['submitTransaction(address,string,uint256)']
    const args: Array<string[] | string | boolean | number> = payload

    setAttemptingTxn(true)
    await method(...args)
      .then((response) => {
        setFormData({
          ...formData,
          chain_id: '32520',
          owner_address: '',
          RewardToken: '',
          Multiplier: 0,
          EmissionRate: 0,
          ChangeToBurn: 0,
          WithdrawAmount: 0,
          DepositRewardAmount: 0,
        })
        swal('Congratulations!', 'The request to change the Bonus multiplier has been raised!', 'success')
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

  const handleAllowanceApprove = async () => {
    if (!chainId || !library || !account ) return
    const tokenContract = getTokenContract(bitgertToken, library, account)

    const TBalance = await tokenContract?.callStatic.balanceOf(account)
    const TDecimals = await tokenContract?.callStatic.decimals()

    const payload = [
      FARM_ADDRESS,
      MaxUint256,
    ]

    const method: (...args: any) => Promise<TransactionResponse> = tokenContract!.approve
    const args: Array<string | string[] | string | BigNumber | number> = payload

    setAttemptingTxn(true)
    setIsApproved(false)
    await method(...args)
      .then((response) => {
        swal('Congratulations!', 'You have approved to deposit the reward tokens in the contract!', 'success')

        setIsApproved(true)
        setAttemptingTxn(false)
        setTxHash(response.hash)
      })
      .catch((e) => {
        setIsApproved(false)
        setAttemptingTxn(false)
        // we only care if the error is something _other_ than the user rejected the tx
        if (e?.code !== "ACTION_REJECTED") {
          console.error(e)
          alert(e.message)
        }
      })
  }

  const handleAllowanceDeposit = async () => {
    if (!chainId || !library || !account || !DepositRewardAmount) return

    const farmDetails = getFarmContract(chainId, library, account)

    const payload = [
      ethers.utils.parseUnits(DepositRewardAmount.toString(), parseInt(tokenDecimals)).toString(),
    ]

    const method: (...args: any) => Promise<TransactionResponse> = farmDetails!.depositRewardToken
    const args: Array<string | number | boolean> = payload

    setAttemptingTxn(true)
    setIsApproved(false)
    await method(...args)
      .then((response) => {
        setFormData({
          ...formData,
          chain_id: '32520',
          owner_address: '',
          RewardToken: '',
          Multiplier: 0,
          EmissionRate: 0,
          ChangeToBurn: 0,
          WithdrawAmount: 0,
          DepositRewardAmount: 0,
        })
        swal('Congratulations!', 'Reward Tokens has been deposited in the Farm contract!', 'success')
        setIsApproved(true)
        setAttemptingTxn(false)
        setTxHash(response.hash)
      })
      .catch((e) => {
        setIsApproved(false)
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
        <TableWrapper>
          {loading && (
            <LoaderWrapper>
              <Oval
                height={100}
                width={100}
                color="#2669f5"
                wrapperStyle={{}}
                wrapperClass=""
                visible={true}
                ariaLabel="oval-loading"
                secondaryColor="#4a81f8"
                strokeWidth={2}
                strokeWidthSecondary={2}
              />
            </LoaderWrapper>
          )}

          {isOwner && (
            <>
            {/* <div className="d-flex justify-content-around my-5"> */}
            {/* <Flex justifyContent="space-around" margin="3rem">
              <div className="mb-3 mr-4"> */}
          <Flex alignItems={'center'} justifyContent={'space-around'}>

                { (parseFloat(allowance) < DepositRewardAmount || parseFloat(allowance) === 0) &&
                <ButtonContainer>
                  <Button scale="sm" className="mx-2" variant="tertiary" onClick={handleAllowanceApprove}>
                    Approve
                  </Button>
                </ButtonContainer>
                }

                <ButtonContainer>
                  <Button style={{marginRight: "5px"}} variant="tertiary" onClick={handleAllowanceDeposit}>
                    Deposit Reward Tokens
                  </Button>
                  <Tooltip show={feeTooltip1} placement="top" text={`Total Rewards present: ${rewardBalance} `}>
                  <FaInfoCircle
                    className="mx-2" color='grey'
                    onMouseEnter={() => setFeeTooltip1(true)}
                    onMouseLeave={() => setFeeTooltip1(false)}
                  />
                  </Tooltip>
                {/* <div className="mt-2"> */}
                  <InputExtended
                    placeholder="Deposit"
                    className="mt-3"
                    scale="sm"
                    value={DepositRewardAmount}
                    onChange={handleChange('DepositRewardAmount')}
                    />
                </ButtonContainer>
                {/* </div> */}
              {/* </div> */}
              {/* <div className="mb-3 mr-4"> */}
              <ButtonContainer>
                <Button variant="tertiary" onClick={handleEmergencyRewardWithdraw}>
                  Withdraw Reward Tokens
                </Button>
                <br />
                {/* <div className="mt-2"> */}
                  <InputExtended
                    placeholder="Withdraw"
                    className="mt-3"
                    scale="sm"
                    value={WithdrawAmount}
                    onChange={handleChange('WithdrawAmount')}
                    />
                    </ButtonContainer>
                {/* </div>
              </div> */}
            </Flex>
            {/* <div className="d-flex justify-content-around my-5"> */}

            {/* <Flex justifyContent="space-around" margin="3rem"> */}
          <Flex alignItems={'center'} justifyContent={'space-around'}>
            {/* <FlexExtended> */}
              <ButtonContainer>
              <Button  variant="secondary" onClick={handlePause}>
                {`${pause ? 'Unpause' : 'Pause'} it`}
              </Button>
              </ButtonContainer>

              {/* <div className="mb-3 mr-4"> */}
              <ButtonContainer>
                <Button  variant="secondary" onClick={handleBitgertToken}>
                  {`Change Reward Token`}
                </Button>
                <Tooltip show={feeTooltip2} placement="top" text={`Bitgert Reward Token is : ${bitgertToken} `}>
                  <FaInfoCircle
                    className="mx-2" color='grey'
                    onMouseEnter={() => setFeeTooltip2(true)}
                    onMouseLeave={() => setFeeTooltip2(false)}
                  />
                </Tooltip>
                <br />
                <br />
                {/* <div className="mt-2"> */}
                  <InputExtended
                    placeholder="Update"
                    className="mt-3"
                    scale="sm"
                    value={RewardToken}
                    onChange={handleChange('RewardToken')}
                    />
                    </ButtonContainer>
                {/* </div>
              </div> */}
              <ButtonContainer>
              <Button scale="sm" variant="secondary" onClick={handleIsMint}>
                {`${isMint ? 'stop Mint' : 'Start Mint'}`}
              </Button>
              </ButtonContainer>

              </Flex>

            {/* <Flex justifyContent="space-between" margin="0rem"> */}

              {/* <div className="mb-3 mr-4"> */}
          <Flex alignItems={'center'} justifyContent={'space-around'}>
              {/* <FlexExtended> */}
              <ButtonContainer>  
                <Button variant="secondary" onClick={handleMultiplier}>
                  Update Multiplier
                </Button>
                <Tooltip show={feeTooltip3} placement="top" text={`Current Multiplier is : ${multiplier} `}>
                <FaInfoCircle
                  className="mx-2" color='grey'
                  onMouseEnter={() => setFeeTooltip3(true)}
                  onMouseLeave={() => setFeeTooltip3(false)}
                />
                </Tooltip>
                <br />
                {/* <div className="mt-2"> */}
                  <InputExtended
                    placeholder="Update"
                    className="mt-3"
                    scale="sm"
                    value={Multiplier}
                    onChange={handleChange('Multiplier')}
                    />
                    </ButtonContainer>
                {/* </div>
              </div>
              <div className="mb-3 mr-4">   */}
              <ButtonContainer>
                  <Button  variant="secondary" onClick={handleEmissionRate}>
                    Update Emission Rate
                  </Button>
                  <Tooltip show={feeTooltip4} placement="top" text={`Bitgert per block is : ${bitgertPerBlock} `}>
                    <FaInfoCircle
                      className="mx-2" color='grey'
                      onMouseEnter={() => setFeeTooltip4(true)}
                      onMouseLeave={() => setFeeTooltip4(false)}
                    />
                    </Tooltip>
                    <br />
                    {/* <div className="mt-2"> */}
                      <InputExtended
                        placeholder="Update"
                        className="mt-3"
                        scale="sm"
                        value={EmissionRate}
                        onChange={handleChange('EmissionRate')}
                        />
                        </ButtonContainer>
                    {/* </div>
                </div> */}
                {/* <div className="mb-3 mr-4">   */}

                <ButtonContainer>
                    <Button variant="secondary" onClick={handlechangeToBurn}>
                      Update ToBurn
                    </Button>
                    <Tooltip show={feeTooltip5} placement="top" text={`to burn value is : ${toBurn} `}>
                    <FaInfoCircle
                      className="mx-2" color='grey'
                      onMouseEnter={() => setFeeTooltip5(true)}
                      onMouseLeave={() => setFeeTooltip5(false)}
                    />
                    </Tooltip>
                    <br />
                    {/* <div className="mt-2"> */}
                      <InputExtended
                        placeholder="Update"
                        className="mt-3"
                        scale="sm"
                        value={ChangeToBurn}
                        onChange={handleChange('ChangeToBurn')}
                        />
                        </ButtonContainer>
                    {/* </div>
                </div> */}
                </Flex>
          </>
          )}

          {Object.entries(farms).length !== 0 && (
            <Table>
              <thead>
              <tr>
                  <Th> Token  </Th>
                  <Th> Liquidity </Th>
                  <Th> APY </Th>
                  <Th> Investment </Th>
                  <Th> Amount </Th>
                  <Th> Action </Th>
                </tr>
              </thead>
              <tbody>
                {!text &&
                  farms.map((farm) =>
                    farm.is_approved === true ? <FarmUser farm={farm} key={farm._id} /> : null
                  )}
              </tbody>
            </Table>
          )}
        </TableWrapper>
        {text && <StyledText>No farms!</StyledText>}
      </Container>
      <div className="mt-5"> </div>
    </>
  )
}