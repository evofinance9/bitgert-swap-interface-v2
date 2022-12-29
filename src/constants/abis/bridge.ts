import { Interface } from '@ethersproject/abi'
import { abi as BRIDGE_ABI } from './bridge.json'
import { abi as BRIDGE_BSC_ABI } from './bridge_bsc.json'

const BRIDGE_INTERFACE = new Interface(BRIDGE_ABI)
const BRIDGE_ADDRESS = '0x657326020f4356213F5731f8Ca83B69b80980340'

const BRIDGE_BSC_INTERFACE = new Interface(BRIDGE_ABI)
const BRIDGE_BSC_ADDRESS = '0x6ea9FbebCee941C1162788d6F8036D1bd0060faB'

export default {}
export { BRIDGE_ABI, BRIDGE_ADDRESS, BRIDGE_BSC_ABI, BRIDGE_BSC_ADDRESS, BRIDGE_BSC_INTERFACE, BRIDGE_INTERFACE }
