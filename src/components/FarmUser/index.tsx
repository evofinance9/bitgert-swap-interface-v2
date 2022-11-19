/* eslint-disable */
import React, { useState, useEffect } from 'react'
import { Button, CardBody, Input, Flex } from '@evofinance9/uikit'

import { ethers } from 'ethers'
import Form from 'react-bootstrap/Form'
import { Link } from 'react-router-dom'

import { BigNumber } from '@ethersproject/bignumber'
import { TransactionResponse } from '@ethersproject/providers'
import styled from 'styled-components'
import { FaCopy, FaInfoCircle } from 'react-icons/fa'
import copy from 'copy-to-clipboard'
import { useQuery, gql } from '@apollo/client'

import swal from 'sweetalert'
import { useActiveWeb3React } from 'hooks'
import { useFarmContract, useDateTimeContract, useTokenContract } from 'hooks/useContract'
import { getFarmContract, getTokenContract, getSigCheckContract, bnSub, formatTokenAmount  } from 'utils'
import Tooltip from 'components/Tooltip'
import { MaxUint256 } from '@ethersproject/constants'
import TransactionConfirmationModal from 'components/TransactionConfirmationModal'

import { FARM_ADDRESS } from 'constants/abis/farm'

export const InputExtended = styled(Input)`
  margin: 1rem 0;

  ::placeholder,
  ::-webkit-input-placeholder {
    color: #757575;
  }
  :-ms-input-placeholder {
    color: #757575;
  }
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

const PAIR_QUERY = gql`
  query Query($pairId: ID!) {
    pair(id: $pairId) {
      token0 {
        id
        symbol
        name
      }
      token1 {
        id
        symbol
        name
      }
    }
  }
