/* eslint-disable */
import React from 'react'
import moment from 'moment'
import { Link } from 'react-router-dom'
import { Button, Flex } from '@evofinance9/uikit'

import { AiOutlineClockCircle } from 'react-icons/ai'
import { BiLockAlt } from 'react-icons/bi'
import { FaReddit, FaTwitter, FaLink, FaTelegram, FaGithub } from 'react-icons/fa'
import { MdOutlineLockClock } from 'react-icons/md'

import { StyledCard, StyledCardBody, Badge, LogoContainer, CardHeader, CardSubHeader, CardInfoText } from './styleds'

interface PresaleCardProps {
  data: {
    chain_id: string
    sale_id: string
    owner_address: string
    token_address: string
    token_name: string
    token_symbol: string
    token_decimal: number
    tier1: number
    tier2: number
    tier3: number
    soft_cap: number
    hard_cap: number
    min_buy: number
    max_buy: number
    router_rate: number
    default_router_rate: number
    listing_rate: number
    logo_link: string
    website_link: string
    github_link: string
    twitter_link: string
    reddit_link: string
    telegram_link: string
    project_dec: string
    upstring_dec: string
    token_level: number
    start_time: string
    end_time: string
    tier1_time: string
    tier2_time: string
    lock_time: string
    liquidity: number
    contribution: number
    liquidity_lock: boolean
    certik_audit: boolean
    doxxed_team: boolean
    utility: boolean
    kyc: boolean
    other_token: string
    other_symbol: string
    is_other: boolean
    is_brise: boolean
    is_close: boolean
  }
}

export default function PresaleCard({ data }: PresaleCardProps) {
  // destructure
  const {
    logo_link,
    token_name,
    token_symbol,
    start_time,
    liquidity,
    end_time,
    lock_time,
    sale_id,
    router_rate,
    website_link,
    github_link,
    twitter_link,
    reddit_link,
    telegram_link,
  } = data

  return (
    <StyledCard>
      <StyledCardBody>
        <div>
          <Flex justifyContent="space-between" alignItems="center" style={{ gap: '1rem' }}>
            <LogoContainer>
              <img src={logo_link} alt={token_name} />
            </LogoContainer>

            {moment(end_time).format('X') < moment().format('X') ? (
              <Badge bg="failure">Ended</Badge>
            ) : (
              <Badge bg="success">Live</Badge>
            )}
          </Flex>

          <Flex justifyContent="space-between" alignItems="center" style={{ gap: '1rem', margin: '0.8rem 0' }}>
            <div>
              <CardHeader>{token_symbol}</CardHeader>
              <CardSubHeader>{token_name}</CardSubHeader>
            </div>

            <Flex justifyContent="center" alignItems="center" style={{ gap: '7px' }}>
              <a href={twitter_link} target="_blank" rel="noopener noreferrer">
                <FaTwitter fontSize="1.2rem" />
              </a>
              <a href={reddit_link} target="_blank" rel="noopener noreferrer">
                <FaReddit fontSize="1.2rem" />
              </a>
              <a href={github_link} target="_blank" rel="noopener noreferrer">
                <FaGithub fontSize="1.2rem" />
              </a>
              <a href={telegram_link} target="_blank" rel="noopener noreferrer">
                <FaTelegram fontSize="1.2rem" />
              </a>
              <a href={website_link} target="_blank" rel="noopener noreferrer">
                <FaLink fontSize="1.2rem" />
              </a>
            </Flex>
          </Flex>
        </div>

        {/* check this */}
        {/* <div className="my-3">
            <Card.Text className="mb-2">Progress (45.00%)</Card.Text>
            <ProgressBar variant="success" now={40} className="presale__progress" />
          </div> */}

        <div>
          <Flex justifyContent="space-between" alignItems="center" style={{ margin: '0 0 0.5rem 0' }}>
            <Flex alignItems="center" style={{ gap: '7px' }}>
              <BiLockAlt fontSize="1.3rem" /> <CardInfoText>Liquidity Lock :</CardInfoText>
            </Flex>
            <CardInfoText className="mb-2 custom-font">{router_rate || 0}% </CardInfoText>
          </Flex>

          <Flex justifyContent="space-between" alignItems="center" style={{ margin: '0.5rem 0' }}>
            <Flex alignItems="center" style={{ gap: '7px' }}>
              <MdOutlineLockClock fontSize="1.3rem" /> <CardInfoText>Lock Time:</CardInfoText>
            </Flex>
            <CardInfoText>{moment(lock_time).format('YYYY-MM-DD H:mm')}</CardInfoText>
          </Flex>

          <Flex justifyContent="space-between" alignItems="center" style={{ margin: '0.5rem 0 0 0' }}>
            <Flex alignItems="center" style={{ gap: '7px' }}>
              <AiOutlineClockCircle fontSize="1.3rem" /> <CardInfoText>Sale Starts On:</CardInfoText>
            </Flex>
            <CardInfoText>{moment(start_time).format('YYYY-MM-DD H:mm')}</CardInfoText>
          </Flex>
        </div>

        <Link to={`/presale/${sale_id}`}>
          <Button scale="md" width="100%">
            View Pool
          </Button>
        </Link>

        {/* <div className="d-flex justify-content-between mt-3">
            <div className="d-flex flex-column">
              <Card.Text className="mb-2 presale__text custom-font">Sale Starts On:</Card.Text>
              <Card.Text className="mb-2 custom-font">{moment(start_time).format('MMM Do YYYY')}</Card.Text>
            </div>
            <div>
              <Link to={`/presale/${sale_id}`}>
                <Button scale="md" variant="secondary">
                  View Pool <FaArrowCircleRight className='ml-2' /> 
                </Button>
              </Link>
            </div>
          </div> */}
      </StyledCardBody>
    </StyledCard>
  )
}
