import { BigNumberish } from 'ethers'
import { BigNumber as BN } from 'bignumber.js'
import { Contract } from '@ethersproject/contracts'
import { getAddress } from '@ethersproject/address'
import { AddressZero } from '@ethersproject/constants'
import { JsonRpcSigner, Web3Provider } from '@ethersproject/providers'
import { BigNumber } from '@ethersproject/bignumber'
import { ChainId, JSBI, Percent, Token, CurrencyAmount, Currency, ETHER } from '@evofinance9/sdk'
import { REWARD_ABI, REWARD_ADDRESS } from 'constants/abis/reward'
import { PRESALE_ABI, PRESALE_ADDRESS } from 'constants/abis/presale'
import { AIRDROP_ABI, AIRDROP_ADDRESS } from 'constants/abis/airdrop'
import { FARM_ABI, FARM_ADDRESS } from 'constants/abis/farm'
import { STAKE_ABI, STAKE_ADDRESS } from 'constants/abis/stake'
import { SIGCHECK_ABI, SIGCHECK_ADDRESS } from 'constants/abis/sigCheck'
import { TOKEN_CREATOR_ABI, TOKEN_CREATOR_ADDRESS } from 'constants/abis/erc20'
import { LOCK_ABI, LOCK_ADDRESS } from 'constants/abis/lock'
import ERC20_ABI from 'constants/abis/erc20.json'
import { ROUTER_ABI, ROUTER_ADDRESS } from '../constants'
import { BRIDGE_ABI, BRIDGE_ADDRESS, BRIDGE_BSC_ABI, BRIDGE_BSC_ADDRESS } from '../constants/abis/bridge'
import { TokenAddressMap } from '../state/lists/hooks'

// returns the checksummed address if the address is valid, otherwise returns false
export function isAddress(value: any): string | false {
  try {
    return getAddress(value)
  } catch {
    return false
  }
}

const BSCSCAN_PREFIXES: { [chainId in ChainId]: string } = {
  32520: 'https://brisescan.com',
  64668: 'https://testnet-explorer.brisescan.com',
  97: 'https://testnet.bscscan.com',
  56: 'https://bscscan.com',
}

export function getBscScanLink(chainId: ChainId, data: string, type: 'transaction' | 'token' | 'address'): string {
  const prefix = `${BSCSCAN_PREFIXES[chainId] || BSCSCAN_PREFIXES[ChainId.MAINNET]}`

  switch (type) {
    case 'transaction': {
      return `${prefix}/tx/${data}`
    }
    case 'token': {
      return `${prefix}/token/${data}`
    }
    case 'address':
    default: {
      return `${prefix}/address/${data}`
    }
  }
}

// shorten the checksummed version of the input address to have 0x + 4 characters at start and end
export function shortenAddress(address: string, chars = 4): string {
  const parsed = isAddress(address)
  if (!parsed) {
    throw Error(`Invalid 'address' parameter '${address}'.`)
  }
  return `${parsed.substring(0, chars + 2)}...${parsed.substring(42 - chars)}`
}

// add 10%
export function calculateGasMargin(value: BigNumber): BigNumber {
  return value.mul(BigNumber.from(10000).add(BigNumber.from(1000))).div(BigNumber.from(10000))
}

// converts a basis points value to a sdk percent
export function basisPointsToPercent(num: number): Percent {
  return new Percent(JSBI.BigInt(Math.floor(num)), JSBI.BigInt(10000))
}

export function calculateSlippageAmount(value: CurrencyAmount, slippage: number): [JSBI, JSBI] {
  if (slippage < 0 || slippage > 10000) {
    throw Error(`Unexpected slippage value: ${slippage}`)
  }
  return [
    JSBI.divide(JSBI.multiply(value.raw, JSBI.BigInt(10000 - slippage)), JSBI.BigInt(10000)),
    JSBI.divide(JSBI.multiply(value.raw, JSBI.BigInt(10000 + slippage)), JSBI.BigInt(10000)),
  ]
}

// account is not optional
export function getSigner(library: Web3Provider, account: string): JsonRpcSigner {
  return library.getSigner(account).connectUnchecked()
}

// account is optional
export function getProviderOrSigner(library: Web3Provider, account?: string): Web3Provider | JsonRpcSigner {
  return account ? getSigner(library, account) : library
}

// account is optional
export function getContract(address: string, ABI: any, library: Web3Provider, account?: string): Contract {
  if (!isAddress(address) || address === AddressZero) {
    throw Error(`Invalid 'address' parameter '${address}'.`)
  }

  return new Contract(address, ABI, getProviderOrSigner(library, account) as any)
}

// account is optional
export function getRouterContract(_: number, library: Web3Provider, account?: string): Contract {
  return getContract(ROUTER_ADDRESS, ROUTER_ABI, library, account)
}

export function getRewardContract(_: number, library: Web3Provider, account?: string): Contract {
  return getContract(REWARD_ADDRESS, REWARD_ABI, library, account)
}

export function getPresaleContract(_: number, library: Web3Provider, account?: string): Contract {
  return getContract(PRESALE_ADDRESS, PRESALE_ABI, library, account)
}

export function getAirdropContract(_: number, library: Web3Provider, account?: string): Contract {
  return getContract(AIRDROP_ADDRESS, AIRDROP_ABI, library, account)
}

export function getFarmContract(_: number, library: Web3Provider, account?: string): Contract {
  return getContract(FARM_ADDRESS, FARM_ABI, library, account)
}

export function getStakeContract(_: number, library: Web3Provider, account?: string): Contract {
  return getContract(STAKE_ADDRESS, STAKE_ABI, library, account)
}

export function getSigCheckContract(_: number, library: Web3Provider, account?: string): Contract {
  return getContract(SIGCHECK_ADDRESS, SIGCHECK_ABI, library, account)
}

export function getTokenCreatorContract(_: number, library: Web3Provider, account?: string): Contract {
  return getContract(TOKEN_CREATOR_ADDRESS, TOKEN_CREATOR_ABI, library, account)
}

export function getBitgertLockContract(_: number, library: Web3Provider, account?: string): Contract {
  return getContract(LOCK_ADDRESS, LOCK_ABI, library, account)
}

export function getTokenContract(tokenAddress: string, library: Web3Provider, account?: string): Contract {
  return getContract(tokenAddress, ERC20_ABI, library, account)
}

export function getBriseBridgeContract(library: Web3Provider, account?: string): Contract {
  return getContract(BRIDGE_ADDRESS, BRIDGE_ABI, library, account)
}

export function getBscBridgeContract(library: Web3Provider, account?: string): Contract {
  return getContract(BRIDGE_BSC_ADDRESS, BRIDGE_BSC_ABI, library, account)
}

export function escapeRegExp(string: string): string {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') // $& means the whole matched string
}

export function isTokenOnList(defaultTokens: TokenAddressMap, currency?: Currency): boolean {
  if (currency === ETHER) return true
  return Boolean(currency instanceof Token && defaultTokens[currency.chainId]?.[currency.address])
}

export const bnDivideByDecimal = (a: BigNumberish) => {
  return new BN(a.toString()).dividedBy(new BN(1e18))
}

export const bnSub = (a: BigNumberish, b: BigNumberish ) => {
  return new BN(a.toString()).minus(new BN(b.toString()))
}

export const bnMultiplyByDecimal = (a: string, decimal: number) => {
  return new BN(a).multipliedBy(new BN(10 ** decimal))
}

export const formatTokenAmount = (a: string, decimal: number) => {
  return new BN(a).dividedBy(new BN(10 ** decimal)).toNumber()
}
