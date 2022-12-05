import { Interface } from '@ethersproject/abi'
import { abi as BRIDGE_ABI } from './bridge.json'
import { abi as BRIDGE_BSC_ABI } from './bridge_bsc.json'

const BRIDGE_INTERFACE = new Interface(BRIDGE_ABI)
const BRIDGE_ADDRESS = '0x4a416F8FAD51083d7AA782B78B204Fe5331b599D'

const BRIDGE_BSC_INTERFACE = new Interface(BRIDGE_ABI)
const BRIDGE_BSC_ADDRESS = '0x0B9A5412d25136Ce6ED352dC10C920427B84767F'

export default {}
export { BRIDGE_ABI, BRIDGE_ADDRESS, BRIDGE_BSC_ABI, BRIDGE_BSC_ADDRESS, BRIDGE_BSC_INTERFACE, BRIDGE_INTERFACE }