`

const FarmUser = ({ farm }) => {
  const { account, chainId, library } = useActiveWeb3React()
  const [isApproved, setIsApproved] = useState<boolean>(false)
  const [txHash, setTxHash] = useState<string>('')
  const [token0, setToken0] = useState<string>('')
  const [token1, setToken1] = useState<string>('')
  const [balance, setBalance] = useState<string>('')
  const [isOpen, setIsOpen] = useState<boolean>(false)
  const [showConfirm, setShowConfirm] = useState<boolean>(false)
  const [totalBalance, setTotalBalance] = useState<string>('')
  const [APY, setAPY] = useState<string>('')
  const [onCopyValue, setOnCopyValue] = useState<string>('')
  const [depositAmount, setDepositAmount] = useState<string>('')
  const [attemptingTxn, setAttemptingTxn] = useState<boolean>(false)
  const [isOwner, setIsOwner] = useState<boolean>(false)
  const [pause, setPause] = useState<boolean>(false)
  const [isMint, setIsMint] = useState<boolean>(false)
  const [multiplier, setBonusMultiplier] = useState<string>('')
  const [bitgertPerBlock, setBitgertPerBlock] = useState<string>('')
  const [toBurn, setToBurn] = useState<string>('')
  const [feeTooltip1, setFeeTooltip1] = useState<boolean>(false)
  const [feeTooltip2, setFeeTooltip2] = useState<boolean>(false)
  const [feeTooltip3, setFeeTooltip3] = useState<boolean>(false)
  const [feeTooltip4, setFeeTooltip4] = useState<boolean>(false)
  const [feeTooltip5, setFeeTooltip5] = useState<boolean>(false)
  const [feeTooltip6, setFeeTooltip6] = useState<boolean>(false)
  // const [loading, setLoading] = useState<boolean>(false)

  const { data, loading, refetch } = useQuery(PAIR_QUERY)
  const [pairAddress, setPairAddress] = useState('0x77575200f7a35072e0c5e691b32b26286d43a973')

  const [formData, setFormData] = useState({
    chain_id: '32520',
    owner_address: '',
    amount: 0,
    Multiplier: 0,
    EmissionRate: 0,
    ChangeToBurn: 0,
  })

  // destructure
  const { owner_address, amount, Multiplier, EmissionRate, ChangeToBurn } = formData

  useEffect(() => {
    const fetch = async () => {
      if (!chainId || !library || !account) return

      const tokenContract = getTokenContract(farm.token_address, library, account)

      setOnCopyValue(farm.token_address)

      const accountBalance = await tokenContract?.callStatic.balanceOf(account)
      const totalFarmBalance = await tokenContract?.callStatic.balanceOf(FARM_ADDRESS)

      setBalance(ethers.utils.formatEther(accountBalance))
      // setTotalBalance(ethers.utils.formatEther(totalFarmBalance))
      setTotalBalance(formatTokenAmount(totalFarmBalance.toString(), parseInt(farm.token_decimal)).toString())

      const allowanceAmount = await tokenContract?.callStatic.allowance(account, FARM_ADDRESS)
      const allowanceEther = ethers.utils.formatEther(allowanceAmount)

      if (parseFloat(allowanceEther) > 0) {
        setIsApproved(true)
      } else {
        setIsApproved(false)
      }

      const farmDetails = getFarmContract(chainId, library, account)

      const userDeposit = await farmDetails?.callStatic.userInfo(farm.pool_id - 1, account)

      setDepositAmount(ethers.utils.formatEther(userDeposit.amount.toString()))

      const poolInfo = await farmDetails?.callStatic.poolInfo(farm.pool_id - 1)
      const accBitgertPerShare = poolInfo.accBitgertPerShare
      const lastRewardBlock = poolInfo.lastRewardBlock
      setBitgertPerBlock(poolInfo.bitgertPerBlock.toString())

      // const farmBitgertPerBlock = await farmDetails?.callStatic.bitgertPerBlock()
      // setBitgertPerBlock(farmBitgertPerBlock.toString())

      // APYYY calc
      // if (totalFarmBalance.toNumber() === 0) {
      //   setAPY('')
      // } else {
      //   const apy = (accBitgertPerShare.toNumber() / totalFarmBalance.toNumber()) * 100
      //   console.log(apy)
      //   setAPY(apy.toString())
      // }

      const pausedOrNot = await farmDetails?.callStatic.isPaused(farm.pool_id - 1)
      setPause(pausedOrNot)

      // also add getMultiplier - not given public so commenting should uncomment next time
      // const farmBonusMultiplier = await farmDetails?.callStatic.BONUS_MULTIPLIER(farm.pool_id-1)
      // const farmBonusMultiplier = await farmDetails?.callStatic.getMultiplier(farm.pool_id-1, lastRewardBlock, )
      // setBonusMultiplier(farmBonusMultiplier.toString())

      const farmToBurn = await farmDetails?.callStatic.toBurn(farm.pool_id - 1)
      setToBurn(farmToBurn.toString())

      const farmIsMint = await farmDetails?.callStatic.isMint(farm.pool_id - 1)
      setIsMint(farmIsMint)

      const sigCheckDetails = getSigCheckContract(chainId, library, account)

      const isOwnerOrNot = await sigCheckDetails?.callStatic.isOwner(account)
      console.log(isOwnerOrNot)
      setIsOwner(isOwnerOrNot)
    }

    const pairToken = farm.token_address.toLowerCase()

    fetch()
    refetch({ pairId: pairToken })

    if (data) {
      if (data.pair.token0.id === '0x0eb9036cbe0f052386f36170c6b07ef0a0e3f710') {
        setToken0('BRISE')
      } else {
        setToken0(data.pair.token0.id)
      }
      if (data.pair.token1.id === '0x0eb9036cbe0f052386f36170c6b07ef0a0e3f710') {
        setToken1('BRISE')
      } else {
        setToken1(data.pair.token1.id)
      }
    }
  }, [refetch, farm.token_address, farm.farmOwner_id, account, library, amount, data, chainId])

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
    copy(farm.token_address)
    setOnCopyValue('Copied!')
    setTimeout(() => {
      setOnCopyValue(farm.token_address)
    }, 1500)
  }

  const handleAllowance = async (tokenAddress) => {
    if (!chainId || !library || !account || !tokenAddress) return
    const tokenContract = getTokenContract(tokenAddress, library, account)
    const TBalance = await tokenContract?.callStatic.balanceOf(account)
    const TDecimals = await tokenContract?.callStatic.decimals()

    const payload = [FARM_ADDRESS, MaxUint256]

    const method: (...args: any) => Promise<TransactionResponse> = tokenContract!.approve
    const args: Array<string | string[] | string | BigNumber | number> = payload

    setAttemptingTxn(true)
    setIsOpen(true)
    setIsApproved(false)

    await method(...args)
      .then(async (response: any) => {
        await response.wait()

        swal('Congratulations!', 'You have authorized to deposit tokens into farm!', 'success')

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

  const handleDeposit = async (farmID) => {
    if (!chainId || !library || !account || !farmID || !amount) return

    const tokenContract = getTokenContract(farm.token_address, library, account)
    const TBalance = await tokenContract?.callStatic.balanceOf(account)

    if (TBalance <= 0) {
      swal('Oops', 'You donot have enough balance to invest!', 'error')
      return
    }

    const farmDetails = getFarmContract(chainId, library, account)

    const payload = [
      parseInt(farmID) - 1,
      ethers.utils.parseUnits(amount.toString(), parseInt(farm.token_decimal)).toString(),
    ]

    const method: (...args: any) => Promise<TransactionResponse> = farmDetails!.deposit
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
          Multiplier: 0,
          EmissionRate: 0,
          ChangeToBurn: 0,
        })
        swal('Congratulations!', 'Amount deposited in Farm!', 'success')
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

  const handleWithdraw = async (farmID) => {
    if (!chainId || !library || !account || !farmID || amount === 0) return
    const farmDetails = getFarmContract(chainId, library, account)

    const payload = [
      parseInt(farmID) - 1,
      ethers.utils.parseUnits(amount.toString(), parseInt(farm.token_decimal)).toString(),
    ]

    const method: (...args: any) => Promise<TransactionResponse> = farmDetails!.withdraw
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
          Multiplier: 0,
          EmissionRate: 0,
          ChangeToBurn: 0,
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

  const handlePause = async (farmID) => {
    if (!chainId || !library || !account) return

    const farmDetails = getSigCheckContract(chainId, library, account)

    const payload = [FARM_ADDRESS, 'setPause(uint256)', parseInt(farmID) - 1]

    const method: (...args: any) => Promise<TransactionResponse> =
      farmDetails['submitTransaction(address,string,uint256)']
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

  const handleIsMint = async (farmID) => {
    if (!chainId || !library || !account) return

    const farmDetails = getSigCheckContract(chainId, library, account)

    const payload = [FARM_ADDRESS, 'updateIsMint(uint256)', parseInt(farmID) - 1]

    const method: (...args: any) => Promise<TransactionResponse> =
      farmDetails['submitTransaction(address,string,uint256)']
    const args: Array<string[] | string | boolean | number> = payload

    setAttemptingTxn(true)
    await method(...args)
      .then((response) => {
        swal(
          'Congratulations!',
          `The request to ${isMint ? 'stop Minting' : 'Start Minting'} in the farm has been generated`,
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

  const handlechangeToBurn = async (farmID) => {
    if (!chainId || !library || !account || !ChangeToBurn) return

    const farmDetails = getSigCheckContract(chainId, library, account)

    const payload = [FARM_ADDRESS, 'changeToBurn(uint256,uint256)', parseInt(farmID) - 1, ChangeToBurn]

    const method: (...args: any) => Promise<TransactionResponse> =
      farmDetails['submitTransaction(address,string,uint256,uint256)']
    const args: Array<string[] | string | boolean | number> = payload

    setAttemptingTxn(true)
    await method(...args)
      .then((response) => {
        setFormData({
          ...formData,
          chain_id: '32520',
          owner_address: '',
          amount: 0,
          Multiplier: 0,
          EmissionRate: 0,
          ChangeToBurn: 0,
        })
        swal('Congratulations!', 'The request to change ToBurn has been made!', 'success')
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

  const handleEmissionRate = async (farmID) => {
    if (!chainId || !library || !account || !EmissionRate) return

    const farmDetails = getSigCheckContract(chainId, library, account)

    const payload = [FARM_ADDRESS, 'updateEmissionRate(uint256,uint256)', parseInt(farmID) - 1, EmissionRate]

    const method: (...args: any) => Promise<TransactionResponse> =
      farmDetails['submitTransaction(address,string,uint256,uint256)']
    const args: Array<string[] | string | boolean | number> = payload

    setAttemptingTxn(true)
    await method(...args)
      .then((response) => {
        setFormData({
          ...formData,
          chain_id: '32520',
          owner_address: '',
          amount: 0,
          Multiplier: 0,
          EmissionRate: 0,
          ChangeToBurn: 0,
        })
        swal('Congratulations!', 'The request to change the Bitgert Per Block!', 'success')
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

  const handleMultiplier = async (farmID) => {
    if (!chainId || !library || !account || !Multiplier) return

    const farmDetails = getSigCheckContract(chainId, library, account)

    const payload = [FARM_ADDRESS, 'updateMultiplier(uint256,uint256)', parseInt(farmID) - 1, Multiplier]

    const method: (...args: any) => Promise<TransactionResponse> =
      farmDetails['submitTransaction(address,string,uint256,uint256)']
    const args: Array<string[] | string | boolean | number> = payload

    setAttemptingTxn(true)
    await method(...args)
      .then((response) => {
        setFormData({
          ...formData,
          chain_id: '32520',
          owner_address: '',
          amount: 0,
          Multiplier: 0,
          EmissionRate: 0,
          ChangeToBurn: 0,
        })
        swal('Congratulations!', 'The request to change the Bonus multiplier has been raised!', 'success')
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
      <tr key={farm.farmOwner_id}>
        <TransactionConfirmationModal
          isOpen={isOpen}
          onDismiss={handleDismissConfirmation}
          attemptingTxn={attemptingTxn}
          hash={txHash}
          content={() => <></>}
          pendingText="Please wait..."
        />
        <td>
          {farm.token_name}
          {'  '}
          <Tooltip show={feeTooltip1} placement="top" text={onCopyValue}>
            <FaCopy
              // className="mx-2"
              color="grey"
              onClick={copyToClipboard}
              onMouseEnter={() => setFeeTooltip1(true)}
              onMouseLeave={() => setFeeTooltip1(false)}
            />
          </Tooltip>
        </td>
        <td>
          {/* <div className="mb-3 mr-4"> */}
          <Link to={`/add/${token0}/${token1}/`}>
            <Button scale="sm" variant="secondary" style={{ marginRight: '5px' }}>
              Add
            </Button>
          </Link>{' '}
          <span>{balance ? parseFloat(balance).toFixed(4) : ''}</span>
          {/* <br />
            <div className="mt-3"> */}
          {/* </div>
          </div> */}
        </td>
        <td>
          {APY ? parseFloat(APY).toFixed(2) : 0}
          {'  '}
          <Tooltip show={feeTooltip2} placement="bottom" text="Annual Percentage Yield">
            <FaInfoCircle
              // className="mx-2"
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
            text={`Total Investment: ${totalBalance ? parseFloat(totalBalance).toFixed(2) : 0} ${farm.token_symbol}`}
          >
            <FaInfoCircle
              // className="mx-2"
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
              <Button scale="sm" variant="secondary" onClick={() => handleAllowance(farm.token_address)}>
                Authorize
              </Button>
            </div>
          ) : (
            <>
              <div className="mb-3">
                {/* <div className=" d-flex justify-content-between"> */}
                <Flex>
                  <Button scale="sm" style={{marginRight: '5px'}} variant="secondary" className="mr-2" onClick={() => handleDeposit(farm.pool_id)}>
                    Invest
                  </Button>{' '}
                  <Button scale="sm" variant="secondary" onClick={() => handleWithdraw(farm.pool_id)}>
                    Withdraw
                  </Button>
                </Flex>
              </div>
            </>
          )}
        </td>
      </tr>
      {isOwner && (
        <tr key={farm.pool_id}>
          <td>
            <Flex>
              <ButtonContainer>
                <Button variant="secondary" onClick={() => handlePause(farm.pool_id)}>
                  {`${pause ? 'Unpause' : 'Pause'} it`}
                </Button>
              </ButtonContainer>
            </Flex>
          </td>

          <td>
            <Flex>
              <ButtonContainer>
                <Button variant="secondary" onClick={() => handleIsMint(farm.pool_id)}>
                  {`${isMint ? 'stop Mint' : 'Start Mint'}`}
                </Button>
              </ButtonContainer>
            </Flex>
          </td>
          <td>
            <Flex>
              <ButtonContainer>
                <Flex alignItems={'center'} justifyContent={'space-around'}>
                  <InputExtended
                    placeholder="Update"
                    style={{ marginRight: '5px' }}
                    scale="sm"
                    value={Multiplier}
                    onChange={handleChange('Multiplier')}
                  />{' '}
                  <Tooltip show={feeTooltip4} placement="top" text={`Current Multiplier is : ${multiplier} `}>
                    <FaInfoCircle
                      color="grey"
                      onMouseEnter={() => setFeeTooltip4(true)}
                      onMouseLeave={() => setFeeTooltip4(false)}
                    />
                  </Tooltip>
                </Flex>
                <Button scale="sm" variant="secondary" onClick={() => handleMultiplier(farm.pool_id)}>
                  Update Multiplier
                </Button>
              </ButtonContainer>
            </Flex>
          </td>

          <td>
            <Flex>
              <ButtonContainer>
                <Flex alignItems={'center'} justifyContent={'space-around'}>
                  <InputExtended
                    placeholder="Update"
                    scale="sm"
                    style={{ marginRight: '5px' }}
                    value={EmissionRate}
                    onChange={handleChange('EmissionRate')}
                  />{' '}
                  <Tooltip show={feeTooltip5} placement="top" text={`Bitgert per block is : ${bitgertPerBlock} `}>
                    <FaInfoCircle
                      color="grey"
                      onMouseEnter={() => setFeeTooltip5(true)}
                      onMouseLeave={() => setFeeTooltip5(false)}
                    />
                  </Tooltip>
                </Flex>
                <Button scale="sm" variant="secondary" onClick={() => handleEmissionRate(farm.pool_id)}>
                  Update Emission Rate
                </Button>
              </ButtonContainer>
            </Flex>
          </td>

          <td>
            <Flex>
              <ButtonContainer>
                <Flex alignItems={'center'} justifyContent={'space-around'}>
                  <InputExtended
                    placeholder="Update"
                    style={{ marginRight: '5px' }}
                    scale="sm"
                    value={ChangeToBurn}
                    onChange={handleChange('ChangeToBurn')}
                  />{' '}
                  <Tooltip show={feeTooltip6} placement="top" text={`to burn value is : ${toBurn} `}>
                    <FaInfoCircle
                      color="grey"
                      onMouseEnter={() => setFeeTooltip6(true)}
                      onMouseLeave={() => setFeeTooltip6(false)}
                    />
                  </Tooltip>
                </Flex>
                <Button scale="sm" variant="secondary" onClick={() => handlechangeToBurn(farm.pool_id)}>
                  Update To Burn
                </Button>
              </ButtonContainer>
            </Flex>
          </td>
        </tr>
      )}
    </>
  )
}

export default FarmUser
