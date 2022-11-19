/* eslint-disable */
import React, { useState, useEffect } from 'react'
// import { Link } from 'react-router-dom'
import swal from 'sweetalert'
import { Oval } from 'react-loader-spinner'

import './style.css'

import Container from 'components/Container'
import StakeUser from 'components/StakeUser'
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
import { useStakeContract, useDateTimeContract, useTokenContract } from 'hooks/useContract'
import { getStakeContract, getTokenContract, getSigCheckContract } from 'utils'
import { STAKE_ADDRESS } from 'constants/abis/stake'

import { getAllStakeOwner } from './apicalls'
// import getAllStakeUser from './apicalls'
import {
  TableWrapper,
  Table,
  LoaderWrapper,
  StyledText,
  Flex as FlexExtended,
  InputExtended,
  ButtonContainer,
} from './styleds'

// const InputExtended = styled(Input)`
//   width: 100px;
// `

export default function StakesCreatedDirectory() {
  const { account, chainId, library } = useActiveWeb3React()
  const [tokenDetails, setTokenDetails] = useState<any>({})
  const [stakes, setStakes] = useState<any[]>([])
  // const [stakeID, setStakeID] = useState<any>()
  const [tokenAddress, setTokenAddress] = useState<string>('')
  const [isOwner, setIsOwner] = useState<boolean>(false)
  const [pause, setPause] = useState<boolean>(false)
  const [stakeReward, setStakeReward] = useState<boolean>(false)
  const [rewardBalance, setRewardBalance] = useState<string>('')
  // const [rewardPerBlock, setRewardPerBlock] = useState<string>('')
  const [tokenDecimals, setTokenDecimals] = useState<string>('')
  const [totalBalance, setTotalBalance] = useState<string>('')
  const [feeTooltip1, setFeeTooltip1] = useState<boolean>(false)
  const [feeTooltip2, setFeeTooltip2] = useState<boolean>(false)
  const [allowance, setAllowance] = useState<string>('')
  const [txHash, setTxHash] = useState<string>('')
  const [attemptingTxn, setAttemptingTxn] = useState<boolean>(false)
  const [isApproved, setIsApproved] = useState<boolean>(false)
  const [text, setText] = useState<boolean>(false)
  const [loading, setLoading] = useState<boolean>(false)

  const [formData, setFormData] = useState({
    chain_id: '32520',
    owner_address: '',
    // RewardPerBlock: 0,
    WithdrawAmount: 0,
    DepositRewardAmount: 0,
  })

  // destructure
  const { owner_address, WithdrawAmount, DepositRewardAmount } = formData

  useEffect(() => {
    const fetchStakeList = async () => {
      setLoading(true)

      if (!chainId || !library || !account) return

      const stakeDetails = getStakeContract(chainId, library, account)

      // const pausedOrNot = await stakeDetails?.callStatic.isPaused( )
      // setPause(pausedOrNot)

      // const rewardOrNot = await stakeDetails?.callStatic.bonusEndBlock()
      // setStakeReward(rewardOrNot)

      const stakeRewardBalance = await stakeDetails?.callStatic.rewardBalance()
      setRewardBalance(ethers.utils.formatEther(stakeRewardBalance))

      // const stakeRewardPerBlock = await stakeDetails?.callStatic.rewardPerBlock()
      // setRewardPerBlock(stakeRewardPerBlock.toString())

      const stakeRewardToken = await stakeDetails?.callStatic.rewardToken()
      setTokenAddress(stakeRewardToken)

      const tokenContract = getTokenContract(stakeRewardToken, library, account)

      const TDecimals = await tokenContract?.callStatic.decimals()
      setTokenDecimals(TDecimals)

      const totalStakeBalance = await tokenContract?.callStatic.balanceOf(STAKE_ADDRESS)
      setTotalBalance(ethers.utils.formatEther(totalStakeBalance))

      const totalStakeAllowance = await tokenContract?.callStatic.allowance(account, STAKE_ADDRESS)
      setAllowance(ethers.utils.formatEther(totalStakeAllowance))

      const sigCheckDetails = getSigCheckContract(chainId, library, account)

      const isOwnerOrNot = await sigCheckDetails?.callStatic.isOwner(account)

      setIsOwner(isOwnerOrNot)

      getAllStakeOwner()
        .then((response) => {
          setLoading(false)
          setStakes(response)

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

    fetchStakeList()
  }, [account, library, chainId, WithdrawAmount, DepositRewardAmount])

  const handleChange = (name) => (event) => {
    const value = event.target.value
    setFormData({ ...formData, [name]: value })
  }

  const handleEmergencyRewardWithdraw = async () => {
    if (!chainId || !library || !account || !WithdrawAmount) return

    const stakeDetails = getSigCheckContract(chainId, library, account)

    const payload = [
      STAKE_ADDRESS,
      'emergencyRewardWithdraw(uint256)',
      ethers.utils.parseUnits(WithdrawAmount.toString(), parseInt(tokenDecimals)).toString(),
    ]

    const method: (...args: any) => Promise<TransactionResponse> =
      stakeDetails['submitTransaction(address,string,uint256)']
    const args: Array<string[] | string | boolean | number> = payload

    setAttemptingTxn(true)
    await method(...args)
      .then((response) => {
        setFormData({
          ...formData,
          chain_id: '32520',
          owner_address: '',
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
        if (e?.code !== 'ACTION_REJECTED') {
          console.error(e)
          alert(e.message)
        }
      })
  }

  const handleAllowanceApprove = async () => {
    if (!chainId || !library || !account) return
    const tokenContract = getTokenContract(tokenAddress, library, account)

    const TBalance = await tokenContract?.callStatic.balanceOf(account)
    const TDecimals = await tokenContract?.callStatic.decimals()

    const payload = [STAKE_ADDRESS, MaxUint256]

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
        if (e?.code !== 'ACTION_REJECTED') {
          console.error(e)
          alert(e.message)
        }
      })
  }

  const handleAllowanceDeposit = async () => {
    if (!chainId || !library || !account || !DepositRewardAmount) return

    const stakeDetails = getStakeContract(chainId, library, account)

    const payload = [ethers.utils.parseUnits(DepositRewardAmount.toString(), parseInt(tokenDecimals)).toString()]

    const method: (...args: any) => Promise<TransactionResponse> = stakeDetails!.depositRewardToken
    const args: Array<string | number | boolean> = payload

    setAttemptingTxn(true)
    setIsApproved(false)
    await method(...args)
      .then((response) => {
        setFormData({
          ...formData,
          chain_id: '32520',
          owner_address: '',
          WithdrawAmount: 0,
          DepositRewardAmount: 0,
        })
        swal('Congratulations!', 'Reward Tokens has been deposited in the Stake contract!', 'success')
        setIsApproved(true)
        setAttemptingTxn(false)
        setTxHash(response.hash)
      })
      .catch((e) => {
        setIsApproved(false)
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
        <TableWrapper>
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

          {isOwner && (
            <>
              {/* <div className="d-flex justify-content-around my-5"> */}
              {/* <div className="mb-3 mr-4"> */}
              {/* <Flex justifyContent="space-around" margin="3rem"> */}
              <Flex alignItems={'center'} justifyContent={'space-around'}>
                <ButtonContainer>
                  {(parseFloat(allowance) < DepositRewardAmount || parseFloat(allowance) === 0) && (
                    <Button
                      scale="sm"
                      style={{ marginRight: '5px' }}
                      variant="tertiary"
                      onClick={handleAllowanceApprove}
                    >
                      Approve
                    </Button>
                  )}

                  <Button scale="sm" style={{ marginRight: '5px' }} variant="tertiary" onClick={handleAllowanceDeposit}>
                    Deposit Reward Tokens
                  </Button>
                  <Tooltip show={feeTooltip1} placement="top" text={`Total Rewards present: ${rewardBalance} `}>
                    <FaInfoCircle
                      className="mx-2"
                      color="grey"
                      onMouseEnter={() => setFeeTooltip1(true)}
                      onMouseLeave={() => setFeeTooltip1(false)}
                    />
                  </Tooltip>
                  <br />
                  <InputExtended
                    placeholder="Deposit"
                    className="mt-3"
                    scale="sm"
                    value={DepositRewardAmount}
                    onChange={handleChange('DepositRewardAmount')}
                  />
                </ButtonContainer>

                <ButtonContainer>
                  <Button scale="sm" variant="tertiary" onClick={handleEmergencyRewardWithdraw}>
                    Withdraw Reward Tokens
                  </Button>
                  <br />
                  <InputExtended
                    placeholder="Withdraw"
                    className="mt-3"
                    scale="sm"
                    value={WithdrawAmount}
                    onChange={handleChange('WithdrawAmount')}
                  />
                </ButtonContainer>
              </Flex>
            </>
          )}

          {Object.entries(stakes).length !== 0 && (
            <Table>
              <thead>
                <tr>
                  <th> Token </th>
                  <th> Funds </th>
                  <th> APY </th>
                  <th> Investment </th>
                  <th> Amount </th>
                  <th> Action </th>
                </tr>
              </thead>
              <tbody>
                {!text &&
                  stakes.map((stake) =>
                    stake.is_approved === true ? <StakeUser stake={stake} key={stake._id} /> : null
                  )}
              </tbody>
            </Table>
          )}
        </TableWrapper>
        {text && <StyledText>No stakes!</StyledText>}
      </Container>
      <div className="mt-5"> </div>
    </>
  )
}
