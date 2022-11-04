import React, { useState, useEffect } from 'react'
import { Button, CardBody, Input, Flex } from '@evofinance9/uikit'

// import { ethers } from 'ethers'
// import Form from 'react-bootstrap/Form'
// import { Link } from 'react-router-dom'
// import { FaCopy, FaInfoCircle } from 'react-icons/fa'
// import copy from 'copy-to-clipboard'
// import Tooltip from 'components/Tooltip'

import swal from 'sweetalert'

// import { BigNumber } from '@ethersproject/bignumber'
import { TransactionResponse } from '@ethersproject/providers'
// import { MaxUint256 } from '@ethersproject/constants'
import styled from 'styled-components'
// import { useQuery, gql } from '@apollo/client'

import { useActiveWeb3React } from 'hooks'
import { useStakeContract, useDateTimeContract, useTokenContract } from 'hooks/useContract'
import { updateStakeOwner } from 'pages/Stakes/StakesCreatedDirectory/apicalls'
import { getStakeContract, getTokenContract, getSigCheckContract } from 'utils'
import TransactionConfirmationModal from 'components/TransactionConfirmationModal'
// import { SIGCHECK_ABI, SIGCHECK_ADDRESS } from 'constants/abis/sigCheck'

// import { STAKE_ADDRESS } from 'constants/abis/stake'

const InputExtended = styled(Input)`
  width: 100px;
`

const StakeOwner = ({ stakeID }) => {
  const { account, chainId, library } = useActiveWeb3React()
  // const [isApproved, setIsApproved] = useState<boolean>(false)
  const [txHash, setTxHash] = useState<string>('')
  // const [balance, setBalance] = useState<string>('')
  // const [totalBalance, setTotalBalance] = useState<string>('')
  const [transactionDetails, setTransactionDetails] = useState<any>({})
  const [eventDetails, setEventDetails] = useState<any>({})
  const [functionName, setFunctionName] = useState<string>('')
  const [textValue, setTextValue] = useState<string>('')
  // const [matched, setMatch] = useState<boolean>(false)
  const [isOpen, setIsOpen] = useState<boolean>(false)
  const [showConfirm, setShowConfirm] = useState<boolean>(false)
  // const [onCopyValue, setOnCopyValue] = useState<string>('')
  // const [feeTooltip1, setFeeTooltip1] = useState<boolean>(false)
  // const [feeTooltip2, setFeeTooltip2] = useState<boolean>(false)
  // const [depositAmount, setDepositAmount] = useState<string>('')
  const [attemptingTxn, setAttemptingTxn] = useState<boolean>(false)
  // const [loading, setLoading] = useState<boolean>(false)

  const [formData, setFormData] = useState({
    chain_id: '32520',
    owner_address: '',
  })

  // destructure
  const { owner_address } = formData

  useEffect(() => {
    const fetch = async () => {

      if (!chainId || !library || !account) return

      const stakeDetails = getSigCheckContract(chainId, library, account)

      const transactionDetail = await stakeDetails?.callStatic.transactions(stakeID)
      setTransactionDetails(transactionDetail)

      const stakeEvent1 = stakeDetails.filters.SubmitTransaction2(null, stakeID)
      const events = await stakeDetails.queryFilter(stakeEvent1, stakeID)
      let NameOfFunction
      let param1
      if (events.length === 0) {
        const stakeEvent2 = stakeDetails.filters.SubmitTransaction3(null, stakeID)
        const events1 = await stakeDetails.queryFilter(stakeEvent2, stakeID)
        if (events1.length === 0) {
          const stakeEvent3 = stakeDetails.filters.SubmitTransaction1(null, stakeID)
          const events2 = await stakeDetails.queryFilter(stakeEvent3, stakeID)
          setEventDetails(events2[0].args) 
          NameOfFunction = events2[0].args!.funcSig
        } else {
          setEventDetails(events1[0].args) 
          NameOfFunction = events1[0].args!.funcSig
          param1 = events1[0].args!.arg1.toString()
        }
      } else {
        setEventDetails(events[0].args)
        NameOfFunction = events[0].args!.funcSig
        param1 = events[0].args!.arg1
      }
      
      const arr = NameOfFunction.split("(")
      const funcName = arr[0]
      setFunctionName(funcName) 
      
      if (funcName === "add") {
        const tokenContract = getTokenContract(param1, library, account)
        const TName = await tokenContract?.callStatic.name()
        setTextValue(TName)
      } else if (funcName === "setPause") {
        const stake = getStakeContract(chainId, library, account)
        const pausedOrNot = await stake?.callStatic.isPaused()
        setTextValue(pausedOrNot ? "Unpause" : "Pause")
      } else if (funcName === "stopReward") {
        setTextValue("Stop")
      } else if (funcName === "emergencyRewardWithdraw") {
        setTextValue(param1)
      } else if (funcName === "updateRewardPerBlock") {
        setTextValue(param1)
      }
    }

    fetch()
  }, [stakeID, account, library, chainId])

  const handleChange = (name) => (event) => {
    const value = event.target.value
    setFormData({ ...formData, [name]: value })
  }

  const handleDismissConfirmation = () => {
    setIsOpen(false)
    setShowConfirm(false)
    setTxHash('')
  }

  const handleAllowance = async (approve:boolean) => {

    if (!chainId || !library || !account || !stakeID.toString()) return

    const stakeDetails = getSigCheckContract(chainId, library, account)

    const payload = [
      parseInt(stakeID),
      approve
    ]

    const method: (...args: any) => Promise<TransactionResponse> = stakeDetails!.executeTransaction
    const args: Array<string | number | boolean> = payload

    setAttemptingTxn(true)
    setIsOpen(true)

    await method(...args)
      .then(async (response: any) => {
      
        const txReceipt = await response.wait()
        const poolID = await stakeDetails?.callStatic.addId()

      if(poolID !== 0) {
        updateStakeOwner(stakeID.toString(), {pool_id: poolID.toString()})
      }

        setFormData({
          ...formData,
          chain_id: '32520',
          owner_address: '',
        })
        
        if (approve) {
          updateStakeOwner(stakeID.toString(), {is_approved: true})
          swal('Congratulations!', 'Stake is approved!', 'success')
        } else {
          updateStakeOwner(stakeID.toString(), {is_approved: false})
          swal('Congratulations!', 'Stake is disapproved!', 'success')
        }
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
    <tr key={stakeID}>
        <TransactionConfirmationModal
          isOpen={isOpen}
          onDismiss={handleDismissConfirmation}
          attemptingTxn={attemptingTxn}
          hash={txHash}
          content={() => <></>}
          pendingText="Please wait..."
        />
      <td>
        {eventDetails.owner}
      </td>
      <td>
        {functionName} 
      </td>
      <td>
        {textValue}
      </td>
      <td>
        {/* <div className="d-flex justify-content-between mb-3"> */}
        <Flex>
          <Button scale="sm" variant="secondary" onClick={() => handleAllowance(true)}>
            Authorize
          </Button>
          <Button scale="sm" variant="subtle" onClick={() => handleAllowance(false)}>
            Reject
          </Button>
        </Flex> 
      </td>
    </tr>
  )
}

export default StakeOwner
