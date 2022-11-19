import React, { useEffect, useState } from 'react'
import moment from 'moment'
import styled from 'styled-components'
import { useQuery, gql } from '@apollo/client'
import { Area } from '@ant-design/plots'

const ChartContainer = styled.div`
  height: 400px;
  margin-top: 3rem;
`

const DAY_UPDATE_QUERY = gql`
  {
    uniswapDayDatas(skip: 50) {
      date
      totalLiquidityUSD
    }

    bundle(id: "1") {
      ethPrice
    }
  }
`

const Liquidity = () => {
  const { data: graphData } = useQuery(DAY_UPDATE_QUERY)
  const [chartConfig, setChartConfig] = useState<any | null>(null)

  useEffect(() => {
    if (!graphData) return
    const { uniswapDayDatas } = graphData
    const formattedData = uniswapDayDatas.map((uniswapDayData) => ({
      ...uniswapDayData,
      liquidity: parseFloat(uniswapDayData.totalLiquidityUSD),
      Date: moment.unix(uniswapDayData.date).format('YYYY-MM-DD'),
    }))
    setChartConfig({
      data: formattedData,
      xField: 'Date',
      yField: 'liquidity',
      xAxis: {
        type: 'time',
        tickCount: 5,
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
  }, [graphData])

  return <ChartContainer>{chartConfig && <Area {...chartConfig} />}</ChartContainer>
}

export default Liquidity
