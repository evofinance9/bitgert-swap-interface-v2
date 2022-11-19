/* eslint-disable */
import React, { useState, useEffect } from 'react'
// import { Link } from 'react-router-dom'
// import swal from 'sweetalert'
import { Oval } from 'react-loader-spinner'

import './style.css'

import Container from 'components/Container'
// import StakeUser from 'components/StakeUser'
import StakeOwner from 'components/StakeOwner'
// import { Button, CardBody, Input } from '@evofinance9/uikit'

// import { ethers } from 'ethers'
// import Form from 'react-bootstrap/Form'

// import { BigNumber } from '@ethersproject/bignumber'
// import { TransactionResponse } from '@ethersproject/providers'

import { useActiveWeb3React } from 'hooks'
import { useStakeContract, useDateTimeContract, useTokenContract } from 'hooks/useContract'
import { getStakeContract, getTokenContract, getSigCheckContract } from 'utils'
import { STAKE_ADDRESS } from 'constants/abis/stake'

// import {getAllStakeOwner} from './apicalls'
// import getAllStakeUser from './apicalls'
import { TableWrapper, Table, LoaderWrapper, StyledText } from './styleds'

export default function StakesCreatedDirectory() {
  const { account, chainId, library } = useActiveWeb3React()
  // const [tokenDetails, setTokenDetails] = useState<any>({})
  const [stakes, setStakes] = useState<any[]>([])
  // const [stakeID, setStakeID] = useState<any>()
  // const [tokenAddress, setTokenAddress] = useState<any>()
  // const [txHash, setTxHash] = useState<string>('')
  // const [attemptingTxn, setAttemptingTxn] = useState<boolean>(false)
  // const [isApproved, setIsApproved] = useState<boolean>(false)
  const [text, setText] = useState<boolean>(false)
  const [loading, setLoading] = useState<boolean>(false)

  useEffect(() => {
    const fetchStakeList = async () => {
      if (!chainId || !library || !account) return

      setLoading(true)

      const stakeDetails = getSigCheckContract(chainId, library, account)

      const stakesLength = await stakeDetails?.callStatic.txLength()

      let count = 0
      let arr: number[] = []

      for (let i = 0; i < stakesLength.toNumber(); i++) {
        const allStakes = await stakeDetails?.callStatic.transactions(i)
        if (allStakes.executed === false && allStakes.rejected === false && allStakes.to === STAKE_ADDRESS) {
          arr.push(i)
        } else {
          count++
        }
      }

      setStakes(arr)

      // if all stakes are executed, no more pending stakes for owner
      if (stakesLength.toNumber() === count) {
        setText(true)
      }
      setLoading(false)
    }

    fetchStakeList()
  }, [])

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

          {Object.entries(stakes).length !== 0 && (
            <Table>
              <thead>
                <tr>
                  <th> Owner </th>
                  <th> Action </th>
                  <th> Values </th>
                  <th> Approve </th>
                </tr>
              </thead>
              <tbody>{!text && stakes.map((stakeID) => <StakeOwner stakeID={stakeID} key={stakeID} />)}</tbody>
            </Table>
          )}
        </TableWrapper>
        {text && <StyledText>No more pending stakes!</StyledText>}
      </Container>
      <div className="mt-5"> </div>
    </>
  )
}
