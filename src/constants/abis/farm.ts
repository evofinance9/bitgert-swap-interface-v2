import { Interface } from '@ethersproject/abi'
import { abi as FARM_ABI } from './farm.json'

const FARM_INTERFACE = new Interface(FARM_ABI)
const FARM_ADDRESS = '0x665F3be38e0caE237a6bd98F660e0bf7a3a9a93B'

export default FARM_INTERFACE
export { FARM_ABI, FARM_ADDRESS }
