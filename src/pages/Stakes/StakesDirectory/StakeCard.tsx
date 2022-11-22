/* eslint-disable */
import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Card } from 'react-bootstrap'
// , Badge, ProgressBar
import { Button, Flex } from '@evofinance9/uikit'

import moment from 'moment'
// import { SocialIcon } from 'react-social-icons'

// import { useDateTimeContract } from 'hooks/useContract'
// import getUnixTimestamp from 'utils/getUnixTimestamp'
import { StyledCard, StyledCardBody, Heading, Flex as FlexExtended, InputExtended, ButtonContainer } from './styleds'

import './style.css'

import { FaArrowRight } from 'react-icons/fa'
// FaLock, FaClock,
// import { MdLockClock } from 'react-icons/md'

interface StakeCardProps {
  data: {
    chain_id: string
    _id: string
    owner_address: string
    token_address: string
    token_name: string
    token_symbol: string
    token_decimal: number
    reward_token_address: string
    reward_token_name: string
    reward_token_symbol: string
    reward_token_decimal: number
    project_name: string
    start_date: Date
    email_id: string
    telegram_id: string
    logo_url: string
  }
}

export default function StakeCard({ data }: StakeCardProps) {
  // destructure
  const {
    token_address,
    token_name,
    owner_address,
    project_name,
    reward_token_name,
    telegram_id,
    logo_url,
    email_id,
    start_date,
    _id,
  } = data

  return (
    <StyledCard>
      <StyledCardBody>
        {/* <div className="d-flex justify-content-center align-items-center"> */}
        {/* <Flex justifyContent="center" margin="0rem"> */}
        {/* <Card.Title className="mb-2 token__symbol"> */}
        <Flex alignItems={'center'} justifyContent={'center'} >
          <div className="presale__logo p-2">
            <img src={logo_url} alt={token_name} className="rounded" />
          </div>
        </Flex>
        <Flex alignItems={'center'} justifyContent={'space-between'} flexDirection={'column'}>
          <Heading>{project_name}</Heading>
          <Card.Title className="mb-3 "> {token_address}</Card.Title>
        </Flex>

        {/* <div className="d-flex justify-content-between"> */}
        <Flex justifyContent="space-between">
          <Card.Text className="mb-2 custom-font">Stake Token</Card.Text>
          <Card.Text className="mb-2 custom-font">{token_name} </Card.Text>
        </Flex>

        <Flex justifyContent="space-between">
          <Card.Text className="mb-2 custom-font">Reward Token</Card.Text>
          <Card.Text className="mb-2 custom-font">{reward_token_name} </Card.Text>
        </Flex>

        {/* <div className="d-flex gap-2"> */}
        {/* check */}
        {/* <Flex justifyContent="space-around" margin="1.5rem"> */}
        <Flex justifyContent="space-between">
          <Card.Text className="mb-2 custom-font">Owner</Card.Text>
          <Card.Text className="mb-2 ml-2 custom-font">{owner_address} </Card.Text>
        </Flex>

        {/* <div className="d-flex justify-content-between"> */}
        {/* <Flex justifyContent="space-between" margin="0rem"> */}
        <Flex justifyContent="space-between">
          <Card.Text className="mb-2 custom-font">Telegram ID</Card.Text>
          <Card.Text className="mb-2 custom-font">{telegram_id} </Card.Text>
        </Flex>

        {/* <div className="d-flex justify-content-between"> */}
        {/* <Flex justifyContent="space-between" margin="0rem"> */}
        <Flex justifyContent="space-between">
          <Card.Text className="mb-2 custom-font">Email ID</Card.Text>
          <Card.Text className="mb-2 custom-font">{email_id} </Card.Text>
        </Flex>

        {/* <div className="d-flex justify-content-between"> */}
        {/* <Flex justifyContent="space-between" margin="0rem"> */}
        <Flex justifyContent="space-between">
          <Card.Text className="mb-2 custom-font">Start Date</Card.Text>
          <Card.Text className="mb-2 custom-font">{moment(start_date).format('dddd, MMMM Do YYYY')} </Card.Text>
        </Flex>

        {/* <div className='mt-3'> */}
        <ButtonContainer>
          <Link to={`/stake/${_id}`}>
            <Button scale="md" variant="secondary" width="100%">
              View Stake <FaArrowRight className="ml-2" fontSize="0.8rem" />
            </Button>
          </Link>
        </ButtonContainer>
      </StyledCardBody>
    </StyledCard>
  )
}
