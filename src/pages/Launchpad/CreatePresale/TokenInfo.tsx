/* eslint-disable */
import React, { useEffect } from 'react'
import { CardBody } from '@evofinance9/uikit'

import { useToken } from 'hooks/Tokens'

import { InputExtended } from './styleds'

interface FormComponentProps {
  handleChange: (params: any) => any
  handleChangeWithoutEvent: (a: { token_name: string; token_symbol: string; token_decimal: string }) => any
  data: { token_address: string; token_name: string; token_symbol: string; token_decimal: string }
}

export default function TokenInfo({ handleChange, data, handleChangeWithoutEvent }: FormComponentProps) {
  const { token_address, token_name, token_symbol, token_decimal } = data
  const token = useToken(token_address)

  // fetch token detail
  useEffect(() => {
    if (!token) return
    handleChangeWithoutEvent({
      token_name: token?.name || '',
      token_symbol: token?.symbol || '',
      token_decimal: token?.decimals.toString() || '',
    })
  }, [token])

  return (
    <CardBody>
      <InputExtended
        placeholder="Token Address"
        className="mt-3"
        value={token_address}
        scale="lg"
        onChange={handleChange('token_address')}
      />
      <InputExtended
        placeholder="Token Name"
        scale="lg"
        className="mt-3"
        value={token_name}
        onChange={handleChange('token_name')}
      />
      <InputExtended
        placeholder="Token Symbol"
        scale="lg"
        className="mt-3"
        value={token_symbol}
        onChange={handleChange('token_symbol')}
      />
      <InputExtended
        placeholder="Token Decimal"
        className="mt-3"
        type="number"
        scale="lg"
        value={token_decimal}
        onChange={handleChange('token_decimal')}
      />
    </CardBody>
  )
}
