import { Interface } from '@ethersproject/abi'
import { abi as FARM_ABI } from './farm.json'

const FARM_INTERFACE = new Interface(FARM_ABI)
const FARM_ADDRESS = '0x3c41c60c9189a5238A92E6Ce0C59240E8139CC88'

export default FARM_INTERFACE
export { FARM_ABI, FARM_ADDRESS }
