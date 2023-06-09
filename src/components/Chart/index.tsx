import React, { useEffect, useState } from 'react'
import moment from 'moment'
import styled from 'styled-components'
import { SWAP_API } from 'backend'
import { CardBody, Card, Input } from '@evofinance9/uikit'
import { useQuery, gql } from '@apollo/client'
import { isAddress } from 'ethers/lib/utils'
import { Area } from '@ant-design/plots'

import Container from 'components/Container'
import Loader from 'components/Loader'

import {
  StyledHeading,
  TokenLogo,
  HeadingContainer,
  TokenLogoContainer,
  PriceHeading,
  TokenInfoCol,
  PriceHeadingContainer,
  TokenInfoRow,
  LoaderContainer,
  InputWrapper,
  SearchResContainer,
  SearchResItem,
} from './styleds'

const ContainerExtended = styled(Container)`
  padding: 0;
`

const BodyWrapper = styled(Card)`
  width: 100%;
  flex: 2;
`

const PAIR_QUERY = gql`
  {
    pair(id: "0xe3277f754b8714d131bf7b5cc1719d8754fad006") {
      id
      token0 {
        id
        symbol
      }
      token1 {
        id
        symbol
      }
      token0Price
      token1Price
      totalSupply
      createdAtTimestamp
    }
  }
`

const PRICE_QUERY = gql`
  query TokenDayDatas($first: Int, $orderDirection: OrderDirection, $where: TokenDayData_filter) {
    tokenDayDatas(first: $first, orderDirection: $orderDirection, where: $where) {
      priceUSD
      date
      open
      high
      low
      close
      totalLiquidityToken
      dailyVolumeUSD
      token {
        name
        symbol
        id
      }
    }
  }
`

const TOKENS_QUERY = gql`
  query Tokens($where: Token_filter) {
    tokens(where: $where) {
      name
      symbol
      id
    }
  }
`

export default function Chart() {
  const { data: graphData, loading } = useQuery(PAIR_QUERY)
  const { data: priceGraphData, refetch: priceRefetch } = useQuery(PRICE_QUERY)
  const { data: tokensData, refetch } = useQuery(TOKENS_QUERY)

  const [show, setShow] = useState(false)
  const [search, setSearch] = useState('')
  const [tokens, setTokens] = useState<
    {
      id: string
      symbol: string
    }[]
  >([])

  const [data, setData] = useState<{
    id: string
    token0: {
      id: string
      symbol: string
    }
    token1: {
      id: string
      symbol: string
    }
    totalSupply: string
    token0Price: string
    token1Price: string
    createdAtTimestamp: string
  } | null>(null)

  const [chartConfig, setChartConfig] = useState<any | null>(null)

  useEffect(() => {
    if (graphData) {
      setData(graphData?.pair)
    }
  }, [graphData])

  useEffect(() => {
    if (!priceGraphData) return
    const { tokenDayDatas } = priceGraphData
    const formattedData = tokenDayDatas.map((tokenDayData) => ({
      // open: tokenDayData.open,
      // high: tokenDayData.high,
      // low: tokenDayData.low,
      // close: tokenDayData.close,
      price: parseFloat(tokenDayData.priceUSD) * 100,
      Date: moment.unix(tokenDayData.date).format('YYYY-MM-DD'),
    }))
    setChartConfig({
      data: formattedData,
      xField: 'Date',
      yField: 'price',
      xAxis: {
        type: 'time',
        tickCount: 5,
      },
      meta: {
        price: {
          formatter: (value) => value / 100,
        },
      },
      animation: true,
      slider: {
        start: 0.1,
        end: 0.9,
        trendCfg: {
          isArea: true,
        },
      },
    })
  }, [priceGraphData])

  useEffect(() => {
    if (!tokensData || !search) return
    setTokens(tokensData.tokens)
    console.log(tokensData.tokens)
  }, [tokensData, search])

  useEffect(() => {
    priceRefetch({
      first: 100,
      orderDirection: 'asc',
      where: {
        token: '0x02c1efdc962123bdb2ca85a9cb728fcd54c3ca4c',
      },
    })
  }, [priceRefetch])

  return (
    <ContainerExtended>
      <BodyWrapper>
        <CardBody>
          <div>
            <InputWrapper>
              <Input
                placeholder="Search here"
                onChange={(e) => {
                  setSearch(e.target.value.toUpperCase())
                  setShow(true)
                  refetch({
                    where: isAddress(e.target.value)
                      ? {
                          id: e.target.value.toLowerCase(),
                        }
                      : {
                          symbol: e.target.value.toUpperCase(),
                        },
                  })
                }}
              />
              {show && (
                <SearchResContainer>
                  {tokens.map((token) => (
                    <SearchResItem
                      key={token.id}
                      onClick={() => {
                        priceRefetch({
                          first: 100,
                          orderDirection: 'asc',
                          where: {
                            token: token.id,
                          },
                        })
                        setShow(false)
                      }}
                    >
                      <h4>{token.symbol}</h4>
                      <p>{token.id}</p>
                    </SearchResItem>
                  ))}
                </SearchResContainer>
              )}
            </InputWrapper>
            {loading && (
              <LoaderContainer>
                <Loader size="25px" />
              </LoaderContainer>
            )}
            {!loading && data && (
              <TokenInfoRow>
                <TokenInfoCol>
                  <HeadingContainer>
                    <TokenLogoContainer>
                      <TokenLogo
                        src={`${SWAP_API}/images/${
                          priceGraphData?.tokenDayDatas[priceGraphData?.tokenDayDatas?.length - 1]?.token?.id
                        }.png`}
                        alt={priceGraphData?.tokenDayDatas[priceGraphData?.tokenDayDatas?.length - 1]?.token?.symbol}
                      />
                      <TokenLogo
                        src={`${SWAP_API}/images/${
                          priceGraphData?.tokenDayDatas[priceGraphData?.tokenDayDatas?.length - 1]?.token?.id ===
                          data.token0.id
                            ? data.token1.id
                            : data.token0.id
                        }.png`}
                        alt={data.token0.symbol}
                      />
                    </TokenLogoContainer>
                    <StyledHeading>
                      {priceGraphData?.tokenDayDatas[priceGraphData?.tokenDayDatas?.length - 1]?.token?.symbol}/
                      {priceGraphData?.tokenDayDatas[priceGraphData?.tokenDayDatas?.length - 1]?.token?.symbo ===
                      data.token1.symbol
                        ? data.token0.symbol
                        : data.token1.symbol}
                    </StyledHeading>
                  </HeadingContainer>

                  <PriceHeadingContainer>
                    <PriceHeading>
                      ${' '}
                      {parseFloat(
                        priceGraphData?.tokenDayDatas[priceGraphData?.tokenDayDatas?.length - 1]?.priceUSD
                      ).toFixed(8)}
                    </PriceHeading>
                  </PriceHeadingContainer>
                </TokenInfoCol>
              </TokenInfoRow>
            )}
          </div>
          {chartConfig && <Area {...chartConfig} />}
        </CardBody>
      </BodyWrapper>
    </ContainerExtended>
  )
}
