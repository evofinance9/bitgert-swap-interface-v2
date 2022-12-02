/* eslint-disable */
import React, { useState, useEffect } from 'react'
import swal from 'sweetalert'
import { Oval } from 'react-loader-spinner'

import './style.css'

import Container from 'components/Container'
import StakeUser from 'components/StakeUser'

import { useActiveWeb3React } from 'hooks'
import { useStakeContract, useDateTimeContract, useTokenContract } from 'hooks/useContract'
import { getStakeContract, getTokenContract, getSigCheckContract } from 'utils'

import { getAllStakeOwner } from './apicalls'
import { TableWrapper, Table, LoaderWrapper, StyledText } from './styleds'

export default function StakesCreatedDirectory() {
  const { account, chainId, library } = useActiveWeb3React()
  const [stakes, setStakes] = useState<any[]>([])
  const [isOwner, setIsOwner] = useState<boolean>(false)
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
