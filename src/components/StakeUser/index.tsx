import React, { useState, useEffect } from 'react'
import { Button, CardBody, Input, Flex } from '@evofinance9/uikit'

import { ethers } from 'ethers'
import { Link } from 'react-router-dom'
import { FaCopy, FaInfoCircle } from 'react-icons/fa'
import copy from 'copy-to-clipboard'
import Tooltip from 'components/Tooltip'

import swal from 'sweetalert'

import { BigNumber } from '@ethersproject/bignumber'
import { TransactionResponse } from '@ethersproject/providers'
import { MaxUint256 } from '@ethersproject/constants'
import styled from 'styled-components'
import { useQuery, gql } from '@apollo/client'

import { useActiveWeb3React } from 'hooks'
import { useStakeContract, useDateTimeContract, useTokenContract } from 'hooks/useContract'
import { getStakeContract, getTokenContract, getSigCheckContract, bnSub, formatTokenAmount } from 'utils'
import TransactionConfirmationModal from 'components/TransactionConfirmationModal'

import { STAKE_ADDRESS } from 'constants/abis/stake'

const InputExtended = styled(Input)`
  width: 100px;
`

const ButtonContainer = styled.div`
  align-items: center;
  justify-content: center;
  gap: 1rem;
  margin-bottom: 1rem;
`

const td = styled.td`
  color: grey;
`

const PRICE_QUERY = gql`
  query Tokens(
    $where: TokenDayData_filter
    $orderBy: TokenDayData_orderBy
    $orderDirection: OrderDirection
    $first: Int
    $tokensWhere2: Token_filter
  ) {
    tokens(where: $tokensWhere2) {
      id
      name
      tokenDayData(where: $where, orderBy: $orderBy, orderDirection: $orderDirection, first: $first) {
        dailyVolumeUSD
        totalLiquidityUSD
      }
    }
  }
`

