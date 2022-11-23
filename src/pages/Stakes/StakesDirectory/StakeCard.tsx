/* eslint-disable */
import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Card } from 'react-bootstrap'
import { Button, Flex } from '@evofinance9/uikit'

import moment from 'moment'
import { StyledCard, StyledCardBody, Heading, Flex as FlexExtended, InputExtended, ButtonContainer } from './styleds'

import './style.css'

import { FaArrowRight } from 'react-icons/fa'

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
        <Flex alignItems={'center'} justifyContent={'center'} >
          <div className="presale__logo p-2">
            <img src={logo_url} alt={token_name} className="rounded" />
          </div>
        </Flex>
        <Flex alignItems={'center'} justifyContent={'space-between'} flexDirection={'column'}>
          <Heading className="custom-font-extended">{project_name}</Heading>
          <Card.Title className="custom-font-extended"> {token_address}</Card.Title>
        </Flex>

        <Flex justifyContent="space-between">
          <Card.Text className="custom-font-extended">Stake Token:</Card.Text>
          <Card.Text className="custom-font-extended">{token_name} </Card.Text>
        </Flex>

        <Flex justifyContent="space-between">
          <Card.Text className="custom-font-extended">Reward Token:</Card.Text>
          <Card.Text className="custom-font-extended">{reward_token_name} </Card.Text>
        </Flex>

        <Flex justifyContent="space-between">
          <Card.Text className="custom-font-extended">Owner:</Card.Text>
          <Card.Text className="custom-font-extended" style={{marginLeft: '5px'}}>{owner_address} </Card.Text>
        </Flex>

        <Flex justifyContent="space-between">
          <Card.Text className="custom-font-extended">Telegram ID:</Card.Text>
          <Card.Text className="custom-font-extended">{telegram_id} </Card.Text>
        </Flex>

        <Flex justifyContent="space-between">
          <Card.Text className="custom-font-extended">Email ID:</Card.Text>
          <Card.Text className="custom-font-extended">{email_id} </Card.Text>
        </Flex>

        <Flex justifyContent="space-between">
          <Card.Text className="custom-font-extended">Start Date:</Card.Text>
          <Card.Text className="custom-font-extended">{moment(start_date).format('dddd, MMMM Do YYYY')} </Card.Text>
        </Flex>

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
