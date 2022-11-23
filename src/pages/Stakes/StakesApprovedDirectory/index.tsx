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
  const [tokenAddress, setTokenAddress] = useState<string>('')
  const [isOwner, setIsOwner] = useState<boolean>(false)
  const [pause, setPause] = useState<boolean>(false)
  const [stakeReward, setStakeReward] = useState<boolean>(false)
  const [rewardBalance, setRewardBalance] = useState<string>('')
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
  })

  // destructure
  const { owner_address } = formData

  useEffect(() => {
    const fetchStakeList = async () => {
      setLoading(true)


      if (!chainId || !library || !account) return

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
  }, [account, library, chainId])

  const handleChange = (name) => (event) => {
    const value = event.target.value
    setFormData({ ...formData, [name]: value })
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
