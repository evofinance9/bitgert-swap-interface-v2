import React, { useEffect, useState } from 'react'
import moment from 'moment'
import styled from 'styled-components'
import { useQuery, gql } from '@apollo/client'
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts'

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

  const [data, setData] = useState([])

  useEffect(() => {
    if (!graphData) return
    const { uniswapDayDatas } = graphData
    const formattedData = uniswapDayDatas.map((uniswapDayData) => ({
      ...uniswapDayData,
      liquidity: parseFloat(uniswapDayData.totalLiquidityUSD).toFixed(4),
      date: moment.unix(uniswapDayData.date).format('DD MMM'),
    }))
    setData(formattedData)
  }, [graphData])

  return (
    <ChartContainer>
      {data && (
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={data}
          >
            <XAxis strokeWidth={0} dataKey="date" tick={false} />
            <YAxis strokeWidth={0} domain={[0, 400000]} />
            <Tooltip />
            <Area type="monotone" dataKey="liquidity" stroke="#2669f5" fill="#f0f5ff" />
          </AreaChart>
        </ResponsiveContainer>
      )}
    </ChartContainer>
  )
}

export default Liquidity
