/* eslint-disable */
import React, { useState, useEffect } from 'react'
import swal from 'sweetalert'
import { Oval } from 'react-loader-spinner'

import Container from 'components/Container'

import './style.css'
import FarmCard from './FarmCard'
import getAllFarmUser from './apicalls'

import { StyledCardContainer, LoaderWrapper, StyledText } from './styleds'

export default function FarmDirectory() {
  const [farms, setFarms] = useState<any[]>([])
  const [loading, setLoading] = useState<boolean>(false)
  const [text, setText] = useState<boolean>(false)

  useEffect(() => {
    const fetchFarmList = () => {
      setLoading(true)
      getAllFarmUser()
        .then((response) => {
          setLoading(false)
          setFarms(response)

          let count = 0
          for (let i = 0; i < response.length; i++) {
            if (response[i].is_ended === false) {
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

    fetchFarmList()
  }, [])

  return (
    <>
      <Container>
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
        <StyledCardContainer>
          {!text && farms.map((farm) => (farm.is_ended === false ? <FarmCard data={farm} key={farm._id} /> : null))}
        </StyledCardContainer>
        {text && <StyledText>No more pending Farms!</StyledText>}
      </Container>
      <div className="mt-5" />
    </>
  )
}
