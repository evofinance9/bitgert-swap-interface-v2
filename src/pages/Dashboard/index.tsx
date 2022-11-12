import React from 'react'
import millify from 'millify'
import { useQuery, gql } from '@apollo/client'
import { ChartIcon } from '@evofinance9/uikit'

import { FaChartLine } from 'react-icons/fa'

import { CgCircleci } from 'react-icons/cg'
import { IoFileTray } from 'react-icons/io5'

import Chart from 'components/Chart'
import Banner from 'components/Banner'
import Liquidity from 'components/Chart/Liquidity'
import TopTradingAssets from 'components/Dashboard/TopTradingAssets'

import {
  ContainerExtended,
  Column,
  BannerContainer,
  BannerWrapper,
  IconGrid,
  IconGridRowContainer,
  IconGridHeader,
  IconGridSub,
  IconGridContainer,
  ChartContainer,
  SidebarContainer,
  IconWrapper,
  ColumnHeader,
} from './styleds'

const FACTORY_QUERY = gql`
  {
    uniswapFactory(id: "0x456405E3d355ad27010Fd87e3c7cC8a2DcA372fD") {
      totalVolumeUSD
      totalVolumeETH
      totalLiquidityUSD
    }

    token(id: "0xc1f9bdd0603665b9ae1e4d56e58240a018596b1a") {
      totalLiquidity
    }

    bundle(id: "1") {
      ethPrice
    }
  }
`

const Dashboard = () => {
  const { data } = useQuery(FACTORY_QUERY)

  return (
    <>
      <BannerContainer>
        <BannerWrapper>
          <Banner />
        </BannerWrapper>
      </BannerContainer>
      <ContainerExtended>
        <Column>
          <SidebarContainer>
            {/* <ColumnHeader>Liquidity</ColumnHeader>
            <Liquidity /> */}
          </SidebarContainer>
        </Column>

        <Column>
          <IconGridContainer>
            <IconGrid>
              <IconWrapper>
                <ChartIcon />
              </IconWrapper>
              <IconGridRowContainer>
                <IconGridHeader>Total Liquidity</IconGridHeader>
                <IconGridSub>$ {millify(parseFloat(data?.uniswapFactory?.totalLiquidityUSD)) || `0`} </IconGridSub>
              </IconGridRowContainer>
            </IconGrid>

            <IconGrid>
              <IconWrapper>
                <ChartIcon />
              </IconWrapper>
              <IconGridRowContainer>
                <IconGridHeader>Total Volume</IconGridHeader>
                <IconGridSub>{millify(parseFloat(data?.uniswapFactory?.totalVolumeETH)) || `0`} BRISE</IconGridSub>
              </IconGridRowContainer>
            </IconGrid>
            <IconGrid>
              <IconWrapper>
                <ChartIcon />
              </IconWrapper>
              <IconGridRowContainer>
                <IconGridHeader>Circulating Supply</IconGridHeader>
                <IconGridSub>{millify(parseFloat(data?.token?.totalLiquidity)) || `0`} BTS</IconGridSub>
              </IconGridRowContainer>
            </IconGrid>
          </IconGridContainer>

          {/* Price Charts */}
          <ChartContainer>
            <Chart />
          </ChartContainer>
        </Column>
      </ContainerExtended>

      <TopTradingAssets />
    </>
  )
}

export default Dashboard
