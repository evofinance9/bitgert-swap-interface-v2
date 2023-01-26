import { Interface } from '@ethersproject/abi'
import { abi as BRIDGE_ABI } from './bridge.json'
import { abi as BRIDGE_BSC_ABI } from './bridge_bsc.json'

const BRIDGE_INTERFACE = new Interface(BRIDGE_ABI)
const BRIDGE_ADDRESS = '0x9C0dAe2AA37201F18b40e534Cfd7663272a954b6'

const BRIDGE_BSC_INTERFACE = new Interface(BRIDGE_ABI)
const BRIDGE_BSC_ADDRESS = '0x05B149F6bC7254A1355B448B9e88667924140afb'

export default {}
export { BRIDGE_ABI, BRIDGE_ADDRESS, BRIDGE_BSC_ABI, BRIDGE_BSC_ADDRESS, BRIDGE_BSC_INTERFACE, BRIDGE_INTERFACE }
