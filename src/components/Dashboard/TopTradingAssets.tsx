import React from 'react'
import millify from 'millify'
import { useQuery, gql } from '@apollo/client'
import styled from 'styled-components'

import Container from 'components/Container'

const Column = styled.div`
  background-color: #fff;
  color: #000000de;
  padding: 1rem;
  margin: 0;
  width: 100%;
  height: 100%;
  border-radius: 6px;
  display: flex;
  flex-direction: column;
  justify-content: center;
`

const TableHeader = styled.th`
  font-weight: 500;
  padding: 1rem;
  text-align: start;
`

const TableRow = styled.tr`
  border-bottom: 1px solid #e0e0e0;
`

const TableRowItem = styled.td`
  padding: 1rem;
`

const ASSETS_QUERY = gql`
  {
    tokens(
      orderBy: totalLiquidity
      orderDirection: desc
      where: {
        id_not_in: [
          "0x0eb9036cbe0f052386f36170c6b07ef0a0e3f710"
          "0xc1f9bdd0603665b9ae1e4d56e58240a018596b1a"
          "0x52f26febc4f99e2a08c5d0c8b2e9be1a8f113f3c"
          "0xf7dec488c42972d12ec3a216a48676f111196448"
          "0xdff3eb18ac39285331521ba2316deecb082f7371"
          "0x218961247cf30b67983cbdbe4d198c8bc1e45541"
          "0x9892ffb5ec3eaa1ee980b8c14976a71c8455374b"
          "0x08a37cd94785a9fb81d28f531de7067508a40e66"
          "0xe47e6be89ddb3cb98f48ef9a87f0a856b0eb8990"
          "0xd94a65198dbe7f61c3b73b5ecde9e29d32a22c4d"
          "0xd5a3bdf651cab3eee3325cd97643ab44a40c0183"
          "0xd10f7a05404af9d35d346ae7080394183fd5d56d"
          "0x7c3fca84294e5dbbbdb3a22ebdb4da95fd96d4d4"
          "0xb23d51c9862517680d61154a14383411a1555718"
          "0x731b5a9130fc3df3e89311874803b19418a164be"
          "0x6f2f36eda4b92c39af7005e550bf819e88f2d933"
          "0x6af36e2f91a1f28364b035eddf682b81b5213461"
          "0x50e8cbe506d30c2dcf773fb623011e4696f9a421"
          "0x34f50bd38c721389daf4b67308d1bace63194037"
          "0x267ae4ba9ce5ef3c87629812596b0d89ecbd81dd"
          "0x2a5f6c5e40304b516075af668dcecf84e590cbc4"
          "0x0c871a8f846c546974cc03157a4ec29a648bf0b4"
        ]
        symbol_not_in: ["DRX", "DRS", "BSC", "XYZ", "ABC"]
      }
    ) {
      id
      name
      symbol
      tokenDayData(orderDirection: "asc", first: 1, orderBy: "date") {
        priceUSD
        totalLiquidityUSD
        dailyVolumeUSD
      }
    }
  }
`

const TopTradingAssets = () => {
  const { data } = useQuery(ASSETS_QUERY)
  return (
    <Container>
      <Column>
        <table className="text-white">
          <thead>
            <TableRow>
              <TableHeader>#</TableHeader>
              <TableHeader>Token</TableHeader>
              <TableHeader>Price</TableHeader>
              <TableHeader>Volume &#40;24H&#41;</TableHeader>
              <TableHeader>Liquidity</TableHeader>
            </TableRow>
          </thead>
          <tbody>
            {data?.tokens?.map((token, idx) => (
              <TableRow key={token.id}>
                <TableRowItem>{idx + 1}</TableRowItem>
                <TableRowItem>
                  {token.name} ({token.symbol})
                </TableRowItem>
                <TableRowItem>$ {parseFloat(token?.tokenDayData[0]?.priceUSD || 0).toFixed(8)}</TableRowItem>
                <TableRowItem>$ {parseFloat(token?.tokenDayData[0]?.dailyVolumeUSD).toFixed(4)}</TableRowItem>
                <TableRowItem>$ {millify(parseFloat(token?.tokenDayData[0]?.totalLiquidityUSD || 0))}</TableRowItem>
              </TableRow>
            ))}
          </tbody>
        </table>
      </Column>
    </Container>
  )
}

export default TopTradingAssets
