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
import { useFarmContract, useDateTimeContract, useTokenContract } from 'hooks/useContract'
import { updateFarmOwner } from 'pages/Farms/FarmsCreatedDirectory/apicalls'
import { getFarmContract, getTokenContract, getSigCheckContract } from 'utils'
import TransactionConfirmationModal from 'components/TransactionConfirmationModal'
// import { SIGCHECK_ABI, SIGCHECK_ADDRESS } from 'constants/abis/sigCheck'

// import { FARM_ADDRESS } from 'constants/abis/farm'

const InputExtended = styled(Input)`
  width: 100px;
`

const FarmOwner = ({ farmID }) => {
  const { account, chainId, library } = useActiveWeb3React()
  // const [isApproved, setIsApproved] = useState<boolean>(false)
  const [txHash, setTxHash] = useState<string>('')
  // const [balance, setBalance] = useState<string>('')
  // const [totalBalance, setTotalBalance] = useState<string>('')
  const [transactionDetails, setTransactionDetails] = useState<any>({})
  const [eventDetails, setEventDetails] = useState<any>({})
  const [functionName, setFunctionName] = useState<string>('')
  const [textValue, setTextValue] = useState<string>('')
  const [isOpen, setIsOpen] = useState<boolean>(false)
  // const [matched, setMatch] = useState<boolean>(false)
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

      const farmDetails = getSigCheckContract(chainId, library, account)

      const transactionDetail = await farmDetails?.callStatic.transactions(farmID)
      setTransactionDetails(transactionDetail)

      const farmEvent1 = farmDetails.filters.SubmitTransaction5(null, farmID)
      const events = await farmDetails.queryFilter(farmEvent1, farmID)
      let NameOfFunction
      let param1
      let param2
      let param3
      if (events.length === 0) {
        const farmEvent2 = farmDetails.filters.SubmitTransaction3(null, farmID)
        const events1 = await farmDetails.queryFilter(farmEvent2, farmID)
        if (events1.length === 0) {
          const farmEvent3 = farmDetails.filters.SubmitTransaction1(null, farmID)
          const events2 = await farmDetails.queryFilter(farmEvent3, farmID)
          if (events2.length === 0) {
            const farmEvent4 = farmDetails.filters.SubmitTransaction2(null, farmID)
            const events3 = await farmDetails.queryFilter(farmEvent4, farmID)
            setEventDetails(events3[0].args) 
            console.log("events3: ", events3[0].args) 
            NameOfFunction = events3[0].args!.funcSig
            param1 = events3[0].args!.arg1.toString()
          } else {
            console.log("events2: ", events2[0].args) 
            setEventDetails(events2[0].args) 
            NameOfFunction = events2[0].args!.funcSig
          }
        } else {
          console.log("events1: ", events1[0].args) 
          setEventDetails(events1[0].args)
          NameOfFunction = events1[0].args!.funcSig
          param1 = events1[0].args!.arg1.toString()
        }
      } else {
        console.log("events: ", events[0].args) 
        setEventDetails(events[0].args)
        NameOfFunction = events[0].args!.funcSig
        param1 = events[0].args!.arg1
        param2 = events[0].args!.arg2
        param3 = events[0].args!.arg3
      }
      
      const arr = NameOfFunction.split("(")
      const funcName = arr[0]
      setFunctionName(funcName)
      
      if (funcName === "add") {
        const tokenContract = getTokenContract(param2, library, account)
        const TName = await tokenContract?.callStatic.name()
        const FinalText = `${TName} - ${param1}`
        console.log(TName)
        console.log(param1)
        console.log(param2)
        console.log(FinalText)
        setTextValue(FinalText)
      } else if (funcName === "updateBitgert") {
        const tokenContract = getTokenContract(param1, library, account)
        const TName = await tokenContract?.callStatic.name()
        setTextValue(TName)
      } else if (funcName === "updateIsMint") {
        const farm = getFarmContract(chainId, library, account)
        const isMint = await farm?.callStatic.isMint()
        setTextValue(isMint ? "Stop Mint" : "Start Mint")
      } else if (funcName === "setPause") {
        const farm = getFarmContract(chainId, library, account)
        const pausedOrNot = await farm?.callStatic.isPaused()
        setTextValue(pausedOrNot ? "Unpause" : "Pause")
      } else if (funcName === "emergencyWithdrawRewardToken") {
        setTextValue(param1)
      } else if (funcName === "depositRewardToken") {
        setTextValue(param1)
      } else if (funcName === "changeToBurn") {
        setTextValue(param1)
      } else if (funcName === "updateEmissionRate") {
        setTextValue(param1)
      } else if (funcName === "updateMultiplier") {
        setTextValue(param1)
      }
    }

    fetch()
  }, [farmID, account, library, chainId])

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

    if (!chainId || !library || !account || !farmID.toString()) return

    const farmDetails = getSigCheckContract(chainId, library, account)

    const payload = [
      parseInt(farmID),
      approve
    ]

    console.log(payload)

    const method: (...args: any) => Promise<TransactionResponse> = farmDetails!.executeTransaction
    const args: Array<string | number | boolean> = payload
    
    setAttemptingTxn(true)
    setIsOpen(true)

    await method(...args)
      .then(async (response: any) => {
        console.log(response)
        const txReceipt = await response.wait()
        console.log(txReceipt)
        const poolID = await farmDetails?.callStatic.addId()

        if(poolID !== 0) {
          updateFarmOwner(farmID.toString(), {pool_id: poolID.toString()})
        }

        setFormData({
          ...formData,
          chain_id: '32520',
          owner_address: '',
        })
        
        if (approve) {
          updateFarmOwner(farmID.toString(), {is_approved: true})
          swal('Congratulations!', 'Farm is approved!', 'success')
        } else {
          updateFarmOwner(farmID.toString(), {is_approved: false})
          swal('Congratulations!', 'Farm is disapproved!', 'success')
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
    <tr key={farmID}>
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
        <Flex justifyContent="space-around">
          <Button scale="sm" variant="secondary" onClick={() => handleAllowance(true)}>
            Authorize
          </Button>
          <Button scale="sm" variant="tertiary" style={{marginLeft: "5px"}} onClick={() => handleAllowance(false)}>
            Reject
          </Button>
        </Flex>
      </td>
    </tr>
  )
}

export default FarmOwner
