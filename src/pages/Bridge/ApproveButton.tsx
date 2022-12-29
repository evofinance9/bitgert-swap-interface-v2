import React, { useState, useEffect } from 'react'
import { ethers } from 'ethers'
import { TokenAmount, Token, BigintIsh, Currency, CurrencyAmount, JSBI } from '@evofinance9/sdk'
import { Button } from '@evofinance9/uikit'

import { BRIDGE_BSC_ADDRESS } from 'constants/abis/bridge'

import { useApproveCallback, ApprovalState } from 'hooks/useApproveCallback'
import { bnMultiplyByDecimal } from 'utils'

import Loader from 'components/Loader'
import { AutoRow } from 'components/Row'

interface ApproveButtonComponentProps {
  token: Token
  amount: number
  func: (amount: string) => Promise<void>
}

const ApproveButton = ({ token, amount, func }: ApproveButtonComponentProps) => {
  const amountToDeposit = new TokenAmount(token, JSBI.BigInt(10))

  // check whether the user has approved the router on the input token
  const [approval, approveCallback] = useApproveCallback(amountToDeposit, BRIDGE_BSC_ADDRESS, amount)

  // check if user has gone through approval process, used to show two step buttons, reset on token change
  const [approvalSubmitted, setApprovalSubmitted] = useState<boolean>(false)

  // mark when a user has submitted an approval, reset onTokenSelection for input field
  useEffect(() => {
    if (approval === ApprovalState.PENDING) {
      setApprovalSubmitted(true)
    }
  }, [approval, approvalSubmitted])

  // show approve flow when: no error on inputs, not approved or pending, or approved in current session
  const showApproveFlow =
    approval === ApprovalState.NOT_APPROVED ||
    approval === ApprovalState.PENDING ||
    (approvalSubmitted && approval === ApprovalState.APPROVED)

  return (
    <>
      {approval === ApprovalState.APPROVED ? (
        <Button
          style={{ width: '100%', margin: '2rem 0' }}
          scale="md"
          variant="primary"
          onClick={() => func(ethers.utils.parseUnits(amount.toString(), `18`).toString())}
        >
          Enter
        </Button>
      ) : (
        <Button
          style={{ width: '100%', margin: '2rem 0' }}
          onClick={approveCallback}
          disabled={approval !== ApprovalState.NOT_APPROVED || approvalSubmitted}
          variant="primary"
        >
          {approval === ApprovalState.PENDING ? (
            <AutoRow gap="6px" justify="center">
              Approving <Loader stroke="white" />
            </AutoRow>
          ) : (
            `Approve`
          )}
        </Button>
      )}
    </>
  )
}

export default ApproveButton
