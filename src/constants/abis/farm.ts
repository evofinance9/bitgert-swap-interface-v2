import { Interface } from '@ethersproject/abi'
import { abi as FARM_ABI } from './farm.json'

const FARM_INTERFACE = new Interface(FARM_ABI)
const FARM_ADDRESS = '0x93fcF326b17ac9F7F0F01Ba6E117aC2FF2e02658'

export default FARM_INTERFACE
export { FARM_ABI, FARM_ADDRESS }
