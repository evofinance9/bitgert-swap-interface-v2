import { Contract } from '@ethersproject/contracts'
import { ChainId, WETH } from '@evofinance9/sdk'
import { abi as IUniswapV2PairABI } from '@uniswap/v2-core/build/IUniswapV2Pair.json'
import { useMemo } from 'react'
import { REWARD_ABI, REWARD_ADDRESS } from 'constants/abis/reward'
import { PRESALE_ABI, PRESALE_ADDRESS, DATETIME_ABI, DATETIME_ADDRESS } from 'constants/abis/presale'
import { AIRDROP_ABI, AIRDROP_ADDRESS } from '../constants/abis/airdrop'
import { FARM_ABI, FARM_ADDRESS } from '../constants/abis/farm'
import { STAKE_ABI, STAKE_ADDRESS } from '../constants/abis/stake'
import { LOCK_ABI, LOCK_ADDRESS } from '../constants/abis/lock'
import { BRIDGE_ABI, BRIDGE_ADDRESS, BRIDGE_BSC_ABI, BRIDGE_BSC_ADDRESS } from '../constants/abis/bridge'
import ENS_ABI from '../constants/abis/ens-registrar.json'
import ENS_PUBLIC_RESOLVER_ABI from '../constants/abis/ens-public-resolver.json'
import { ERC20_BYTES32_ABI } from '../constants/abis/erc20'
import ERC20_ABI from '../constants/abis/erc20.json'
import WETH_ABI from '../constants/abis/weth.json'
import { MULTICALL_ABI, MULTICALL_NETWORKS } from '../constants/multicall'
import { getContract } from '../utils'
import { useActiveWeb3React } from './index'

// returns null on errors
function useContract(address: string | undefined, ABI: any, withSignerIfPossible = true): Contract | null {
  const { library, account } = useActiveWeb3React()

  return useMemo(() => {
    if (!address || !ABI || !library) return null
    try {
      return getContract(address, ABI, library, withSignerIfPossible && account ? account : undefined)
    } catch (error) {
      console.error('Failed to get contract', error)
      return null
    }
  }, [address, ABI, library, withSignerIfPossible, account])
}

export function useTokenContract(tokenAddress?: string, withSignerIfPossible?: boolean): Contract | null {
  return useContract(tokenAddress, ERC20_ABI, withSignerIfPossible)
}

export function useWETHContract(withSignerIfPossible?: boolean): Contract | null {
  const { chainId } = useActiveWeb3React()
  return useContract(chainId ? WETH[chainId].address : undefined, WETH_ABI, withSignerIfPossible)
}

export function useENSRegistrarContract(withSignerIfPossible?: boolean): Contract | null {
  const { chainId } = useActiveWeb3React()
  let address: string | undefined
  if (chainId) {
    switch (chainId) {
      case ChainId.MAINNET:
      case ChainId.TESTNET:
    }
  }
  return useContract(address, ENS_ABI, withSignerIfPossible)
}

export function useENSResolverContract(address: string | undefined, withSignerIfPossible?: boolean): Contract | null {
  return useContract(address, ENS_PUBLIC_RESOLVER_ABI, withSignerIfPossible)
}

export function useBytes32TokenContract(tokenAddress?: string, withSignerIfPossible?: boolean): Contract | null {
  return useContract(tokenAddress, ERC20_BYTES32_ABI, withSignerIfPossible)
}

export function usePairContract(pairAddress?: string, withSignerIfPossible?: boolean): Contract | null {
  return useContract(pairAddress, IUniswapV2PairABI, withSignerIfPossible)
}

export function useMulticallContract(): Contract | null {
  const { chainId } = useActiveWeb3React()
  return useContract(chainId && MULTICALL_NETWORKS[chainId], MULTICALL_ABI, false)
}

export function useRewardContract(withSignerIfPossible?: boolean): Contract | null {
  return useContract(REWARD_ADDRESS, REWARD_ABI, withSignerIfPossible)
}

export function usePresaleContract(withSignerIfPossible?: boolean): Contract | null {
  return useContract(PRESALE_ADDRESS, PRESALE_ABI, withSignerIfPossible)
}

export function useDateTimeContract(withSignerIfPossible?: boolean): Contract | null {
  return useContract(DATETIME_ADDRESS, DATETIME_ABI, withSignerIfPossible)
}

export function useAirdropContract(withSignerIfPossible?: boolean): Contract | null {
  return useContract(AIRDROP_ADDRESS, AIRDROP_ABI, withSignerIfPossible)
}

export function useFarmContract(withSignerIfPossible?: boolean): Contract | null {
  return useContract(FARM_ADDRESS, FARM_ABI, withSignerIfPossible)
}

export function useStakeContract(withSignerIfPossible?: boolean): Contract | null {
  return useContract(STAKE_ADDRESS, STAKE_ABI, withSignerIfPossible)
}

export function useBitgertLockContract(withSignerIfPossible?: boolean): Contract | null {
  return useContract(LOCK_ADDRESS, LOCK_ABI, withSignerIfPossible)
}

export function useBridgeContractBrise(withSignerIfPossible?: boolean): Contract | null {
  return useContract(BRIDGE_ADDRESS, BRIDGE_ABI, withSignerIfPossible)
}

export function useBridgeContractBSC(withSignerIfPossible?: boolean): Contract | null {
  return useContract(BRIDGE_BSC_ADDRESS, BRIDGE_BSC_ABI, withSignerIfPossible)
}
