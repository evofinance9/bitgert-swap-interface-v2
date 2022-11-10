/* eslint-disable */
import React from 'react'
import { Link } from 'react-router-dom'
import { Button, Flex } from '@evofinance9/uikit'

import { StyledCard, StyledCardBody, CardHeader } from './styleds'

import './style.css'

interface AirdropCardProps {
  data: {
    chain_id: string
    _id: string
    owner_address: string
    token_address: string
    token_name: string
    token_symbol: string
    token_decimal: string
    title: string
    addresses_to: string[]
    amounts_to: string[]
    start_time: string
    logo_url: string
    website_url: string
    github_url: string
    twitter_url: string
    reddit_url: string
    telegram_url: string
    discord_url: string
    description: string
  }
}

export default function AirdropCard({ data }: AirdropCardProps) {
  // destructure
  const { logo_url, title, token_symbol, token_name, addresses_to, amounts_to, _id } = data

  return (
    <StyledCard>
      <StyledCardBody>
        <Flex justifyContent="center" alignItems="center">
          <div className="presale__logo">
            <img src={logo_url} alt={token_name} className="rounded" />
          </div>

          {/* <div className="p-2">
            <div className="d-flex justify-content-between align-items-center">
              

              <p>
                {moment(end_time).format('X') < moment().format('X') ? (
                  <Badge pill bg="danger" className="custom-font">
                    Ended
                  </Badge>
                ) : (
                  <Badge pill bg="success" className="custom-font">
                    Live
                  </Badge>
                )}
              </p>
            </div>

            <div className="social__icons__container ">
              <SocialIcon url={twitter_url} network="twitter" fgColor="#fff" style={{ height: 25, width: 25 }} />
              <SocialIcon url={reddit_url} network="reddit" fgColor="#fff" style={{ height: 25, width: 25 }} />
              <SocialIcon url={github_url} network="github" fgColor="#fff" style={{ height: 25, width: 25 }} />
              <SocialIcon url={telegram_url} network="telegram" fgColor="#fff" style={{ height: 25, width: 25 }} />
              <SocialIcon url={website_url} network="dribbble" fgColor="#fff" style={{ height: 25, width: 25 }} />
            </div>
          </div> */}
        </Flex>
        <CardHeader>{title}</CardHeader>

        <Flex justifyContent="space-between">
          <p>Token</p>
          <p> {token_symbol} </p>
        </Flex>

        <Flex justifyContent="space-between">
          <p>Total Tokens</p>
          <p>{amounts_to.reduce((a, b) => parseFloat(a.toString()) + parseFloat(b), 0).toFixed(2)}</p>
        </Flex>

        <Flex justifyContent="space-between">
          <p>Participants</p>
          <p>{addresses_to.length}</p>
        </Flex>

        <Link to={`/airdrop/${_id}`}>
          <Button scale="md" width="100%">
            View
          </Button>
        </Link>
      </StyledCardBody>
    </StyledCard>
  )
}