const StakeUser = ({ stake }) => {
  const { account, chainId, library } = useActiveWeb3React()
  const [isApproved, setIsApproved] = useState<boolean>(false)
  const [isApprovedDeposit, setIsApprovedDeposit] = useState<boolean>(false)
  const [isApprovedReward, setIsApprovedReward] = useState<boolean>(false)
  const [isOwner, setIsOwner] = useState<boolean>(false)
  const [isCreator, setIsCreator] = useState<boolean>(false)
  const [txHash, setTxHash] = useState<string>('')
  const [balance, setBalance] = useState<string>('')
  const [rewardPerBlock, setRewardPerBlock] = useState<string>('')
  const [stakeBonusEndBlock, setStakeBonusEndBlock] = useState<string>('')
  const [stakeRewardToken, setStakeRewardToken] = useState<string>('')
  const [stakeRewardBalance, setStakeRewardBalance] = useState<string>('')
  const [stakedTokenBalance, setStakedTokenBalance] = useState<string>('')
  const [pause, setPause] = useState<boolean>(false)
  const [rewardStop, setRewardStop] = useState<boolean>(false)
  const [showConfirm, setShowConfirm] = useState<boolean>(false)
  const [isOpen, setIsOpen] = useState<boolean>(false)
  const [rewardTokenDecimals, setRewardTokenDecimals] = useState<string>('')
  const [allowanceReward, setAllowanceReward] = useState<string>('')
  const [onCopyValue, setOnCopyValue] = useState<string>('')
  const [APY, setAPY] = useState<string>('')
  const [feeTooltip1, setFeeTooltip1] = useState<boolean>(false)
  const [feeTooltip2, setFeeTooltip2] = useState<boolean>(false)
  const [feeTooltip3, setFeeTooltip3] = useState<boolean>(false)
  const [feeTooltip4, setFeeTooltip4] = useState<boolean>(false)
  const [feeTooltip5, setFeeTooltip5] = useState<boolean>(false)
  const [feeTooltip6, setFeeTooltip6] = useState<boolean>(false)
  const [depositAmount, setDepositAmount] = useState<string>('')
  const [attemptingTxn, setAttemptingTxn] = useState<boolean>(false)

  const { data: priceGraphData, refetch: priceRefetch } = useQuery(PRICE_QUERY)

  const [formData, setFormData] = useState({
    chain_id: '32520',
    owner_address: '',
    amount: 0,
    EmissionRate: 0,
    BonusEndBlock: 0,
    WithdrawAmount: 0,
    DepositRewardAmount: 0,
  })

  // destructure
  const { owner_address, amount, EmissionRate, BonusEndBlock, WithdrawAmount, DepositRewardAmount} = formData

  useEffect(() => {
    const fetch = async () => {

      
      if (!chainId || !library || !account) return
      
      // setIsCreator
      if (stake.stakeCreator_id === account ) {
        setIsCreator(true)
      } else {
        setIsCreator(false)
      }

      // For sigCheck details
      const sigCheckDetails = getSigCheckContract(chainId, library, account)
      
      const isOwnerOrNot = await sigCheckDetails?.callStatic.isOwner(account)
      
      setIsOwner(isOwnerOrNot)
      
      // For stake details
      const stakeDetails = getStakeContract(chainId, library, account)
      
      const pausedOrNot = await stakeDetails?.callStatic.isPaused(stake.pool_id - 1)
      setPause(pausedOrNot)
      
      const userDeposit = await stakeDetails?.callStatic.userInfo(stake.pool_id - 1, account)
      setDepositAmount(ethers.utils.formatEther(userDeposit.amount.toString()))
      
      const poolInfo = await stakeDetails?.callStatic.poolInfo(stake.pool_id - 1)
      setRewardPerBlock(poolInfo.rewardPerBlock.toString())
      setStakeBonusEndBlock(poolInfo.bonusEndBlock.toString())
      const rewardToken = poolInfo.rewardToken.toString()
      setStakeRewardToken(poolInfo.rewardToken.toString())
      setStakeRewardBalance(formatTokenAmount(poolInfo.rewardBalance.toString(), parseInt(stake.reward_token_decimal)).toString())
      setStakedTokenBalance(formatTokenAmount(poolInfo.stakeBalance.toString(), parseInt(stake.token_decimal)).toString())
      
      const blockNumber = await library.getBlockNumber()
      
      if (blockNumber > poolInfo.bonusEndBlock) {
        setRewardStop(true)
      } else {
        setRewardStop(false)
      }
      
      // For reward token details
      const rewardTokenContract = getTokenContract(rewardToken, library, account)
      
      const totalrewardAllowance = await rewardTokenContract?.callStatic.allowance(account, STAKE_ADDRESS)
      setAllowanceReward(ethers.utils.formatEther(totalrewardAllowance))

      const RTokenDecimals = await rewardTokenContract?.callStatic.decimals()
      setRewardTokenDecimals(RTokenDecimals)
      
      // For stake token details
      const tokenContract = getTokenContract(stake.token_address, library, account)
      
      setOnCopyValue(stake.token_address)
      
      const accountBalance = await tokenContract?.callStatic.balanceOf(account)
      setBalance(ethers.utils.formatEther(accountBalance))

      const allowanceAmount = await tokenContract?.callStatic.allowance(account, STAKE_ADDRESS)
      const allowanceEther = ethers.utils.formatEther(allowanceAmount)

      if (parseFloat(allowanceEther) >= amount && parseFloat(allowanceEther) > 0) {
        setIsApproved(true)
      } else {
        setIsApproved(false)
      }
      
    }

    fetch()
  }, [stake, stake.stakeOwner_id, stake.token_address, account, library, amount, chainId, WithdrawAmount, DepositRewardAmount])

  useEffect(() => {
    if (stake?.token_address) {
    priceRefetch({
      where: {
        token: stake.token_address.toLowerCase(),
      },
      orderBy: 'date',
      orderDirection: 'desc',
      first: 1,
      tokensWhere2: {
        id: stake.token_address.toLowerCase(),
      },
    })
  }
  }, [stake.token_address, priceRefetch])

  useEffect(() => {
    const fetch = async () => {
      if (!priceGraphData || !Array.isArray(priceGraphData?.tokens)) {
        return
      }
      const VolumeUSD365 = await (priceGraphData.tokens[0].tokenDayData[0].dailyVolumeUSD) * 365
      console.log(VolumeUSD365)
      // calculate the fee share of liquidity providers in the pool (based on the 0.17% trading fee structure)
      const volumeUSD = VolumeUSD365 * 0.17 / 100
      console.log(volumeUSD)
      const LIQ_GRPH = await priceGraphData.tokens[0].tokenDayData[0].totalLiquidityUSD
      console.log(LIQ_GRPH)
      if (LIQ_GRPH !== 0) {
        const APYValue = (volumeUSD / LIQ_GRPH) * 100
        console.log(APYValue.toString())
        setAPY(APYValue.toString())
      } else {
        setAPY('')
      }
    }
    fetch()
  }, [priceGraphData])

  const handleChange = (name) => (event) => {
    const value = event.target.value
    setFormData({ ...formData, [name]: value })
  }

  const handleDismissConfirmation = () => {
    setIsOpen(false)
    setShowConfirm(false)
    setTxHash('')
  }

  const copyToClipboard = () => {
    copy(stake.token_address)
    setOnCopyValue('Copied!')
    setTimeout(() => {
      setOnCopyValue(stake.token_address)
    }, 1500)
  }


  const handleEmergencyRewardWithdraw = async (stakeID) => {
    if (!chainId || !library || !account || !WithdrawAmount) return

    const stakeDetails = getSigCheckContract(chainId, library, account)

    const payload = [
      STAKE_ADDRESS,
      'emergencyRewardWithdraw(uint256,uint256)',
      parseInt(stakeID) - 1,
      ethers.utils.parseUnits(WithdrawAmount.toString(), parseInt(rewardTokenDecimals)).toString(),
    ]

    const method: (...args: any) => Promise<TransactionResponse> =
      stakeDetails['submitTransaction(address,string,uint256,uint256)']
    const args: Array<string[] | string | boolean | number> = payload

    setAttemptingTxn(true)
    await method(...args)
      .then((response) => {
        setFormData({
          ...formData,
          chain_id: '32520',
          owner_address: '',
          amount: 0,
          EmissionRate: 0,
          BonusEndBlock: 0,
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

    const tokenContract = getTokenContract(stakeRewardToken, library, account)

    const TBalance = await tokenContract?.callStatic.balanceOf(account)
    const TDecimals = await tokenContract?.callStatic.decimals()

    const payload = [STAKE_ADDRESS, MaxUint256]

    const method: (...args: any) => Promise<TransactionResponse> = tokenContract!.approve
    const args: Array<string | string[] | string | BigNumber | number> = payload

    setAttemptingTxn(true)
    setIsApprovedReward(false)
    await method(...args)
      .then((response) => {
        swal('Congratulations!', 'You have approved to deposit the reward tokens in the contract!', 'success')

        setIsApprovedReward(true)
        setAttemptingTxn(false)
        setTxHash(response.hash)
      })
      .catch((e) => {
        setIsApprovedReward(false)
        setAttemptingTxn(false)
        // we only care if the error is something _other_ than the user rejected the tx
        if (e?.code !== 'ACTION_REJECTED') {
          console.error(e)
          alert(e.message)
        }
      })
  }

  const handleAllowanceDeposit = async (stakeID) => {
    if (!chainId || !library || !account || !DepositRewardAmount) return

    const stakeDetails = getStakeContract(chainId, library, account)

    const payload = [
      parseInt(stakeID) - 1,
      ethers.utils.parseUnits(DepositRewardAmount.toString(), parseInt(rewardTokenDecimals)).toString()
    ]

    const method: (...args: any) => Promise<TransactionResponse> = stakeDetails!.depositRewardToken
    const args: Array<string | number | boolean> = payload

    setAttemptingTxn(true)
    setIsApprovedDeposit(false)
    await method(...args)
      .then((response) => {
        setFormData({
          ...formData,
          chain_id: '32520',
          owner_address: '',
          amount: 0,
          EmissionRate: 0,
          BonusEndBlock: 0,
          WithdrawAmount: 0,
          DepositRewardAmount: 0,
        })
        swal('Congratulations!', 'Reward Tokens has been deposited in the Stake contract!', 'success')
        setIsApprovedDeposit(true)
        setAttemptingTxn(false)
        setTxHash(response.hash)
      })
      .catch((e) => {
        setIsApprovedDeposit(false)
        setAttemptingTxn(false)
        // we only care if the error is something _other_ than the user rejected the tx
        if (e?.code !== 'ACTION_REJECTED') {
          console.error(e)
          alert(e.message)
        }
      })
  }

  const handlePause = async (stakeID) => {
    if (!chainId || !library || !account) return

    const stakeDetails = getSigCheckContract(chainId, library, account)

    const payload = [STAKE_ADDRESS, 'setPause(uint256)', parseInt(stakeID) - 1]

    const method: (...args: any) => Promise<TransactionResponse> =
      stakeDetails['submitTransaction(address,string,uint256)']
    const args: Array<string[] | string | boolean | number> = payload

    setAttemptingTxn(true)
    await method(...args)
      .then((response) => {
        swal(
          'Congratulations!',
          `The request to ${pause ? 'Unpause' : 'Pause'} the stake has been generated`,
          'success'
        )
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

  const handleReward = async (stakeID) => {
    if (!chainId || !library || !account) return

    const stakeDetails = getSigCheckContract(chainId, library, account)

    const payload = [STAKE_ADDRESS, 'stopReward(uint256)', parseInt(stakeID) - 1]

    const method: (...args: any) => Promise<TransactionResponse> =
      stakeDetails['submitTransaction(address,string,uint256)']
    const args: Array<string[] | string | boolean | number> = payload

    setAttemptingTxn(true)
    await method(...args)
      .then((response) => {
        swal('Congratulations!', 'The request to stop the reward has been generated!', 'success')
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

  const handleEmissionRate = async (stakeID) => {
    if (!chainId || !library || !account || !EmissionRate) return

    const stakeDetails = getSigCheckContract(chainId, library, account)

    const payload = [STAKE_ADDRESS, 'updateRewardPerBlock(uint256,uint256)', parseInt(stakeID) - 1, EmissionRate]

    const method: (...args: any) => Promise<TransactionResponse> =
      stakeDetails['submitTransaction(address,string,uint256,uint256)']
    const args: Array<string[] | string | boolean | number> = payload

    setAttemptingTxn(true)
    await method(...args)
      .then((response) => {
        setFormData({
          ...formData,
          chain_id: '32520',
          owner_address: '',
          amount: 0,
          EmissionRate: 0,
          BonusEndBlock: 0,
          WithdrawAmount: 0,
          DepositRewardAmount: 0,
        })
        swal('Congratulations!', 'The request to change the Reward Per Block has been created!', 'success')
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

  const handleBonusEndBlock = async (stakeID) => {
    if (!chainId || !library || !account || !BonusEndBlock) return

    const stakeDetails = getSigCheckContract(chainId, library, account)

    const payload = [STAKE_ADDRESS, 'updateBonusEndBlock(uint256,uint256)', parseInt(stakeID) - 1, BonusEndBlock]

    const method: (...args: any) => Promise<TransactionResponse> =
      stakeDetails['submitTransaction(address,string,uint256,uint256)']
    const args: Array<string[] | string | boolean | number> = payload

    setAttemptingTxn(true)
    await method(...args)
      .then((response) => {
        setFormData({
          ...formData,
          chain_id: '32520',
          owner_address: '',
          amount: 0,
          EmissionRate: 0,
          BonusEndBlock: 0,
          WithdrawAmount: 0,
          DepositRewardAmount: 0,
        })
        swal('Congratulations!', 'The request to change the Bonus End Block has been created!', 'success')
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

  const handleAllowance = async (tokenAddress) => {
    if (!chainId || !library || !account || !tokenAddress) return

    const tokenContract = getTokenContract(tokenAddress, library, account)

    const payload = [STAKE_ADDRESS, MaxUint256]

    const method: (...args: any) => Promise<TransactionResponse> = tokenContract!.approve
    const args: Array<string | string[] | string | BigNumber | number> = payload

    setAttemptingTxn(true)
    setIsOpen(true)
    setIsApproved(false)

    await method(...args)
      .then(async (response: any) => {
        await response.wait()

        swal('Congratulations!', 'You have authorized to deposit tokens into stake!', 'success')

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

  const handleDeposit = async (stakeID) => {
    if (!chainId || !library || !account || !stakeID || !amount) return

    const tokenContract = getTokenContract(stake.token_address, library, account)
    const TBalance = await tokenContract?.callStatic.balanceOf(account)

    if (TBalance <= 0) {
      swal('Oops', 'You donot have enough balance to invest!', 'error')
      return
    }

    const stakeDetails = getStakeContract(chainId, library, account)

    const payload = [
      parseInt(stakeID) - 1,
      ethers.utils.parseUnits(amount.toString(), parseInt(stake.token_decimal)).toString(),
    ]

    const method: (...args: any) => Promise<TransactionResponse> = stakeDetails!.deposit
    const args: Array<string | number | boolean> = payload

    setAttemptingTxn(true)
    setIsOpen(true)

    await method(...args)
      .then(async (response: any) => {
        await response.wait()
        setFormData({
          ...formData,
          chain_id: '32520',
          owner_address: '',
          amount: 0,
          EmissionRate: 0,
          BonusEndBlock: 0,
          WithdrawAmount: 0,
          DepositRewardAmount: 0,
        })

        swal('Congratulations!', 'Amount deposited in Stake!', 'success')
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

  const handleWithdraw = async (stakeID) => {
    if (!chainId || !library || !account || !stakeID || amount === 0) return
    const stakeDetails = getStakeContract(chainId, library, account)

    const payload = [
      parseInt(stakeID) - 1,
      ethers.utils.parseUnits(amount.toString(), parseInt(stake.token_decimal)).toString(),
    ]

    const method: (...args: any) => Promise<TransactionResponse> = stakeDetails!.withdraw
    const args: Array<string | number | boolean> = payload

    setAttemptingTxn(true)
    setIsOpen(true)

    await method(...args)
      .then(async (response: any) => {
        await response.wait()
        setFormData({
          ...formData,
          chain_id: '32520',
          owner_address: '',
          amount: 0,
          EmissionRate: 0,
          BonusEndBlock: 0,
          WithdrawAmount: 0,
          DepositRewardAmount: 0,
        })
        swal('Congratulations!', 'Amount withdrawn from the Stake!', 'success')

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

  return (
    <>
      <tr key={stake.stakeOwner_id}>
        <TransactionConfirmationModal
          isOpen={isOpen}
          onDismiss={handleDismissConfirmation}
          attemptingTxn={attemptingTxn}
          hash={txHash}
          content={() => <></>}
          pendingText="Please wait..."
        />
        <td>
          {stake.token_name}
          {'  '}
          <Tooltip show={feeTooltip1} placement="top" text={onCopyValue}>
            <FaCopy
              onClick={copyToClipboard}
              onMouseEnter={() => setFeeTooltip1(true)}
              onMouseLeave={() => setFeeTooltip1(false)}
            />
          </Tooltip>
        </td>
        <td>
          <Link to="/swap">
            <Button scale="sm" style={{ marginBottom: '5px' }} variant="secondary">
              Add
            </Button>
          </Link>{' '}
          <span>{balance ? parseFloat(balance).toFixed(2) : ''}</span>
        </td>
        <td>
          {APY ? parseFloat(APY).toFixed(2) : 0}
          {'  '}
          <Tooltip show={feeTooltip2} placement="bottom" text="Annual percentage yield">
            <FaInfoCircle
              color="grey"
              onMouseEnter={() => setFeeTooltip2(true)}
              onMouseLeave={() => setFeeTooltip2(false)}
            />
          </Tooltip>
        </td>
        <td>
          {depositAmount ? parseFloat(depositAmount).toFixed(4) : 0}
          {'  '}
          <Tooltip
            show={feeTooltip3}
            placement="bottom"
            text={`Total Investment: ${stakedTokenBalance ? parseFloat(stakedTokenBalance).toFixed(8) : 0} ${stake.token_symbol}`}
          >
            <FaInfoCircle
              color="grey"
              onMouseEnter={() => setFeeTooltip3(true)}
              onMouseLeave={() => setFeeTooltip3(false)}
            />
          </Tooltip>
        </td>
        <td>
          <div className=" mb-3">
            <InputExtended
              placeholder="Amount"
              className="mt-3"
              scale="sm"
              value={amount}
              onChange={handleChange('amount')}
            />
          </div>
        </td>
        <td>
          {!isApproved ? (
            <div className="mb-3">
              <Button scale="sm" variant="secondary" onClick={() => handleAllowance(stake.token_address)}>
                Authorize
              </Button>
            </div>
          ) : (
            <>
              <div className="mb-3">
                <Flex>
                  <Button
                    scale="sm"
                    style={{ marginRight: '5px' }}
                    variant="secondary"
                    onClick={() => handleDeposit(stake.pool_id)}
                  >
                    Invest
                  </Button>{' '}
                  <Button scale="sm" variant="secondary" onClick={() => handleWithdraw(stake.pool_id)}>
                    Withdraw
                  </Button>
                </Flex>
              </div>
            </>
          )}
        </td>
      </tr>

      {(isOwner || isCreator) && (
        <tr>
          <TransactionConfirmationModal
            isOpen={isOpen}
            onDismiss={handleDismissConfirmation}
            attemptingTxn={attemptingTxn}
            hash={txHash}
            content={() => <></>}
            pendingText="Please wait..."
          />
          { isOwner && (
            <>
          <td>
            <Flex>
              <ButtonContainer>
                <Button scale="md" variant="secondary" onClick={() => handlePause(stake.pool_id)}>
                  {`${pause ? 'Unpause' : 'Pause'}`}
                </Button>
              </ButtonContainer>
            </Flex>
          </td>

          <td>
            <Flex>
              <ButtonContainer>
                <Flex alignItems="center" justifyContent="space-around" style={{marginBottom: '10px'}}>
                  <InputExtended
                    placeholder="Update"
                    scale="sm"
                    style={{ marginRight: '5px', flex: '2'  }}
                    value={EmissionRate}
                    onChange={handleChange('EmissionRate')}
                  />{' '}
                  <Tooltip show={feeTooltip4} placement="top" text={` Reward Per Block: ${rewardPerBlock} `}>
                    <FaInfoCircle
                      color="grey"
                      onMouseEnter={() => setFeeTooltip4(true)}
                      onMouseLeave={() => setFeeTooltip4(false)}
                    />
                  </Tooltip>
                </Flex>
                <Button scale="md" variant="secondary" onClick={() => handleEmissionRate(stake.pool_id)}>
                  Update Emission
                </Button>
              </ButtonContainer>
            </Flex>
          </td>

          <td>
          <Flex>
              <ButtonContainer>
                <Button scale="md" style={{ marginRight: '5px'}} variant="secondary" onClick={() => handleReward(stake.pool_id)}>
                  {`${rewardStop ? 'Reward Stopped' : 'Stop Reward'}`}
                </Button>
             </ButtonContainer>
          </Flex>
          </td>

          <td>
            <Flex>
              <ButtonContainer>
                <Flex alignItems="center" justifyContent="space-between" style={{marginBottom: '10px'}}>
                  <InputExtended
                    placeholder="Update"
                    scale="sm"
                    style={{ marginRight: '5px', flex: '2' }}
                    value={BonusEndBlock}
                    onChange={handleChange('BonusEndBlock')}
                  />{' '}
                  <Tooltip show={feeTooltip5} placement="top" text={` Bonus End Block: ${stakeBonusEndBlock} `}>
                    <FaInfoCircle
                      color="grey"
                      onMouseEnter={() => setFeeTooltip5(true)}
                      onMouseLeave={() => setFeeTooltip5(false)}
                    />
                  </Tooltip>
                </Flex>

                <Flex>  
                  <Button scale="md" variant="secondary" onClick={() => handleBonusEndBlock(stake.pool_id)}>
                    Update Bonus End Block
                  </Button>
                </Flex>
              </ButtonContainer>
            </Flex>
          </td>

          <td>
            <Flex>
              <ButtonContainer>
                <Flex alignItems="center" justifyContent="space-between" style={{marginBottom: '10px'}} >
                  <InputExtended
                    placeholder="Withdraw"
                    style={{ marginRight: '5px', flex: '2' }}
                    scale="sm"
                    value={WithdrawAmount}
                    onChange={handleChange('WithdrawAmount')}
                  />
                  </Flex>

                  <Flex> 
                  <Button scale="md" variant="tertiary" onClick={() => handleEmergencyRewardWithdraw(stake.pool_id)}>
                    Withdraw Reward
                  </Button>
                  </Flex>
                </ButtonContainer>
            </Flex>
          </td>
          </>
          )}

          <td>
          {(isOwner || isCreator) && (
              <Flex alignItems='center' justifyContent='space-around'>
                <ButtonContainer>
                <Flex alignItems="center" justifyContent="space-between" style={{marginBottom: '10px'}}>
                  <InputExtended
                    placeholder="Deposit"
                    style={{ marginRight: '5px', flex: '2' }}
                    scale="sm"
                    value={DepositRewardAmount}
                    onChange={handleChange('DepositRewardAmount')}
                  />{' '}
                  <Tooltip show={feeTooltip6} placement="top" text={`Total Rewards present: ${stakeRewardBalance ? parseFloat(stakeRewardBalance).toFixed(8) : 0} ${stake.reward_token_symbol}`}>
                    <FaInfoCircle
                      className="mx-2"
                      color="grey"
                      onMouseEnter={() => setFeeTooltip6(true)}
                      onMouseLeave={() => setFeeTooltip6(false)}
                    />
                  </Tooltip>
                  </Flex>
                  <Flex>
                  {(parseFloat(allowanceReward) < DepositRewardAmount || parseFloat(allowanceReward) === 0) && (
                    <Button
                      scale="md"
                      style={{ marginRight: '5px' }}
                      variant="tertiary"
                      onClick={handleAllowanceApprove}                   
                    >
                      Approve
                    </Button>
                  )}
                   {/*  //  */}
                  <Button scale="md" style={{ marginRight: '5px' }} variant="tertiary" onClick={() => handleAllowanceDeposit(stake.pool_id)}>
                    Deposit Reward
                  </Button>
                  </Flex>  
                </ButtonContainer>
              </Flex>
            )}
            </td>
          </tr>
      )}
    </>
  )
}

export default StakeUser
