/* eslint-disable */
import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import swal from 'sweetalert'
import { Oval } from 'react-loader-spinner'

import './style.css'

import Container from 'components/Container'
import FarmUser from 'components/FarmUser'
import FarmOwner from 'components/FarmOwner'
import { Button, CardBody, Input } from '@evofinance9/uikit'

import { ethers } from 'ethers'
import Form from 'react-bootstrap/Form'

import { BigNumber } from '@ethersproject/bignumber'
import { TransactionResponse } from '@ethersproject/providers'

import { useActiveWeb3React } from 'hooks'
import { useFarmContract, useDateTimeContract, useTokenContract } from 'hooks/useContract'
import { getFarmContract, getTokenContract, getSigCheckContract } from 'utils'
import { FARM_ADDRESS } from 'constants/abis/farm'

import { getAllFarmOwner } from './apicalls'
import getAllFarmUser from './apicalls'
import { TableWrapper, Table, LoaderWrapper, StyledText } from './styleds'

export default function FarmsCreatedDirectory() {
  const { account, chainId, library } = useActiveWeb3React()
  const [tokenDetails, setTokenDetails] = useState<any>({})
  const [farms, setFarms] = useState<any[]>([])
  // const [farmID, setFarmID] = useState<any>()
  // const [tokenAddress, setTokenAddress] = useState<any>()
  const [txHash, setTxHash] = useState<string>('')
  const [attemptingTxn, setAttemptingTxn] = useState<boolean>(false)
  const [isApproved, setIsApproved] = useState<boolean>(false)
  const [text, setText] = useState<boolean>(false)
  const [loading, setLoading] = useState<boolean>(false)

  useEffect(() => {
    const fetchFarmList = async () => {
      if (!chainId || !library || !account) return

      setLoading(true)

      const farmDetails = getSigCheckContract(chainId, library, account)

      const farmsLength = await farmDetails?.callStatic.txLength()
      console.log('farmsLength: ', farmsLength)

      let count = 0
      let arr: number[] = []

      for (let i = 0; i < farmsLength.toNumber(); i++) {
        const allFarms = await farmDetails?.callStatic.transactions(i)
        if (allFarms.executed === false && allFarms.rejected === false && allFarms.to === FARM_ADDRESS) {
          arr.push(i)
        } else {
          count++
        }
      }

      setFarms(arr)

      // if all farms are executed, no more pending farms for owner
      if (farmsLength.toNumber() === count) {
        console.log('no more pending things')
        setText(true)
      }
      setLoading(false)
    }

    fetchFarmList()

  }, [chainId, library, account])

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

          {Object.entries(farms).length !== 0 && (
            <Table>
              <thead>
                <tr>
                  <th> Owner </th>
                  <th> Action </th>
                  <th> Values </th>
                  <th> Approve </th>
                </tr>
              </thead>
              <tbody>{!text && farms.map((farmID) => <FarmOwner farmID={farmID} key={farmID} />)}</tbody>
            </Table>
          )}
        </TableWrapper>
        {text && <StyledText>No more pending farms!</StyledText>}
      </Container>
      <div className="mt-5"> </div>
    </>
  )
}
