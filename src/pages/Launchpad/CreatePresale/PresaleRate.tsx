/* eslint-disable */
import React from 'react'
import { CardBody } from '@evofinance9/uikit'
import { InputExtended, Flex } from './styleds'

interface FormComponentProps {
  handleChange: (params: any) => any
  data: {
    soft_cap: string
    hard_cap: string
    tier1: string
    tier2: string
    tier3: string
    min_buy: string
    max_buy: string
  }
}

export default function PresaleRate({ handleChange, data }: FormComponentProps) {
  const { soft_cap, hard_cap, tier1, tier2, tier3, min_buy, max_buy } = data

  return (
    <CardBody>
      <Flex>
        <InputExtended
          placeholder="Soft Cap *(BRISE)"
          scale="lg"
          type="number"
          value={soft_cap}
          onChange={handleChange('soft_cap')}
        />

        <InputExtended
          placeholder="Hard Cap *(BRISE)"
          className="mt-3"
          scale="lg"
          type="number"
          value={hard_cap}
          onChange={handleChange('hard_cap')}
        />
      </Flex>

      <Flex>
        <InputExtended type="number" placeholder="Tier 1 *(Per BRISE)" scale="lg" value={tier1} onChange={handleChange('tier1')} />

        <InputExtended type="number" placeholder="Tier 2 *(Per BRISE)" scale="lg" value={tier2} onChange={handleChange('tier2')} />

        <InputExtended type="number" placeholder="Public *(Per BRISE)" scale="lg" value={tier3} onChange={handleChange('tier3')} />
      </Flex>

      <Flex>
        <InputExtended
          placeholder="Min Buy *(Per BRISE)"
          scale="lg"
          type="number"
          value={min_buy}
          onChange={handleChange('min_buy')}
        />

        <InputExtended
          placeholder="Max Buy *(Per BRISE)"
          scale="lg"
          type="number"
          value={max_buy}
          onChange={handleChange('max_buy')}
        />
      </Flex>
    </CardBody>
  )
}
