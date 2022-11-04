import React, { useState, useEffect } from 'react'
import { Button, CardBody, Input, Flex } from '@evofinance9/uikit'

import { ethers } from 'ethers'
// import Form from 'react-bootstrap/Form'
import { Link } from 'react-router-dom'
import { FaCopy, FaInfoCircle } from 'react-icons/fa'
import copy from 'copy-to-clipboard'
import Tooltip from 'components/Tooltip'

import swal from 'sweetalert'

import { BigNumber } from '@ethersproject/bignumber'
import { TransactionResponse } from '@ethersproject/providers'
import { MaxUint256 } from '@ethersproject/constants'
import styled from 'styled-components'
// import { useQuery, gql } from '@apollo/client'

import { useActiveWeb3React } from 'hooks'
import { useStakeContract, useDateTimeContract, useTokenContract } from 'hooks/useContract'
import { getStakeContract, getTokenContract, getSigCheckContract } from 'utils'
import TransactionConfirmationModal from 'components/TransactionConfirmationModal'

import { STAKE_ADDRESS } from 'constants/abis/stake'

const InputExtended = styled(Input)`
  width: 100px;
`

const StakeUser = ({ stake }) => {
  const { account, chainId, library } = useActiveWeb3React()
  const [isApproved, setIsApproved] = useState<boolean>(false)
  const [isOwner, setIsOwner] = useState<boolean>(false)
  const [txHash, setTxHash] = useState<string>('')
  const [balance, setBalance] = useState<string>('')
  const [rewardPerBlock, setRewardPerBlock] = useState<string>('')
  const [showConfirm, setShowConfirm] = useState<boolean>(false)
  const [isOpen, setIsOpen] = useState<boolean>(false)
  const [rewardBalance, setRewardBalance] = useState<string>('')
  const [totalBalance, setTotalBalance] = useState<string>('')
  const [onCopyValue, setOnCopyValue] = useState<string>('')
  const [APY, setAPY] = useState<string>('')
  const [feeTooltip1, setFeeTooltip1] = useState<boolean>(false)
  const [feeTooltip2, setFeeTooltip2] = useState<boolean>(false)
  const [feeTooltip3, setFeeTooltip3] = useState<boolean>(false)
  const [depositAmount, setDepositAmount] = useState<string>('')
  const [attemptingTxn, setAttemptingTxn] = useState<boolean>(false)
  // const [loading, setLoading] = useState<boolean>(false)

  const [formData, setFormData] = useState({
    chain_id: '32520',
    owner_address: '',
    amount: 0,
  })

  // destructure
  const { owner_address, amount } = formData

  useEffect(() => {
    const fetch = async () => {
      if (!chainId || !library || !account) return
      
      console.log("done")
      const stakeDetails = getStakeContract(chainId, library, account)

      const stakeRewardPerBlock = await stakeDetails?.callStatic.rewardPerBlock()
      setRewardPerBlock(stakeRewardPerBlock.toString())

      const userDeposit = await stakeDetails?.callStatic.userInfo((stake.pool_id-1), account)
      setDepositAmount(ethers.utils.formatEther(userDeposit.amount.toString()))

      const poolInfo = await stakeDetails?.callStatic.poolInfo((stake.pool_id-1))
      const accTokenPerShare = poolInfo.accTokenPerShare

      const stakeRewardToken = await stakeDetails?.callStatic.rewardToken()
      const stakeRewardBalance = await stakeDetails?.callStatic.rewardBalance()

      const sigCheckDetails = getSigCheckContract(chainId, library, account)
      
      const isOwnerOrNot = await sigCheckDetails?.callStatic.isOwner(account)

      setIsOwner(isOwnerOrNot)

      const tokenContract = getTokenContract(stake.token_address, library, account)

      setOnCopyValue(stake.token_address)

      const accountBalance = await tokenContract?.callStatic.balanceOf(account)
      setBalance(ethers.utils.formatEther(accountBalance))

      const totalStakeBalance = await tokenContract?.callStatic.balanceOf(STAKE_ADDRESS)

      // check it
      if (stakeRewardToken === stake.token_address) {
        const stakeRewardTokenBalance = totalStakeBalance - stakeRewardBalance
        setTotalBalance(ethers.utils.formatEther(stakeRewardTokenBalance))
        if (stakeRewardTokenBalance === 0 ) {
          setAPY('')
        } else {
          const apy = (accTokenPerShare.toNumber()  / stakeRewardTokenBalance) * 100
          setAPY(apy.toString())
        }
      } else {
        setTotalBalance(ethers.utils.formatEther(totalStakeBalance))
        if (totalStakeBalance.toNumber() === 0 ) {
          setAPY('')
        } else {
          const apy = (accTokenPerShare.toNumber() / totalStakeBalance.toNumber()) * 100
          setAPY(apy.toString())
        }        
      }

      const allowanceAmount = await tokenContract?.callStatic.allowance(account, STAKE_ADDRESS)
      const allowanceEther = ethers.utils.formatEther(allowanceAmount)

      if (parseFloat(allowanceEther) >= amount && parseFloat(allowanceEther) > 0) {
        setIsApproved(true)
      } else {
        setIsApproved(false)
      }

      // const tokenStakeContract = getTokenContract(stakedToken, library, account)
      // const stakedTokenBalance = await tokenStakeContract?.callStatic.balanceOf(STAKE_ADDRESS)

    }

    fetch()
  }, [stake, stake.stakeOwner_id, stake.token_address, account, library, amount, chainId])

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

  const handleAllowance = async (tokenAddress) => {
    if (!chainId || !library || !account || !tokenAddress) return

    const tokenContract = getTokenContract(tokenAddress, library, account)

    const TBalance = await tokenContract?.callStatic.balanceOf(account)
    const TDecimals = await tokenContract?.callStatic.decimals()

    const payload = [
      STAKE_ADDRESS,
      MaxUint256,
    ]

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
        if (e?.code !== "ACTION_REJECTED") {
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
        })

        swal('Congratulations!', 'Amount deposited in Stake!', 'success')
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
        })
        swal('Congratulations!', 'Amount withdrawn from the Stake!', 'success')

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

  return (
    <tr key={stake._id}>
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
        <Tooltip show={feeTooltip1} placement="top" text={onCopyValue}>
          <FaCopy
            className="mx-2"
            onClick={copyToClipboard}
            onMouseEnter={() => setFeeTooltip1(true)}
            onMouseLeave={() => setFeeTooltip1(false)}
          />
        </Tooltip>
      </td>
      <td>
        <div className="mb-3 mr-4">
          <Link to="/swap">
            <Button scale="sm" variant="secondary">
              Add
            </Button>
          </Link>
          <br />
          <div className="mt-2">
            <span>{balance ? parseFloat(balance).toFixed(2) : ''}</span>
          </div>
        </div>
      </td>
      <td>
        {APY ? parseFloat(APY).toFixed(2) : 0}
        <Tooltip
          show={feeTooltip2}
          placement="bottom"
          text="Annual percentage yield"
        >
          <FaInfoCircle
            className="mx-2"
            onMouseEnter={() => setFeeTooltip2(true)}
            onMouseLeave={() => setFeeTooltip2(false)}
          />
        </Tooltip>
      </td>
      <td>
        {depositAmount ? parseFloat(depositAmount).toFixed(4) : 0}
        <Tooltip
          show={feeTooltip3}
          placement="bottom"
          text={`Total Investment: ${totalBalance ? parseFloat(totalBalance).toFixed(2) : 0} ${stake.token_symbol}`}
        >
          <FaInfoCircle
            className="mx-2"
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
              {/* <div className=" d-flex justify-content-between"> */}
              <Flex>
                <Button scale="sm" variant="secondary" onClick={() => handleDeposit(stake.pool_id)}>
                  Invest
                </Button>
                <Button scale="sm" variant="secondary" onClick={() => handleWithdraw(stake.pool_id)}>
                  Withdraw
                </Button>
              </Flex>
            </div>
          </>
        )}
      </td>
    </tr>
  )
}

export default StakeUser
