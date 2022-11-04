/* eslint-disable */
import React, { useState, useEffect } from 'react'
import swal from 'sweetalert'
import { Oval } from 'react-loader-spinner'

import Container from 'components/Container'

import './style.css'
import StakeCard from './StakeCard'
import {getAllStakeUser} from './apicalls'

import { StyledCardContainer, LoaderWrapper, StyledText } from './styleds'

export default function StakeDirectory() {
  const [stakes, setStakes] = useState<any[]>([])
  const [loading, setLoading] = useState<boolean>(false)
  const [text, setText] = useState<boolean>(false)

  useEffect(() => {
    const fetchStakeList = () => {
      setLoading(true)
      getAllStakeUser()
        .then((response) => {
          
          setLoading(false)
          setStakes(response)

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

    fetchStakeList()
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
        {!text && (
          stakes.map((stake) => (
            (stake.is_ended === false) ?
              (<StakeCard data={stake} key={stake._id} />)
              :
              null
              ))) 
          }
        </StyledCardContainer>
        {text && (
        <StyledText>
          No more pending stakes!
        </StyledText>
        )}
      </Container>
      <div className="mt-5" />
    </>
  )
}
