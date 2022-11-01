/* eslint-disable */
import React from 'react'
import { CardBody, Flex } from '@evofinance9/uikit'
import { InputExtended, FormLabel, InputExtension } from './styleds'

interface FormComponentProps {
  handleChange: (params: any) => any
  data: { router_rate: string; listing_rate: string }
}

export default function SwapInfo({ handleChange, data }: FormComponentProps) {
  const { router_rate, listing_rate } = data

  return (
    <CardBody>
      <Flex flexDirection="column">
        <FormLabel htmlFor="inputRouterRate">
          Enter the percentage of raised funds that should be allocated to Liquidity on BitgertSwap (Min 0%, Max 100%,
          We recommend &gt; 70%)
        </FormLabel>

        <Flex alignItems="center">
          <InputExtended
            placeholder=""
            id="inputRouterRate"
            scale="lg"
            type="number"
            value={router_rate}
            onChange={handleChange('router_rate')}
          />
          <InputExtension>%</InputExtension>
        </Flex>
      </Flex>

      <Flex flexDirection="column">
        <FormLabel htmlFor="inputListingRate">
          Enter the BitgertSwap listing price: (If I buy 1 BRISE worth on Swap how many tokens do I get? Usually this
          amount is lower than presale rate to allow for a higher listing price on Swap)
        </FormLabel>

        <Flex alignItems="center">
          <InputExtended
            placeholder=""
            className="mt-3"
            scale="lg"
            type="number"
            value={listing_rate}
            onChange={handleChange('listing_rate')}
          />
          <InputExtension>Per BRISE</InputExtension>
        </Flex>
      </Flex>
    </CardBody>
  )
}
