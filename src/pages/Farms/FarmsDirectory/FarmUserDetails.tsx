/* eslint-disable */
import React, { useState, useEffect, useCallback, useRef, useMemo } from 'react'

import swal from 'sweetalert'
import { Button, CardBody, Input } from '@evofinance9/uikit'
import '@djthoms/pretty-checkbox'
import { Link } from 'react-router-dom'
import moment from 'moment'
import { TransactionResponse } from '@ethersproject/providers'
import Container from 'components/Container'

import { useActiveWeb3React } from 'hooks'
import { useFarmContract, useDateTimeContract, useTokenContract } from 'hooks/useContract'
import { getFarmContract, getTokenContract, getSigCheckContract } from 'utils'
import { FARM_ADDRESS } from 'constants/abis/farm'
import { Oval } from 'react-loader-spinner'

import './style.css'

import TransactionConfirmationModal from 'components/TransactionConfirmationModal'
import { getFarmUserById, updateFarmUser } from './apicalls'
import {
  Table,
  FarmCardWrapper,
  FarmCard,
  FarmCardBody,
  TableWrapperExtended,
  LoaderWrapper,
  Flex as FlexExtended,
  InputExtended,
  ButtonContainer,
} from './styleds'
import { addFarmOwner } from '../CreateFarms/apicalls'

interface FormComponentProps {
  match: {
    params: { farmId }
  }
}

export default function FarmUserDetails({
  match: {
    params: { farmId },
  },
}: FormComponentProps) {
  const { account, chainId, library } = useActiveWeb3React()

  const [farm, setFarm] = useState<any>(null)
  const [startDate, setStartDate] = useState<any>()
  const [tokenAddress, setTokenAddress] = useState<any>()
  const [isCreated, setIsCreated] = useState<boolean>(false)
  const [isOpen, setIsOpen] = useState<boolean>(false)
  const [showConfirm, setShowConfirm] = useState<boolean>(false)
  const [txHash, setTxHash] = useState<string>('')
  const [attemptingTxn, setAttemptingTxn] = useState<boolean>(false)
  const [loading, setLoading] = useState<boolean>(false)

  const [formData, setFormData] = useState({
    chain_id: '32520',
    owner_address: '',
    allocation_point: '',
    rewardPerBlock: '',
  })

  // destructure
  const { allocation_point, rewardPerBlock } = formData

  // fetch farm info
  useEffect(() => {
    const fetch = async () => {
      setLoading(true)
      getFarmUserById(farmId)
        .then(async (response) => {
          setFarm(response)
          setTokenAddress(response.token_address)
          setStartDate(moment(response.start_date).format('dddd, MMMM Do YYYY'))
          setLoading(false)
        })
        .catch((err) => {
          setLoading(false)

          console.log(err)
          swal('Oops', 'Something went wrong!', 'error')
        })
    }
    fetch()
  }, [farmId])

  const handleChange = (name) => (event) => {
    const value = event.target.value
    setFormData({ ...formData, [name]: value })
  }

  const handleDismissConfirmation = () => {
    setIsOpen(false)
    setShowConfirm(false)
    setTxHash('')
  }

  const createFarm = async (formData) => {
    if (!chainId || !library || !account) return

    const farmDetails = getSigCheckContract(chainId, library, account)

    const payload = [FARM_ADDRESS, 'add(address,uint256,uint256)', farm.token_address, allocation_point, rewardPerBlock]

    const method: (...args: any) => Promise<TransactionResponse> =
      farmDetails['submitTransaction(address,string,address,uint256,uint256)']
    const args: Array<object | string[] | string | boolean | number> = payload

    setAttemptingTxn(true)
    setIsOpen(true)

    await method(...args)
      .then(async (response: any) => {
        const txReceipt = await response.wait()
        const farmID = txReceipt.events[0].args.txIndex.toNumber()

        addFarmOwner({
          ...formData,
          owner_address: account,
          farmOwner_id: farmID,
          token_address: farm.token_address,
          token_name: farm.token_name,
          token_symbol: farm.token_symbol,
          token_decimal: farm.token_decimal,
        })
          .then((data) => {
            if (data.error) {
              swal('Oops', 'Something went wrong!', 'error')
            } else {
              setFormData({
                ...formData,
                chain_id: '32520',
                owner_address: '',
                allocation_point: '',
                rewardPerBlock: '',
              })
              setAttemptingTxn(false)
              setTxHash(response.hash)
              setIsCreated(true)
              swal('Congratulations!', 'Farm is Created! It will be live soon!', 'success')
            }
          })
          .catch((err) => console.log(`error is ${err}`))
      })
      .catch((e) => {
        setAttemptingTxn(false)
        // we only care if the error is something _other_ than the user rejected the tx
        if (e?.code !== 'ACTION_REJECTED') {
          console.error(e)
          alert(e.message)
        }
      })
    updateFarmUser(farmId, { is_ended: true })
  }

  const handleCreate = (e) => {
    e.preventDefault()

    if (!account || !allocation_point || !rewardPerBlock) {
      swal('Are you sure?', 'There are incomplete fields in your submission!', 'warning')
      return
    }

    createFarm(formData)
  }

  return (
    <Container>
      <TransactionConfirmationModal
        isOpen={isOpen}
        onDismiss={handleDismissConfirmation}
        attemptingTxn={attemptingTxn}
        hash={txHash}
        content={() => <></>}
        pendingText="Please wait..."
      />
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
      {farm !== null && !loading && (
        <div>
          <FarmCardWrapper>
            <FarmCard>
              <FarmCardBody>
                <TableWrapperExtended>
                  <Table>
                    <tbody>
                      <tr>
                        <td>Token Address</td>
                        <td>{farm.token_address}</td>
                      </tr>

                      <tr>
                        <td>Token Name </td>
                        <td>{farm.token_name}</td>
                      </tr>

                      <tr>
                        <td>Token Symbol</td>
                        <td>{farm.token_symbol}</td>
                      </tr>

                      <tr>
                        <td>Token Decimal</td>
                        <td>{farm.token_decimal}</td>
                      </tr>

                      <tr>
                        <td>Start Date</td>
                        <td>{startDate}</td>
                      </tr>
                    </tbody>
                  </Table>
                </TableWrapperExtended>
                {!isCreated && (
                  <>
                    <FlexExtended>
                      <InputExtended
                        placeholder="Allocation Point"
                        className="mt-3"
                        scale="lg"
                        value={allocation_point}
                        onChange={handleChange('allocation_point')}
                      />
                      <InputExtended
                        placeholder="Reward Per Block"
                        className="mt-3"
                        scale="lg"
                        value={rewardPerBlock}
                        onChange={handleChange('rewardPerBlock')}
                      />
                    </FlexExtended>
                    <FlexExtended>
                      <ButtonContainer>
                        <Button scale="md" variant="secondary" onClick={handleCreate}>
                          Create
                        </Button>
                      </ButtonContainer>
                      <ButtonContainer>
                        <Link to={`/farm`}>
                          <Button scale="md" variant="secondary">
                            Back
                          </Button>
                        </Link>
                      </ButtonContainer>
                    </FlexExtended>
                  </>
                )}
              </FarmCardBody>
            </FarmCard>
          </FarmCardWrapper>
        </div>
      )}
    </Container>
  )
}
